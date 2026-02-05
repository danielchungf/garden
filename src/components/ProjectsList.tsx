"use client";

import { PreviewCard } from "@base-ui/react/preview-card";

interface Project {
  name: string;
  href: string;
  description: string;
  image?: string;
}

const projects: Project[] = [
  {
    name: "Waffle",
    href: "https://heywaffle.app/",
    description: "This is the first personal project I shipped. Waffle is a visual organization board with personalized widgets: to-dos, weather, calendar, and more.",
    image: "/waffle-cover.jpg",
  },
  {
    name: "Piper",
    href: "https://www.piper.travel/",
    description: "I travel a lot, so I built the travel planner and companion I always needed. Plan each day with activities, save places from Google Maps, visualize it in a calendar.",
    image: "/piper-mini.png",
  },
  {
    name: "SipSip",
    href: "https://sipsip.cafe/",
    description: "I drink more coffee than I should. I made this fun little app to log my daily cups of coffee, so I can keep track of my caffeine intake and who I share them with.",
    image: "/sipsip-mini.png",
  },
];

export default function ProjectsList() {
  return (
    <div className="flex flex-col flex-1">
      <h2 className="text-h3 text-content-secondary uppercase mb-3">Projects</h2>
      {projects.map((project) => (
        <PreviewCard.Root key={project.name}>
          <PreviewCard.Trigger
            href={project.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-body-small text-content-primary hover:text-content-accent w-fit"
          >
            {project.name}
          </PreviewCard.Trigger>

          <PreviewCard.Portal>
            <PreviewCard.Positioner sideOffset={8}>
              <PreviewCard.Popup className="origin-[var(--transform-origin)] bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden w-80 transition-[transform,opacity] data-[starting-style]:scale-95 data-[starting-style]:opacity-0 data-[ending-style]:scale-95 data-[ending-style]:opacity-0">
                <PreviewCard.Arrow className="data-[side=bottom]:top-[-8px] data-[side=top]:bottom-[-8px] data-[side=left]:right-[-8px] data-[side=right]:left-[-8px]">
                  <svg width="20" height="10" viewBox="0 0 20 10" fill="none">
                    <path
                      d="M9.66437 2.60207L4.80758 6.97318C4.07308 7.63423 3.11989 8 2.13172 8H0V10H20V8H18.5349C17.5468 8 16.5936 7.63423 15.8591 6.97318L11.0023 2.60207C10.622 2.2598 10.0447 2.25979 9.66437 2.60207Z"
                      className="fill-white"
                    />
                    <path
                      d="M8.99542 1.85876C9.75604 1.17425 10.9106 1.17422 11.6713 1.85878L16.5281 6.22989C17.0789 6.72568 17.7938 7.00001 18.5349 7.00001L15.89 7L11.0023 2.60207C10.622 2.2598 10.0447 2.2598 9.66436 2.60207L4.77734 7L2.13171 7.00001C2.87284 7.00001 3.58774 6.72568 4.13861 6.22989L8.99542 1.85876Z"
                      className="fill-gray-200"
                    />
                  </svg>
                </PreviewCard.Arrow>
                {project.image && (
                  <img
                    src={project.image}
                    alt={project.name}
                    className="w-full h-32 object-cover"
                  />
                )}
                <div className="p-3">
                  <p className="text-body-small font-medium text-content-primary">
                    {project.name}
                  </p>
                  <p className="text-body-small text-content-secondary">
                    {project.description}
                  </p>
                </div>
              </PreviewCard.Popup>
            </PreviewCard.Positioner>
          </PreviewCard.Portal>
        </PreviewCard.Root>
      ))}
    </div>
  );
}
