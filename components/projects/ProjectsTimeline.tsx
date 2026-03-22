'use client'

import { useEffect, useState } from 'react'
import type { Project } from '@/data/projects'
import styles from './projects.module.css'

interface ProjectsTimelineProps {
  projects: Project[]
}

const sectionOrder = [
  { key: 'context', label: 'Context' },
  { key: 'build', label: 'Build' },
  { key: 'outcome', label: 'Outcome' },
  { key: 'extension', label: 'Extension' },
  { key: 'insight', label: 'Insight' },
] as const

export default function ProjectsTimeline({ projects }: ProjectsTimelineProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const entries = Array.from(document.querySelectorAll<HTMLElement>('[data-project-index]'))
    if (entries.length === 0) return

    const observer = new IntersectionObserver(
      observed => {
        const visible = observed
          .filter(entry => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)

        if (visible.length === 0) return

        const nextIndex = Number(visible[0].target.getAttribute('data-project-index'))
        if (!Number.isNaN(nextIndex)) {
          setActiveIndex(nextIndex)
        }
      },
      {
        threshold: [0.2, 0.45, 0.7],
        rootMargin: '-20% 0px -35% 0px',
      }
    )

    entries.forEach(entry => observer.observe(entry))

    return () => observer.disconnect()
  }, [projects.length])

  return (
    <div className={styles.timeline}>
      {projects.map((project, index) => (
        <TimelineItem
          key={`${project.date}-${project.title}`}
          project={project}
          index={index}
          active={index === activeIndex}
        />
      ))}
      <div className={styles.endCap} aria-hidden="true">
        <div className={styles.endCapMarker} />
      </div>
    </div>
  )
}

interface TimelineItemProps {
  project: Project
  index: number
  active: boolean
}

function TimelineItem({ project, index, active }: TimelineItemProps) {
  return (
    <article
      className={styles.timelineItem}
      data-project-index={index}
      data-active={active ? 'true' : 'false'}
    >
      <TimelineMarker date={project.date} active={active} />
      <ProjectEntry project={project} active={active} />
    </article>
  )
}

function TimelineMarker({ date, active }: { date: string; active: boolean }) {
  return (
    <div className={styles.railColumn}>
      <p className={styles.dateLabel}>{date}</p>
      <div className={styles.markerTrack} aria-hidden="true">
        <span className={styles.marker} data-active={active ? 'true' : 'false'} />
      </div>
    </div>
  )
}

function ProjectEntry({ project, active }: { project: Project; active: boolean }) {
  return (
    <div className={styles.entry} data-active={active ? 'true' : 'false'}>
      <header className={styles.entryHeader}>
        <p className={styles.mobileDate}>{project.date}</p>
        <h2 className={styles.title}>{project.title}</h2>
      </header>

      <div className={styles.sectionStack}>
        {sectionOrder.map(({ key, label }) => {
          const lines = project.sections[key]
          if (!lines || lines.length === 0) return null

          return (
            <section key={key} className={styles.copySection} aria-label={label}>
              <p className={styles.sectionLabel}>{label}</p>
              <div className={styles.copyGroup}>
                {lines.map(line => (
                  <p key={line} className={styles.bodyCopy}>
                    {line}
                  </p>
                ))}
              </div>
            </section>
          )
        })}
      </div>

      {project.stack && project.stack.length > 0 && <StackTags stack={project.stack} />}

      {project.links && project.links.length > 0 && (
        <div className={styles.linksRow}>
          {project.links.map(link => (
            <a key={link.href} href={link.href} className={styles.projectLink}>
              {link.label}
            </a>
          ))}
        </div>
      )}
    </div>
  )
}

function StackTags({ stack }: { stack: string[] }) {
  return (
    <div className={styles.metaBlock}>
      <p className={styles.metaLabel}>Stack</p>
      <ul className={styles.tagList} aria-label="Project stack">
        {stack.map(item => (
          <li key={item} className={styles.tag}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}
