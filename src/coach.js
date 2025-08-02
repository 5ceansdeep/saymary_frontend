import { useState } from "react";

function Coach() {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="custom-scroll"
      style={{
        backgroundColor: "#FFFCE4",
        height: "100vh",
        display: "flex",
        padding: "0px",
        margin: "0px",
        position: "relative",
      }}
    >
      {/* 좌우 반반 분할 */}
      <div
        style={{
          width: "50%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          borderRight: "2px solid #ECEAD5",
        }}
      >
        <h1
          style={{
            color: "#656247",
            fontFamily: "Noto Sans KR, sans-serif",
            fontWeight: 500,
            fontSize: "18px",
            margin: "0px",
            paddingTop: "3%",
            paddingBottom: "5px",
            paddingLeft: "7%",
          }}
        >
          파일명 : 알아서 AI가 요약해준대로 임시로 지정
          <div className="exportButtonContainer">
            <button className="exportButton">. . .</button>
            <button className="hoverButton">이미지 1, 이미지 2</button>
          </div>
        </h1>
      </div>
      <div
        style={{
          width: "50%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        Meeting (회의) / Customer (고객) / Persuasive (설득형)
      </div>

      {/* 사이드바 */}
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          width: "60px",
          zIndex: 10,
        }}
      >
        <div
          style={{
            backgroundColor: "#00492C",
            color: "white",
            width: "200px",
            height: "100%",
            transform: hovered ? "translateX(0)" : "translateX(-140px)",
            transition: "transform 0.3s ease",
            padding: "20px",
            boxSizing: "border-box",
          }}
        >
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            <li style={{ marginBottom: "16px" }}>홈</li>
            <li style={{ marginBottom: "16px" }}>코칭</li>
            <li>아카이브</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Coach;
