"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {
  href: string;
  children: React.ReactNode;
  className?: string;
};

// Un lien de navigation : la page courante est marquée par une surface relevée.
export default function LienNav({ href, children, className = "inline-flex" }: Props) {
  const chemin = usePathname();
  const actif = href === "/" ? chemin === "/" : chemin.startsWith(href);
  return (
    <Link
      href={href}
      aria-current={actif ? "page" : undefined}
      className={`${className} h-8 items-center gap-2 rounded-lg px-2 text-sm sm:px-3 transition-colors duration-150 ease-doux ${
        actif ? "bg-releve font-medium text-texte" : "text-texte-2 hover:bg-releve hover:text-texte"
      }`}
    >
      {children}
    </Link>
  );
}
