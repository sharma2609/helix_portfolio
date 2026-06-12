const ContactPreview = ({ portfolio }) => {
  const p = portfolio.personalInfo;
  const s = p.socials;

  const rows = [
    ["Name", p.name],
    ["Role", p.role],
    ["Location", p.location],
    ["Email", p.email, `mailto:${p.email}`],
    ["Phone", p.phone, `tel:${p.phone.replace(/\s/g, "")}`],
    ["LinkedIn", "Priyanshu Sharma", s.linkedin],
    ["GitHub", "sharma2609", s.github],
    ["Portfolio", "priyanshusharma.dev", s.portfolio],
  ];

  return (
    <div className="preview-pane">
      <h1>Get in Touch</h1>
      <p className="preview-lead">Let&apos;s connect and discuss opportunities.</p>
      <dl className="contact-list">
        {rows.map(([label, value, href]) => (
          <div key={label} className="contact-row">
            <dt>{label}</dt>
            <dd>
              {href ? (
                <a href={href} target="_blank" rel="noreferrer">
                  {value}
                </a>
              ) : (
                value
              )}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
};

export default ContactPreview;
