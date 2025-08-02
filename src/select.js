import { useEffect, useState, useRef } from "react";

function Select() {

    const [isActive, setIsActive] = useState(false); // 상태

    const handleClick = () => {
      setIsActive(!isActive); // true <-> false
    };
  const handleCLick = () => {
    alert("필터링 기능은 현재 개발 중입니다.");
  };

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
          transition: "all 0.3s ease-in-out",
          overflowY: "auto", // 스크롤 가능, 스크롤바는 index.css에서 설정
          overflowX: "hidden",
        }}
      >
        <h1
          style={{
            color: "#000000",
            marginTop: "2%",
            fontFamily: "Noto Sans KR, sans-serif",
            fontWeight: 500,
            fontSize: "2rem",
            margin: "0px",
            paddingTop: "3%",
            paddingBottom: "5px",
            paddingLeft: "7%",
          }}
        >
          Situation
          {/* 필터링 버튼들 */}
          <div>
            <div
              onClick={() => handleCLick()}
              style={{
                display: "inline-block",
                color: "#000",
                fontFamily: "Noto Sans KR, sans-serif",
                fontWeight: 500,
                lineHeight: "normal",
                fontSize: "0.9375rem",
                marginTop: "0.3%",
                marginRight: "1%",
                paddingLeft: "10px",
                paddingRight: "10px",
                paddingTop: "3px",
                paddingBottom: "4px",
                borderRadius: "10px",
                border: "1px solid #C7C29B",
                backgroundColor: "#ECEAD5",
                cursor: "pointer",
              }}
            >
              Lecture (강의)
            </div>
            <div
              style={{
                display: "inline-block",
                color: "#000",
                fontFamily: "Noto Sans KR, sans-serif",
                fontWeight: 500,
                lineHeight: "normal",
                fontSize: "0.9375rem",
                marginTop: "0.3%",
                marginRight: "1%",
                paddingLeft: "10px",
                paddingRight: "10px",
                paddingTop: "3px",
                paddingBottom: "4px",
                borderRadius: "10px",
                border: "1px solid #C7C29B",
                backgroundColor: "#ECEAD5",
              }}
            >
              Interview (면접)
            </div>
            <div
              style={{
                display: "inline-block",
                color: "#000",
                fontFamily: "Noto Sans KR, sans-serif",
                fontWeight: 500,
                lineHeight: "normal",
                fontSize: "0.9375rem",
                marginTop: "0.3%",
                marginRight: "1%",
                paddingLeft: "10px",
                paddingRight: "10px",
                paddingTop: "3px",
                paddingBottom: "4px",
                borderRadius: "10px",
                border: "1px solid #C7C29B",
                backgroundColor: "#ECEAD5",
              }}
            >
              Presentation (발표)
            </div>
            <div
              style={{
                display: "inline-block",
                color: "#000",
                fontFamily: "Noto Sans KR, sans-serif",
                fontWeight: 500,
                lineHeight: "normal",
                fontSize: "0.9375rem",
                marginTop: "0.3%",
                marginRight: "1%",
                paddingLeft: "10px",
                paddingRight: "10px",
                paddingTop: "3px",
                paddingBottom: "4px",
                borderRadius: "10px",
                border: "1px solid #C7C29B",
                backgroundColor: "#ECEAD5",
              }}
            >
              Speech (연설)
            </div>
            <div
              style={{
                display: "inline-block",
                color: "#000",
                fontFamily: "Noto Sans KR, sans-serif",
                fontWeight: 500,
                lineHeight: "normal",
                fontSize: "0.9375rem",
                marginTop: "0.3%",
                marginRight: "1%",
                paddingLeft: "10px",
                paddingRight: "10px",
                paddingTop: "3px",
                paddingBottom: "4px",
                borderRadius: "10px",
                border: "1px solid #C7C29B",
                backgroundColor: "#ECEAD5",
              }}
            >
              Briefing (브리핑)
            </div>
          </div>
        </h1>
        {/* Audience */}
        <h1
          style={{
            color: "#000000",
            fontFamily: "Noto Sans KR, sans-serif",
            fontWeight: 500,
            fontSize: "2rem",
            margin: "0px",
            paddingTop: "3%",
            paddingBottom: "5px",
            paddingLeft: "7%",
          }}
        >
          Audience
          {/* 필터링 버튼들 */}
          <div>
            <div
              style={{
                display: "inline-block",
                color: "#000",
                fontFamily: "Noto Sans KR, sans-serif",
                fontWeight: 500,
                lineHeight: "normal",
                fontSize: "0.9375rem",
                marginTop: "0.3%",
                marginRight: "1%",
                paddingLeft: "10px",
                paddingRight: "10px",
                paddingTop: "3px",
                paddingBottom: "4px",
                borderRadius: "10px",
                border: "1px solid #C7C29B",
                backgroundColor: "#ECEAD5",
              }}
            >
              Professor / Teacher (교수 / 선생님)
            </div>
            <div
              style={{
                display: "inline-block",
                color: "#000",
                fontFamily: "Noto Sans KR, sans-serif",
                fontWeight: 500,
                lineHeight: "normal",
                fontSize: "0.9375rem",
                marginTop: "0.3%",
                marginRight: "1%",
                paddingLeft: "10px",
                paddingRight: "10px",
                paddingTop: "3px",
                paddingBottom: "4px",
                borderRadius: "10px",
                border: "1px solid #C7C29B",
                backgroundColor: "#ECEAD5",
              }}
            >
              Interviewer (면접관)
            </div>
            <div
              style={{
                display: "inline-block",
                color: "#000",
                fontFamily: "Noto Sans KR, sans-serif",
                fontWeight: 500,
                lineHeight: "normal",
                fontSize: "0.9375rem",
                marginTop: "0.3%",
                marginRight: "1%",
                paddingLeft: "10px",
                paddingRight: "10px",
                paddingTop: "3px",
                paddingBottom: "4px",
                borderRadius: "10px",
                border: "1px solid #C7C29B",
                backgroundColor: "#ECEAD5",
              }}
            >
              Colleague / Team member (동료 / 팀원)
            </div>
            <div
              style={{
                display: "inline-block",
                color: "#000",
                fontFamily: "Noto Sans KR, sans-serif",
                fontWeight: 500,
                lineHeight: "normal",
                fontSize: "0.9375rem",
                marginTop: "0.3%",
                marginRight: "1%",
                paddingLeft: "10px",
                paddingRight: "10px",
                paddingTop: "3px",
                paddingBottom: "4px",
                borderRadius: "10px",
                border: "1px solid #C7C29B",
                backgroundColor: "#ECEAD5",
              }}
            >
              Client / Boss (고객 / 상사)
            </div>
            <div
              style={{
                display: "inline-block",
                color: "#000",
                fontFamily: "Noto Sans KR, sans-serif",
                fontWeight: 500,
                lineHeight: "normal",
                fontSize: "0.9375rem",
                marginTop: "0.3%",
                marginRight: "1%",
                paddingLeft: "10px",
                paddingRight: "10px",
                paddingTop: "3px",
                paddingBottom: "4px",
                borderRadius: "10px",
                border: "1px solid #C7C29B",
                backgroundColor: "#ECEAD5",
              }}
            >
              General audience (일반 청중)
            </div>
          </div>
        </h1>
        <h1
          style={{
            color: "#000000",
            fontFamily: "Noto Sans KR, sans-serif",
            fontWeight: 500,
            fontSize: "2rem",
            margin: "0px",
            paddingTop: "3%",
            paddingBottom: "5px",
            paddingLeft: "7%",
          }}
        >
          Speech style
          {/* 필터링 버튼들 */}
          <div>
            <div
              style={{
                display: "inline-block",
                color: "#000",
                fontFamily: "Noto Sans KR, sans-serif",
                fontWeight: 500,
                lineHeight: "normal",
                fontSize: "0.9375rem",
                marginTop: "0.3%",
                marginRight: "1%",
                paddingLeft: "10px",
                paddingRight: "10px",
                paddingTop: "3px",
                paddingBottom: "4px",
                borderRadius: "10px",
                border: "1px solid #C7C29B",
                backgroundColor: "#ECEAD5",
              }}
            >
              Explanatory (설명형)
            </div>
            <div
              style={{
                display: "inline-block",
                color: "#000",
                fontFamily: "Noto Sans KR, sans-serif",
                fontWeight: 500,
                lineHeight: "normal",
                fontSize: "0.9375rem",
                marginTop: "0.3%",
                marginRight: "1%",
                paddingLeft: "10px",
                paddingRight: "10px",
                paddingTop: "3px",
                paddingBottom: "4px",
                borderRadius: "10px",
                border: "1px solid #C7C29B",
                backgroundColor: "#ECEAD5",
              }}
            >
              Self-introductory (자기소개형)
            </div>
            <div
              style={{
                display: "inline-block",
                color: "#000",
                fontFamily: "Noto Sans KR, sans-serif",
                fontWeight: 500,
                lineHeight: "normal",
                fontSize: "0.9375rem",
                marginTop: "0.3%",
                marginRight: "1%",
                paddingLeft: "10px",
                paddingRight: "10px",
                paddingTop: "3px",
                paddingBottom: "4px",
                borderRadius: "10px",
                border: "1px solid #C7C29B",
                backgroundColor: "#ECEAD5",
              }}
            >
              Persuasive (설득형)
            </div>
            <div
              style={{
                display: "inline-block",
                color: "#000",
                fontFamily: "Noto Sans KR, sans-serif",
                fontWeight: 500,
                lineHeight: "normal",
                fontSize: "0.9375rem",
                marginTop: "0.3%",
                marginRight: "1%",
                paddingLeft: "10px",
                paddingRight: "10px",
                paddingTop: "3px",
                paddingBottom: "4px",
                borderRadius: "10px",
                border: "1px solid #C7C29B",
                backgroundColor: "#ECEAD5",
              }}
            >
              Informal (비격식형)
            </div>
            <div
              style={{
                display: "inline-block",
                color: "#000",
                fontFamily: "Noto Sans KR, sans-serif",
                fontWeight: 500,
                lineHeight: "normal",
                fontSize: "0.9375rem",
                marginTop: "0.3%",
                marginRight: "1%",
                paddingLeft: "10px",
                paddingRight: "10px",
                paddingTop: "3px",
                paddingBottom: "4px",
                borderRadius: "10px",
                border: "1px solid #C7C29B",
                backgroundColor: "#ECEAD5",
              }}
            >
              Formal (격식형)
            </div>
            <div
              style={{
                display: "inline-block",
                color: "#000",
                fontFamily: "Noto Sans KR, sans-serif",
                fontWeight: 500,
                lineHeight: "normal",
                fontSize: "0.9375rem",
                marginTop: "0.3%",
                marginRight: "1%",
                paddingLeft: "10px",
                paddingRight: "10px",
                paddingTop: "3px",
                paddingBottom: "4px",
                borderRadius: "10px",
                border: "1px solid #C7C29B",
                backgroundColor: "#ECEAD5",
              }}
            >
              Q&A style (질문응답형)
            </div>
          </div>
        </h1>
        <button
          style={{
            position: "relative",
            top: "10%",
            left: "80%",
            marginBottom: "5%",
            whiteSpace: "nowrap", // 줄바꿈 방지
            padding: "10px 20px",
            borderRadius: "10px",
            border: "none",
            color: "#ffffff",
            backgroundColor: "#00492C",
            fontSize: "1.2rem",
            fontFamily: "Noto Sans KR, sans-serif",
            fontWeight: 500,
          }}
        >
          Upload File
        </button>
      </div>
    </div>
  );
}

export default Select;
