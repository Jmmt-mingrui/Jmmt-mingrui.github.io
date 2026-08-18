import type { Project } from "../lib/projects";

// 项目贴纸卡（对齐参考站 diygod.cc）：16:9 截图 + 名称箭头 + 一行描述，双层虚线框悬停错位。
export function ProjectCard({ project }: { project: Project }) {
  return (
    <a className="reference-project" href={project.href} target="_blank" rel="noopener noreferrer">
      <div className="project-card-sheet" aria-hidden="true" />
      <div className="project-card-frame" aria-hidden="true" />
      <div className="project-card-inner">
        <div className="project-image"><img src={project.image} alt={`${project.name} logo`} loading="lazy" /></div>
        <h3>{project.name} <span aria-hidden="true">↗</span></h3>
        <p>{project.description}</p>
      </div>
    </a>
  );
}
