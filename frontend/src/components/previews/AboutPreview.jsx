const AboutPreview = ({ portfolio }) => {
  const p = portfolio.personalInfo;
  const skills = portfolio.skills;

  const tagGroups = [
    { label: "Programming", items: skills.programming },
    { label: "AI & ML", items: skills.ai_ml },
    { label: "ML Libraries", items: skills.libraries },
    { label: "Web", items: skills.webDev },
    { label: "Tools", items: skills.tools },
    { label: "Databases", items: skills.databases },
    { label: "Concepts", items: skills.core },
  ];

  return (
    <div className="preview-pane">
      <h1>About Me</h1>
      <p>
        Hello! I&apos;m <strong>{p.name}</strong>, {p.role}.
      </p>
      <div className="tag-grid">
        {tagGroups.map((g) => (
          <div key={g.label} className="tag-group">
            <h3>{g.label}</h3>
            <div className="tags">
              {g.items.map((s) => (
                <span key={s} className="tag">
                  {s}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
      <section className="exp-section">
        <h2 className="section-title">Experience</h2>
        {portfolio.experience.map((exp) => (
          <article key={`${exp.company}-${exp.period}`} className="exp-card">
            <p className="exp-title">
              {exp.title} · {exp.company}
            </p>
            <p className="exp-period">{exp.period}</p>
            <p className="exp-desc">{exp.description}</p>
            {exp.highlights?.length > 0 && (
              <ul className="exp-highlights">
                {exp.highlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            )}
          </article>
        ))}
      </section>
    </div>
  );
};

export default AboutPreview;
