// src/mainpage/sideBar.tsx
import { useNavigate, useLocation } from "react-router-dom";
import type React from "react"; // CSSProperties 타입용 (JSX 자동 런타임이면 값 import 불필요)
import homeIcon from "../img/home.png";
import coachingIcon from "../img/coaching.png";
import archiveIcon from "../img/archive.png";

type SidebarProps = {
  children: React.ReactNode;
};

type SidebarButtonProps = {
  label: string;
  icon?: string;
  isActive: boolean;
  onClick: () => void;
};

export default function Sidebar({ children }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <div style={{ position: "relative", height: "100vh" }}>
      {/* 겹쳐 뜨는 고정 사이드바 */}
      <div
        style={{
          position: "fixed",
          top: "13%",
          left: 0,
          width: "10%",
          height: "100vh",
          backgroundColor: "transparent",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: "100px",
          gap: "40px",
          zIndex: 2147483647,
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

      {/* 컨텐츠는 뒤에 깔림(겹침) */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          overflowY: "auto",
        }}
      >
        {children}
      </div>
    </div>
  );
}

function SidebarButton({ label, icon, isActive, onClick }: SidebarButtonProps) {
  const buttonStyle: React.CSSProperties = {
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
    fontWeight: isActive ? 700 : 400,
    transition: "background-color 0.3s",
    border: "none",
    cursor: "pointer",
  };

  return (
    <button
      style={buttonStyle}
      onClick={onClick}
      onMouseEnter={(e) => {
        if (!isActive)
          (e.currentTarget as HTMLButtonElement).style.backgroundColor =
            "#055538";
      }}
      onMouseLeave={(e) => {
        if (!isActive)
          (e.currentTarget as HTMLButtonElement).style.backgroundColor =
            "#00492C";
      }}
    >
      {icon && <img src={icon} alt={label} style={{ width: 24, height: 24 }} />}
      <span>{label}</span>
    </button>
  );
}
