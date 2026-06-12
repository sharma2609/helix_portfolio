const CodePane = ({ name, code, className = "" }) => {
  const lines = (code || "").split("\n");

  return (
    <div className={`code-pane ${className}`.trim()}>
      <div className="pane-label">{name}</div>
      <pre className="code-scroll">
        {lines.map((line, i) => (
          <div key={i} className="code-line">
            <span className="ln">{i + 1}</span>
            <span className="text">{line || " "}</span>
          </div>
        ))}
      </pre>
    </div>
  );
};

export default CodePane;
