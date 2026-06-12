// NOTE: This mirrors backend/services/chat.py.
// Keep both in sync when changing replies.

export function getLocalReply(message, data) {
  const text = message.toLowerCase().trim();
  const p = data.personalInfo;
  const skills = data.skills;
  const experience = data.experience;
  const projects = data.projects;
  const education = data.education;
  const achievements = data.achievements;

  const fakeNews = projects[0];
  const translation = projects[1];

  if (any(text, "hello", "hi", "hey")) {
    return (
      `Hello! I can tell you about ${p.name}, ${p.role}. ` +
      "Ask about skills, projects, experience, education, or contact."
    );
  }

  if (any(text, "skill", "technology", "tech", "programming")) {
    return [
      `Programming: ${skills.programming.join(", ")}`,
      `AI/ML: ${skills.ai_ml.join(", ")}`,
      `Libraries: ${skills.libraries.join(", ")}`,
      `Web: ${skills.webDev.join(", ")}`,
      `Tools: ${skills.tools.join(", ")}`,
      `Databases: ${skills.databases.join(", ")}`,
      `Concepts: ${skills.core.join(", ")}`,
    ].join("\n");
  }

  if (any(text, "experience", "work", "job", "teaching", "career", "intern")) {
    return experience
      .map((exp) => `${exp.title} at ${exp.company} (${exp.period})\n${exp.description}`)
      .join("\n\n");
  }

  if (any(text, "project", "build", "app") && !text.includes("website")) {
    return projects
      .map(
        (pr, i) =>
          `${i + 1}. ${pr.name}\n   ${pr.description}\n   Tech: ${pr.techStack.join(", ")}`
      )
      .join("\n\n");
  }

  if (any(text, "fake news", "detection", "truth")) {
    const pr = fakeNews;
    return `${pr.name}\n${pr.description}\nTech: ${pr.techStack.join(", ")}`;
  }

  if (any(text, "translation", "translator", "multilingual", "nllb")) {
    const pr = translation;
    return `${pr.name}\n${pr.description}\nTech: ${pr.techStack.join(", ")}`;
  }

  if (any(text, "education", "study", "degree", "college", "iit", "miet")) {
    return education.map((e) => `${e.degree} — ${e.institution} (${e.year})`).join("\n\n");
  }

  if (any(text, "contact", "email", "reach", "connect", "phone")) {
    const s = p.socials;
    return [
      `Email: ${p.email}`,
      `Phone: ${p.phone}`,
      `LinkedIn: ${s.linkedin}`,
      `GitHub: ${s.github}`,
      `Portfolio: ${s.portfolio}`,
      `Location: ${p.location}`,
    ].join("\n");
  }

  if (any(text, "where", "location", "based", "live")) {
    return `${p.name} is based in ${p.location}.`;
  }

  if (any(text, "achievement", "taekwondo", "sport", "medal", "leetcode")) {
    return achievements.map((a) => `• ${a}`).join("\n");
  }

  if (any(text, "help", "what can you do", "options")) {
    return (
      'Try: "What are his skills?", "Tell me about fake news detection", ' +
      '"What is his guest faculty role?", "How can I contact him?"'
    );
  }

  return (
    "I can help with skills, projects, experience, education, achievements, " +
    "or contact info. What would you like to know?"
  );
}

function any(text, ...words) {
  const cleaned = text.replace(/[^\w\s]/g, "");
  return words.some((w) => cleaned.includes(w));
}
