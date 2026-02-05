"use client";

import { PreviewCard } from "@base-ui/react/preview-card";

interface PreviewCardProps {
  href: string;
  children: React.ReactNode;
  title?: string;
  description?: string;
  image?: string;
}

export function PreviewCardLink({
  href,
  children,
  title,
  description,
  image,
}: PreviewCardProps) {
  return (
    <PreviewCard.Root>
      <PreviewCard.Trigger
        href={href}
        className="text-content-primary underline underline-offset-2 hover:text-content-secondary transition-colors"
      >
        {children}
      </PreviewCard.Trigger>

      <PreviewCard.Portal>
        <PreviewCard.Positioner sideOffset={8}>
          <PreviewCard.Popup className="bg-surface-primary border border-border-primary rounded-lg shadow-lg p-4 max-w-xs">
            <PreviewCard.Arrow className="fill-surface-primary stroke-border-primary" />
            {image && (
              <img
                src={image}
                alt={title || "Preview"}
                className="w-full h-32 object-cover rounded-md mb-3"
              />
            )}
            {title && (
              <h4 className="text-body-small font-medium text-content-primary mb-1">
                {title}
              </h4>
            )}
            {description && (
              <p className="text-body-small text-content-secondary">
                {description}
              </p>
            )}
          </PreviewCard.Popup>
        </PreviewCard.Positioner>
      </PreviewCard.Portal>
    </PreviewCard.Root>
  );
}

export { PreviewCard };
