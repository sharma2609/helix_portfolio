import HomePreview from "./HomePreview";
import AboutPreview from "./AboutPreview";
import ProjectsPreview from "./ProjectsPreview";
import ContactPreview from "./ContactPreview";
import ResumePreview from "./ResumePreview";
import TimelinePreview from "./TimelinePreview";
import DinoGame from "../DinoGame";

const PreviewRouter = ({ preview, portfolio }) => {
  if (!preview || !portfolio) {
    return <div className="preview-pane empty">open a buffer</div>;
  }

  switch (preview.type) {
    case "home":
      return <HomePreview portfolio={portfolio} />;
    case "about":
      return <AboutPreview portfolio={portfolio} />;
    case "projects":
      return <ProjectsPreview portfolio={portfolio} />;
    case "contact":
      return <ContactPreview portfolio={portfolio} />;
    case "resume":
      return <ResumePreview portfolio={portfolio} pdfPath={preview.pdfPath} />;
    case "career_timeline":
      return <TimelinePreview portfolio={portfolio} variant="career" />;
    case "extracurriculars":
      return <TimelinePreview portfolio={portfolio} variant="achievements" />;
    case "dino":
      return (
        <div className="preview-pane">
          <h2>Dino game</h2>
          <DinoGame />
        </div>
      );
    default:
      return <div className="preview-pane empty">preview</div>;
  }
};

export default PreviewRouter;
