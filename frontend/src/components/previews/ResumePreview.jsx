const ResumePreview = ({ portfolio, pdfPath }) => {
  const download = () => {
    const link = document.createElement("a");
    link.href = pdfPath;
    link.download = "PriyanshuSharma_Resume.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="preview-pane resume-preview">
      <h1>Resume</h1>
      <p>Download my professional CV in PDF format.</p>
      <div className="resume-stats">
        <div>
          <strong>{portfolio.experience.length}+</strong>
          <span>roles</span>
        </div>
        <div>
          <strong>{portfolio.projects.length}</strong>
          <span>projects</span>
        </div>
        <div>
          <strong>{portfolio.education.length}</strong>
          <span>degrees</span>
        </div>
      </div>
      <button type="button" className="primary-btn" onClick={download}>
        Download PDF
      </button>
      <p className="muted">Place PriyanshuSharma_Resume.pdf in frontend/public/</p>
    </div>
  );
};

export default ResumePreview;
