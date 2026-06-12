export const NAV_SECTIONS = [
  {
    id: "portfolio",
    label: "Portfolio",
    description: "Profile, work & contact",
  },
  {
    id: "career",
    label: "Career",
    description: "Timeline & achievements",
  },
  {
    id: "playground",
    label: "Playground",
    description: "Extras & experiments",
  },
];

export const FILE_META = {
  "home.jsx": { label: "Home", ext: "jsx" },
  "about.md": { label: "About", ext: "md" },
  "projects.js": { label: "Projects", ext: "js" },
  "contact.html": { label: "Contact", ext: "html" },
  "resume.pdf": { label: "Resume", ext: "pdf" },
  "career_timeline.git": { label: "Career Timeline", ext: "git" },
  "extracurriculars.git": { label: "Achievements", ext: "git" },
  "dino.js": { label: "Dino Game", ext: "js" },
};

export const KEYBINDINGS = [
  { keys: "Ctrl+P", label: "Command menu", id: "menu" },
  { keys: "Ctrl+S", label: "Toggle assistant", id: "assistant" },
  { keys: "Esc", label: "Close menu", id: "close" },
];

export function getGroupFiles(fileGroups, sectionId) {
  if (!fileGroups) return [];
  return fileGroups[sectionId] || [];
}

export function allFilesFromGroups(fileGroups) {
  if (!fileGroups) return [];
  return NAV_SECTIONS.flatMap((s) => getGroupFiles(fileGroups, s.id));
}
