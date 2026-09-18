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
        <div className="relative flex items-center transition-opacity hover:opacity-90">
          <Image
            src="/brand/raven-wordmark-black.png"
            alt="RAVEN"
            width={870}
            height={331}
            priority={priority}
            className="h-6 sm:h-7 w-auto object-contain block dark:hidden shrink-0"
          />
          <Image
            src="/brand/raven-wordmark-white.png"
            alt="RAVEN"
            width={870}
            height={331}
            priority={priority}
            className="h-6 sm:h-7 w-auto object-contain hidden dark:block shrink-0"
          />
        </div>
      ) : (
        <div className="relative flex items-center transition-opacity hover:opacity-90">
          <Image
            src="/brand/raven-mark-black.png"
            alt="RAVEN"
            width={237}
            height={353}
            priority={priority}
            className="h-6 sm:h-7 w-auto object-contain block dark:hidden shrink-0"
          />
          <Image
            src="/brand/raven-mark-white.png"
            alt="RAVEN"
            width={237}
            height={353}
            priority={priority}
            className="h-6 sm:h-7 w-auto object-contain hidden dark:block shrink-0"
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
