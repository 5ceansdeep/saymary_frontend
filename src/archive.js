import React from "react";
import "./archive.css"; // 스타일은 따로 css로 분리해 적용


function Archive() {
  // 임시 파일 리스트
  const files = [
    { name: "파일명1", date: "25.06.25" },
    { name: "파일명2", date: "25.06.25" },
    { name: "파일명3", date: "25.06.25" },
    { name: "파일명4", date: "25.06.25" },
    { name: "파일명5", date: "25.06.25" },
    { name: "파일명6", date: "25.06.25" },
  ];

  return (
    <div className="archive-wrapper">
      

      {/* 메인 콘텐츠 */}
      <div className="archive-content">
        <h1 className="archive-title">누군가의 보관함</h1>
        <div className="search-box">
          <input type="text" placeholder=" " />
          <img src="./img/search-icon.png" alt="search" />
        </div>

        <div className="file-list">
          {files.map((file, idx) => (
            <div className="file-item" key={idx}>
              <div>
                <strong>{file.name}</strong> <span>{file.date}</span>
              </div>
              <span className="dots">...</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Archive;