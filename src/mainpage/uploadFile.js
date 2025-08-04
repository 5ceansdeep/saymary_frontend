import { useState } from "react";

function Select() {
  return (
    <div
      style={{
        backgroundColor: "#00492C",
        height: "100vh",
        display: "flex",
        padding: "0px",
        margin: "0px",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
      }}
    >
      <h1
        style={{
          color: "#F2C81B",
          fontFamily: "Cormorant Garamond, serif",
          fontWeight: 600,
          fontSize: "60px",
          position: "absolute",
          padding: "0px",
          margin: "0px",
          top: "7%",
          left: "13%",
          opacity: 1,
        }}
      >
        Saymary
      </h1>
      {/* 노란박스 */}
      <div
        className="custom-scroll"
        style={{
          backgroundColor: "#FFFCE4",
          position: "absolute",
          borderRadius: "10px",
          boxShadow: "-20px 5px 0px rgba(0, 0, 0, 0.2)",
          top: "20%",
          left: "12%",
          width: "88%",
          height: "80%",
          overflowY: "auto", // 스크롤 가능, 스크롤바는 index.css에서 설정
          overflowX: "hidden",
        }}
      >
        {/* 업로드 박스 */}
        <div
          style={{
            color: "#656247",
            backgroundColor: "#ECEAD5",
            fontFamily: "Noto Sans KR, sans-serif",
            fontWeight: 600,
            fontSize: "1.5rem",
            position: "relative",
            top: "50%",
            transform: "translateY(-50%)",
            marginLeft: "20%",
            marginRight: "20%",
            paddingTop: "60px",
            paddingBottom: "60px",
            paddingLeft: "3%",
            paddingRight: "3%",
            borderRadius: "10px",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <p style={{ margin: "0px" }}>음성파일을 업로드 해주세요...</p>
            <p
              style={{
                fontFamily: "Noto Sans KR, sans-serif",
                fontWeight: 600,
                fontSize: "1rem",
              }}
            >
              Drag & Drop
            </p>
            <button
              style={{
                padding: "10px 30px",
                borderRadius: "10px",
                border: "none",
                backgroundColor: "#00492C",
                color: "#ffffff",
                fontFamily: "Noto Sans KR, sans-serif",
                fontWeight: 500,
                fontSize: "0.7rem",
                cursor: "pointer",
                marginTop: "15px",
              }}
            >
              Click to upload file
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Select;
