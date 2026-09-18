"use client";

import { useSyncExternalStore } from "react";

/**
 * Shared plumbing for the localStorage-backed stores (cart, wishlist,
 * recently-viewed, seller).
 *
 * The site is statically exported, so every provider is rendered once at build
 * time with an empty state and then hydrated in the browser. Reading
 * localStorage during render would desync that hydration; reading it in an
 * effect and calling setState causes a cascading render. `useSyncExternalStore`
 * is the pattern that does neither: React renders `getServerSnapshot()` on the
 * server and through hydration, then subscribes — and the subscription is where
 * the stored value is loaded.
 */

type Listener = () => void;

/** What consumers see: the value plus whether localStorage has been read yet. */
export type Persisted<T> = {
  value: T;
  /** False until the browser has read localStorage. Render counts as `null`
   *  while this is false, or the server and client markup will disagree. */
  hydrated: boolean;
};

export type PersistedStore<T extends object> = {
  subscribe: (listener: Listener) => () => void;
  getSnapshot: () => Persisted<T>;
  getServerSnapshot: () => Persisted<T>;
  /** Replace the value and write it back to localStorage. */
  update: (updater: (prev: T) => T) => void;
};

type Options<T extends object> = {
  /** Namespaced key, e.g. "raven.cart". */
  key: string;
  /** Bumped when the payload shape changes; anything else on disk is dropped. */
  version: number;
  initial: T;
  /** Narrow a parsed payload, or return null to fall back to `initial`. */
  parse: (payload: Record<string, unknown>) => T | null;
};

export function createPersistedStore<T extends object>({
  key,
  version,
  initial,
  parse,
}: Options<T>): PersistedStore<T> {
  // Stable identity: React compares snapshots by reference, so this object must
  // not be rebuilt on every getSnapshot() call.
  const serverSnapshot: Persisted<T> = { value: initial, hydrated: false };
  let snapshot: Persisted<T> = serverSnapshot;

  const listeners = new Set<Listener>();
  const emit = () => listeners.forEach((listener) => listener());

  function read(): T {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return initial;
      const payload: unknown = JSON.parse(raw);
      if (!payload || typeof payload !== "object") return initial;
      const record = payload as Record<string, unknown>;
      // A payload written by an older version of the site is discarded rather
      // than half-read, so a shape change can't crash a returning visitor.
      if (record.v !== version) return initial;
      return parse(record) ?? initial;
    } catch (e) {
      // Private mode and blocked site-data both throw on access.
      console.warn(`Could not read ${key} from localStorage`, e);
      return initial;
    }
  }

  function write(value: T) {
    try {
      localStorage.setItem(key, JSON.stringify({ v: version, ...value }));
    } catch (e) {
      console.warn(`Could not save ${key} to localStorage`, e);
    }
  }

  return {
    subscribe(listener) {
      listeners.add(listener);
      // React runs this after the commit that hydrated the markup, which makes
      // it the first safe moment to look at localStorage.
      if (!snapshot.hydrated) {
        snapshot = { value: read(), hydrated: true };
        emit();
      }
      return () => {
        listeners.delete(listener);
      };
    },
    getSnapshot: () => snapshot,
    getServerSnapshot: () => serverSnapshot,
    update(updater) {
      const value = updater(snapshot.value);
      if (value === snapshot.value) return;
      snapshot = { value, hydrated: true };
      write(value);
      emit();
    },
  };
}

export function usePersistedStore<T extends object>(
  store: PersistedStore<T>,
): Persisted<T> {
  return useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getServerSnapshot,
  );
}

const noopSubscribe = () => () => {};

/**
 * False on the server and through hydration, true once mounted in the browser.
 * For components that legitimately cannot render the same markup in both
 * places — e.g. a theme toggle, which can't know the resolved theme until
 * next-themes has read the DOM.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}

let mountTime: number | null = null;

/**
 * The wall clock, frozen at the moment this page was hydrated.
 *
 * For values that genuinely mean "right now" — the admin's stale-listing count,
 * say. Reading `Date.now()` during render would give the build and the browser
 * different answers; this returns `serverValue` on the server and through
 * hydration, then the real clock. Shopper-facing freshness should use
 * `isNewArrival` instead, which is deterministic and needs no client clock.
 */
export function useMountTime(serverValue: number): number {
  return useSyncExternalStore(
    noopSubscribe,
    () => (mountTime ??= Date.now()),
    () => serverValue,
  );
}
