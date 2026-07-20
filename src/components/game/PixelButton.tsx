import Link from "next/link";

type SharedProps = {
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "accent";
};

const variants = {
  primary: "bg-mustard text-navy hover:bg-sand",
  secondary: "bg-foam text-ocean-deep hover:bg-sky-bottom",
  accent: "bg-sunset text-foam hover:bg-coral",
};

function classes(variant: SharedProps["variant"], className?: string) {
  return [
    "pixel-btn font-press inline-flex items-center justify-center gap-2 px-4 py-2.5 text-[10px] uppercase leading-none tracking-wide",
    variants[variant ?? "primary"],
    className,
  ]
    .filter(Boolean)
    .join(" ");
}

export function PixelLink({
  href,
  children,
  className,
  variant = "primary",
  external,
}: SharedProps & { href: string; external?: boolean }) {
  const cls = classes(variant, className);
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}

export function PixelButton({
  children,
  className,
  variant = "primary",
  type = "button",
  onClick,
  "aria-label": ariaLabel,
}: SharedProps & {
  type?: "button" | "submit";
  onClick?: () => void;
  "aria-label"?: string;
}) {
  return (
    <button type={type} onClick={onClick} aria-label={ariaLabel} className={classes(variant, className)}>
      {children}
    </button>
  );
}
