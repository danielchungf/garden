import { type LucideIcon } from "lucide-react";

interface IconButtonBaseProps {
  icon: LucideIcon;
  className?: string;
}

interface IconButtonAsButton
  extends IconButtonBaseProps,
    Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className"> {
  href?: never;
}

interface IconButtonAsLink
  extends IconButtonBaseProps,
    Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "className"> {
  href: string;
}

type IconButtonProps = IconButtonAsButton | IconButtonAsLink;

export function IconButton({ icon: Icon, className, ...props }: IconButtonProps) {
  const classes = `w-9 h-9 rounded-full bg-neutral-100 hover:bg-neutral-150 border border-neutral-150 transition-colors flex items-center justify-center ${className ?? ""}`;

  if ("href" in props && props.href) {
    return (
      <a {...props} className={classes}>
        <Icon size={18} className="text-content-tertiary" />
      </a>
    );
  }

  return (
    <button {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)} className={classes}>
      <Icon size={18} className="text-content-tertiary" />
    </button>
  );
}
