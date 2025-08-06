import { useNavigate, useLocation } from "react-router-dom";
import homeIcon from "../img/home.png";
import coachingIcon from "../img/coaching.png";
import archiveIcon from "../img/archive.png";

export default function Sidebar({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* 왼쪽 사이드바 */}
      <div
        style={{
          position: "fixed",
          top: 100,
          left: 0,
          width: "10%",
          height: "100vh",
          backgroundColor: "#transparent",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: "100px",
          gap: "40px",
          zIndex: 9999,
        }}
      >
        <SidebarButton
          label="Home"
          icon={homeIcon}
          isActive={location.pathname === "/upload"}
          onClick={() => navigate("/upload")}
        />
        <SidebarButton
          label="Coaching"
          icon={coachingIcon}
          isActive={isActive("/coaching")}
          onClick={() => navigate("/coaching")}
        />
        <SidebarButton
          label="Archive"
          icon={archiveIcon}
          isActive={isActive("/archive")}
          onClick={() => navigate("/archive")}
        />
      </div>

      {/* 오른쪽 컨텐츠 */}
      <div style={{ flex: 1, overflowY: "auto" }}>{children}</div>
    </div>
  );
}

function SidebarButton({ label, icon, isActive, onClick }) {
  const buttonStyle = {
    backgroundColor: isActive ? "#066c43" : "#00492C",
    color: "white",
    width: "80px",
    height: "80px",
    borderRadius: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "5px",
    fontSize: "14px",
    fontWeight: isActive ? "700" : "400",
    transition: "background-color 0.3s",
    border: "none",
    cursor: "pointer",
  };

  return (
    <button
      style={buttonStyle}
      onClick={onClick}
      onMouseEnter={(e) => {
        if (!isActive) e.target.style.backgroundColor = "#055538";
      }}
      onMouseLeave={(e) => {
        if (!isActive) e.target.style.backgroundColor = "#00492C";
      }}
    >
      {/* 이미지 아이콘 표시 */}
      {icon && (
        <img src={icon} alt={label} style={{ width: "24px", height: "24px" }} />
      )}
      <span>{label}</span>
    </button>
  );
}
