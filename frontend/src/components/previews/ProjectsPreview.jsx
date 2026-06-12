const ProjectsPreview = ({ portfolio }) => (
  <div className="preview-pane">
    <h1>Projects</h1>
    {portfolio.projects.map((project) => (
      <article key={project.name} className="project-card">
        <h3>{project.name}</h3>
        <span className="project-type">{project.type}</span>
        <p>{project.description}</p>
        <div className="tags">
          {project.techStack.map((t) => (
            <span key={t} className="tag">
              {t}
            </span>
          ))}
        </div>
        <ul>
          {project.features.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      </article>
    ))}
  </div>
);

export default ProjectsPreview;
