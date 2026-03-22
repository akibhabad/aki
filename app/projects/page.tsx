import type { Metadata } from 'next'
import ProjectsSection from '@/components/projects/ProjectsSection'
import { projects } from '@/data/projects'

export const metadata: Metadata = { title: 'Projects' }

export default function ProjectsPage() {
  return <ProjectsSection projects={projects} />
}
