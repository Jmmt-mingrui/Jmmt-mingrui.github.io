import { SiteShell } from "../components/site-shell";
import { ProjectCard } from "../components/project-card";
import { projects } from "../lib/projects";

export default function ProjectsPage() {
  return (
    <SiteShell>
      <section className="projects-page">
        <h2>项目</h2>
        <p>做过的东西，不该只躺在提交记录里。每个项目一张卡片：链接、一句话说明，以及一段真正有价值的复盘。</p>
        <div className="project-page-grid">
          {projects.map((project) => <ProjectCard key={project.key} project={project} />)}
        </div>
      </section>
    </SiteShell>
  );
}
