import Image from "next/image";
import Link from "next/link";

import logo from "@/lib/images/logo-optimized.webp";
import { cn } from "@/lib/utils";

export function BrandLogo({
  className,
  imageClassName,
  asHomeLink = true,
  priority = false,
  onClick,
}: {
  className?: string;
  imageClassName?: string;
  asHomeLink?: boolean;
  priority?: boolean;
  onClick?: () => void;
}) {
  const logoImage = (
    <Image
      src={logo}
      alt="Castrol Georgia"
      priority={priority}
      width={420}
      height={78}
      sizes="(max-width: 640px) 160px, 220px"
      className={cn("h-10 w-auto object-contain sm:h-11", imageClassName)}
    />
  );

  if (asHomeLink) {
    return (
      <Link href="/" onClick={onClick} aria-label="Go to home page" className={cn("inline-flex items-center", className)}>
        {logoImage}
      </Link>
    );
  }

  return (
    <div className={cn("inline-flex items-center", className)} onClick={onClick}>
      {logoImage}
    </div>
  );
}
