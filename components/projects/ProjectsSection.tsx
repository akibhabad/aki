import type { Project } from '@/data/projects'
import ProjectsTimeline from './ProjectsTimeline'
import styles from './projects.module.css'

interface ProjectsSectionProps {
  projects: Project[]
}

export default function ProjectsSection({ projects }: ProjectsSectionProps) {
  const orderedProjects = [...projects].reverse()

  return (
    <section className={styles.section}>
      <div className={styles.shell}>
        <header className={styles.header}>
          <p className={styles.kicker}>Projects</p>
          <h1 className={styles.heading}>Build Archive</h1>
          <p className={styles.intro}>
            A chronology of systems, experiments, and tools built over time.
          </p>
        </header>

        <ProjectsTimeline projects={orderedProjects} />
      </div>
    </section>
  )
}
