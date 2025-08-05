import React from "react";
import "./layout.css";
import homeIcon from "./img/home.png";
import coachingIcon from "./img/coaching.png";
import archiveIcon from "./img/archive.png";

export default function Layout({ children, currentPage }) {
  return (
    <div className="layout-wrapper">
      {/* 왼쪽 상단 텍스트 로고 */}
      <div className="logo-text">Saymary</div>

      {/* 왼쪽 사이드 버튼들 */}
      <div className="sidebar-buttons">
        <SidebarButton icon={homeIcon} label="Home" isActive={currentPage === "Home"} />
        <SidebarButton icon={coachingIcon} label="Coaching" isActive={currentPage === "Coaching"} />
        <SidebarButton icon={archiveIcon} label="Archive" isActive={currentPage === "Archive"} />
      </div>

      {/* 오른쪽 아이보리 박스 */}
      <div className="content-box">
        {children}
      </div>
    </div>
  );
}

function SidebarButton({ icon, label, isActive }) {
  return (
    <div className={`sidebar-button ${isActive ? "active" : ""}`}>
      <img src={icon} alt={label} />
      <span>{label}</span>
    </div>
  );
}
