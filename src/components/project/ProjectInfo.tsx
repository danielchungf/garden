import Image from 'next/image';
import { TeamMember } from '@/types/project';

interface ProjectInfoProps {
  title: string;
  url?: string;
  description: string[];
  team: TeamMember[];
  duration: string;
}

export default function ProjectInfo({ title, url, description, team, duration }: ProjectInfoProps) {
  return (
    <div>
      {/* Title - 12px gap to description */}
      {url ? (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-h1 text-content-primary hover:text-content-accent transition-colors mb-3 inline-flex items-center gap-3 group"
        >
          {title}
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-200 stroke-neutral-800 group-hover:stroke-[#FF591E]"
          >
            <path d="M7 17L17 7" />
            <path d="M7 7h10v10" />
          </svg>
        </a>
      ) : (
        <h1 className="text-h1 text-content-primary mb-3">{title}</h1>
      )}

      {/* Description - 32px gap to metadata */}
      <div className="space-y-4 mb-8">
        {description.map((paragraph, index) => (
          <p key={index} className="text-body-regular text-content-primary">
            {paragraph}
          </p>
        ))}
      </div>

      {/* Metadata grid */}
      <div className="grid grid-cols-2 gap-8">
        <div>
          <h3 className="text-h3 text-content-secondary uppercase mb-2">Team</h3>
          <ul className="space-y-2">
            {team.map((member) => (
              <li key={member.name} className="flex items-center gap-2">
                {member.avatar && member.url ? (
                  <a href={member.url} target="_blank" rel="noopener noreferrer">
                    <Image
                      src={member.avatar}
                      alt={member.name}
                      width={28}
                      height={28}
                      className="rounded-full object-cover w-7 h-7"
                    />
                  </a>
                ) : member.avatar ? (
                  <Image
                    src={member.avatar}
                    alt={member.name}
                    width={28}
                    height={28}
                    className="rounded-full object-cover w-7 h-7"
                  />
                ) : null}
                {member.url ? (
                  <a
                    href={member.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-body-small text-content-primary hover:text-content-accent transition-colors inline-flex items-center gap-1 group"
                  >
                    {member.name}
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-200 stroke-neutral-800 group-hover:stroke-[#FF591E]"
                    >
                      <path d="M7 17L17 7" />
                      <path d="M7 7h10v10" />
                    </svg>
                  </a>
                ) : (
                  <span className="text-body-small text-content-primary">
                    {member.name}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-h3 text-content-secondary uppercase mb-2">Duration</h3>
          <p className="text-body-small text-content-primary">{duration}</p>
        </div>
      </div>
    </div>
  );
}
