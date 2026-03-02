import { type LucideIcon } from "lucide-react";

interface IconButtonBaseProps {
  icon: LucideIcon;
  className?: string;
  tooltip?: string;
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

export function IconButton({ icon: Icon, className, tooltip, ...props }: IconButtonProps) {
  const classes = `w-9 h-9 rounded-full bg-neutral-100 hover:bg-neutral-150 border border-neutral-150 transition-colors flex items-center justify-center cursor-pointer ${className ?? ""}`;

  const content = ("href" in props && props.href) ? (
    <a {...props} className={classes}>
      <Icon size={18} className="text-content-tertiary" />
    </a>
  ) : (
    <button {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)} className={classes}>
      <Icon size={18} className="text-content-tertiary" />
    </button>
  );

  if (!tooltip) return content;

  return (
    <div className="relative group">
      {content}
      <span className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-2 py-1 rounded-md bg-neutral-800 text-white text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        {tooltip}
      </span>
    </div>
  );
}
