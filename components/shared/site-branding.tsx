import Image from "next/image";
import Link from "next/link";

export const SiteBranding = () => {
  return (
    <Link
      href="/"
      className="flex items-center space-x-2 transition hover:opacity-75">
      <Image
        src="/pokemon-site-logo-0.svg"
        alt="Pokedex logo"
        width={56}
        height={56}
        className="object-contain"
        priority={false} // Helps with Core Web Vitals
      />
      <span className="text-xl font-bold tracking-tight">PokeBuilder</span>
    </Link>
  );
};
