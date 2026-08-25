import { SiteShell } from "../components/site-shell";
import { ProjectCard } from "../components/project-card";
import { projects } from "../lib/projects";

export default function ProjectsPage() {
  return (
    <SiteShell>
      <section className="projects-page">
        <h2>项目</h2>
        <div className="project-page-grid">
          {projects.map((project) => <ProjectCard key={project.key} project={project} />)}
        </div>
      </section>
    </SiteShell>
  );
}
