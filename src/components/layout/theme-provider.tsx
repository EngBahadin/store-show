"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ComponentProps } from "react";

/**
 * next-themes renders an inline <script> that applies the stored theme before
 * first paint. React only executes such a script when the browser parses it out
 * of the SSR HTML — on a client render (e.g. a soft navigation between locales)
 * it creates an inert element and warns about it. Marking the tag as a
 * non-executable data block on the client keeps the warning away; the server
 * still emits a real, executing script. next-themes already sets
 * suppressHydrationWarning on the tag, so the type mismatch is tolerated.
 */
export function ThemeProvider({
  children,
  ...props
}: ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider
      {...props}
      scriptProps={{
        type: typeof window === "undefined" ? "text/javascript" : "text/plain",
      }}
    >
      {children}
    </NextThemesProvider>
  );
}
