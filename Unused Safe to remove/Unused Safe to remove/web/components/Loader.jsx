export default function Loader({ fullScreen = true, size = "medium" }) {
  const sizeClass = `loader-${size}`;
  const containerClass = fullScreen ? "loader-fullscreen" : "loader-inline";

  const logoSize = size === "small" ? 40 : size === "large" ? 80 : 60;

  return (
    <div className={`loader-container ${containerClass}`}>
      <div className={`loader-circle ${sizeClass}`}>
        <div className="loader-logo">
          <img
            src="/logo.png"
            alt="HomieBites Logo"
            width={logoSize}
            height={logoSize}
          />
        </div>
      </div>
    </div>
  );
}
