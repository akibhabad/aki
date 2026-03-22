export interface ProjectSections {
  context?: string[]
  build?: string[]
  outcome?: string[]
  extension?: string[]
  insight?: string[]
}

export interface ProjectLink {
  label: string
  href: string
}

export interface Project {
  date: string
  title: string
  sections: ProjectSections
  stack?: string[]
  links?: ProjectLink[]
}

export const projects: Project[] = [
  {
    date: 'April 2025',
    title: 'Private ChatGPT Wrapper',
    sections: {
      context: [
        'High school network blocked all AI tools — ChatGPT, etc.',
        'Cell service was unreliable on campus.',
        'I wanted unrestricted access to AI for studying and experimenting.',
      ],
      build: [
        'Built a full wrapper around the OpenAI API (GPT-3.5 at the time).',
        'Deployed on an unblocked domain with authentication to control usage.',
        'Only approved users could access to avoid API abuse.',
      ],
      outcome: [
        'Restored access to AI tools in a restricted environment.',
        'First time building a full-stack product out of pure frustration.',
      ],
      insight: [
        'This was my first experience with what I now think of as "vibe coding" — building fast, iterating without over-planning, using tools as leverage instead of obstacles.',
      ],
    },
    stack: ['React', 'Vercel', 'OpenAI API', 'Supabase'],
  },
  {
    date: 'June 2025',
    title: 'Frontend Experiments + First Client Work',
    sections: {
      context: [
        'Realized frontend development was shifting fast with AI.',
        'Traditional learning (WordPress, raw HTML/CSS) felt increasingly inefficient.',
      ],
      build: [
        'Built and shipped multiple real websites.',
        'detail-lab.store (car detailing business)',
        'usealusa.com (sealcoating company)',
        'At the same time, formalized my own web development brand.',
      ],
      outcome: [
        'First real client-facing builds.',
        'Started thinking in terms of systems, speed, and iteration instead of static development.',
      ],
      extension: [
        'Founded Celestia Solutions — a web development and automation brand.',
      ],
      insight: [
        'Frontend became less about syntax and more about taste, speed, and iteration cycles.',
        'AI shifted the bottleneck from coding to decision-making.',
      ],
    },
    stack: ['Next.js', 'React', 'Vercel', 'Tailwind', 'Modern UI tooling'],
  },
  {
    date: 'August 2025',
    title: 'UNC Class Seat Monitor',
    sections: {
      context: [
        'As a freshman, I missed most of my desired classes due to high demand.',
        'Many classes had no waitlist system.',
      ],
      build: [
        'Built a scraper that checked class seat availability every few minutes.',
        'Used GitHub Actions to run continuously.',
        'Triggered instant email alerts when a seat opened.',
      ],
      outcome: [
        'Successfully secured 6 class sections (for myself + friends).',
        'Turned a broken system into something workable.',
      ],
      insight: [
        'Small tools, built quickly, can massively change outcomes.',
        'Automation > frustration.',
      ],
    },
    stack: ['Web scraping', 'GitHub Actions', 'Email notifications'],
  },
]
