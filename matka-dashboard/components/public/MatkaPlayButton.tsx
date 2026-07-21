// Floating "Matka Play" button — same design as the Live Chat button,
// placed next to it in the bottom-left corner.
export function MatkaPlayButton() {
  return (
    <a
      href="https://sattamatkadpboss.mobi/app-apna-release.apk"
      target="_blank"
      rel="noopener noreferrer"
      style={{
        position: "fixed",
        bottom: "20px",
        left: "5px",
        zIndex: 60,
        padding: "5px 8px",
        fontSize: "14px",
        border: "2px solid deepskyblue",
        textDecoration: "none",
        backgroundColor: "#003399",
        color: "#FFFFFF",
        borderRadius: "5px",
      }}
      className="font-bold"
    >
      Matka Play
    </a>
  );
}
