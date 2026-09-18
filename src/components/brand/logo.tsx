import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  variant?: "wordmark" | "mark";
  className?: string;
  href?: string;
  priority?: boolean;
}

export function Logo({
  variant = "wordmark",
  className = "",
  href,
  priority = true,
}: LogoProps) {
  const isWordmark = variant === "wordmark";

  const content = (
    <div className={`inline-flex items-center select-none ${className}`}>
      {isWordmark ? (
        <div className="relative h-9 w-28 sm:h-11 sm:w-36 transition-opacity hover:opacity-90">
          <Image
            src="/brand/raven-wordmark-black.png"
            alt="RAVEN"
            fill
            sizes="144px"
            priority={priority}
            className="object-contain block dark:hidden"
          />
          <Image
            src="/brand/raven-wordmark-white.png"
            alt="RAVEN"
            fill
            sizes="144px"
            priority={priority}
            className="object-contain hidden dark:block"
          />
        </div>
      ) : (
        <div className="relative h-8 w-8 sm:h-10 sm:w-10 transition-opacity hover:opacity-90">
          <Image
            src="/brand/raven-mark-black.png"
            alt="RAVEN"
            fill
            sizes="40px"
            priority={priority}
            className="object-contain block dark:hidden"
          />
          <Image
            src="/brand/raven-mark-white.png"
            alt="RAVEN"
            fill
            sizes="40px"
            priority={priority}
            className="object-contain hidden dark:block"
          />
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex focus:outline-none">
        {content}
      </Link>
    );
  }

  return content;
}
