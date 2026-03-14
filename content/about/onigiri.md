## File Structure

Everything is markdown. Organized by what it is, not when it happened.

```
onigiri/
├── identity/             — Self-understanding. Beliefs, patterns.
├── goals/                — Annual goals tied to six life pillars.
├── health/               — Fitness, nutrition, movement.
├── people/
│   ├── work/             — Professional contacts and context.
│   └── personal/         — Friends and family.
├── routines/             — Morning routine, weekly review templates.
├── work/
│   ├── clients/          — Living docs for active clients.
│   ├── digests/          — Structured work logs, grouped by client.
│   ├── meetings/         — Meeting notes from Granola.
│   ├── briefings/        — Morning briefing captures.
│   └── tasks/            — Current tasks synced from SlackDone.
├── projects/             — Project plans and ideas.
├── journal/
│   ├── daily/            — How the day felt. Personal, freeform.
│   ├── weekly/           — Weekly reflections and progress.
│   └── monthly/          — Monthly summaries.
├── inbox/                — Raw thoughts. Messy on purpose.
├── resources/            — Reference material, eng lexicon.
├── growth/               — Learning logs and coaching notes.
├── logs/                 — Public activity feed entries.
├── music/                — Monthly Spotify data as JSON.
├── scripts/              — Automation scripts.
└── CLAUDE.md             — System instructions. The brain.
```

---

## Skills

Skills are slash commands that trigger specific workflows. Each one knows where to look, what to pull, and where to save the result.

| Skill | What it does |
|-------|-------------|
| `/morning` | Morning briefing — calendar, Figma comments, Slack catch-up, tasks, open loops |
| `/digest` | End-of-day work recap grouped by client, pulled from Slack, meetings, and the session |
| `/log` | Public activity feed entry — what I shipped, wrote, designed, listened to |
| `/recap` | Narrative story of my day — less structured, more human |
| `/save` | End-of-session save — updates journal, digest, people files, and CLAUDE.md |
| `/meeting-prep` | Pre-meeting briefing with context from Slack, Gmail, Granola, and past notes |
| `/define` | Add a term to my Engineering Lexicon — plain-language definitions with real examples |
| `/figma-comments` | Pull unresolved Figma comments across all monitored design files |
| `/music-recap` | Generate monthly Spotify top tracks for my music page |
| `/hn` | Top Hacker News stories, summarized |
| `/tasks` | Sync and display current tasks from SlackDone |
| `/skill-creator` | Guide for building new skills |
| `/reclaude` | Refactor CLAUDE.md using progressive disclosure |
| `/favicon` | Generate a full favicon set from a source image |

---

## Data Sources

Onigiri connects to the tools I already use. Nothing exotic — just the apps that run my day, wired into one system.

| Source | What it feeds |
|--------|--------------|
| Google Calendar | Morning briefings, meeting prep, daily schedule |
| Slack | Work context, team messages, client channels |
| Beeper | Cross-platform messages — iMessage, WhatsApp, Discord |
| Figma | Design comments, unresolved feedback across projects |
| Granola | Meeting transcripts, action items, attendee context |
| Gmail | Email threads for meeting prep and context |
| GitHub | Commits, diffs, and activity across all repos |
| Spotify | Recently played tracks, monthly top 50 |
| Shiori | Bookmarked links and articles |
| Hacker News | Top tech stories for morning briefings |

