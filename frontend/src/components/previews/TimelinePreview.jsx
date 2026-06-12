const achievementMeta = (text) => {
  if (text.includes("Black Belt")) return { type: "achievement", date: "2016" };
  if (text.includes("Fujairah")) return { type: "feat", date: "2019" };
  if (text.includes("National Medalist")) return { type: "achievement", date: "2015, 2017, 2018" };
  if (text.includes("Vice Sports")) return { type: "feat", date: "2017 – 2018" };
  if (text.includes("LeetCode")) return { type: "feat", date: "ongoing" };
  return { type: "feat", date: "" };
};

const TimelinePreview = ({ portfolio, variant }) => {
  const name = portfolio.personalInfo.name;

  const careerItems = [
    ...portfolio.experience.map((exp) => ({
      type: "feat",
      text: `${exp.title} at ${exp.company}`,
      date: exp.period,
    })),
    {
      type: "docs",
      text: "Fake News Detection & Multilingual NLP systems",
      date: "2024",
    },
    ...portfolio.education.map((edu) => ({
      type: "init",
      text: `${edu.degree} — ${edu.institution}`,
      date: edu.year,
    })),
  ];

  const items =
    variant === "career"
      ? careerItems
      : portfolio.achievements.map((text) => ({
          text,
          ...achievementMeta(text),
        }));

  const title = variant === "career" ? "Career Timeline" : "Achievements & Hobbies";

  return (
    <div className="preview-pane">
      <h1>{title}</h1>
      <ul className="timeline">
        {items.map((item, index) => (
          <li key={`${item.date}-${item.text}-${index}`}>
            <span className={`commit-type ${item.type}`}>{item.type}</span>
            <span>{item.text}</span>
            {item.date && (
              <small>
                {name} · {item.date}
              </small>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TimelinePreview;
