import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import godown from "../img/godown.png";

function Coach() {
  const location = useLocation();
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);
  const [feedbackData, setFeedbackData] = useState(null);
  const [sessionData, setSessionData] = useState(null);
  const [showActionButtons, setShowActionButtons] = useState(false);
  const [activeTab, setActiveTab] = useState("summary"); // 우측 탭 상태 기본값:

  const BoxRef = useRef();

  useEffect(() => {
    // Select 페이지에서 전달받은 데이터 확인
    if (location.state) {
      const receivedFeedback = location.state.feedback;

      // API 응답이 문자열인지 객체인지 확인
      if (typeof receivedFeedback === "string") {
        try {
          setFeedbackData(JSON.parse(receivedFeedback));
        } catch {
          setFeedbackData({ summary: receivedFeedback });
        }
      } else {
        setFeedbackData(receivedFeedback);
      }

      setSessionData({
        situation: location.state.situation,
        audience: location.state.audience,
        style: location.state.style,
        fileName: location.state.fileName,
        uploadTime: location.state.uploadTime || new Date().toLocaleString(),
      });
    } else {
      // 직접 접근한 경우 테스트 데이터 설정
      setFeedbackData({
        original_text:
          "재택근무는 코로나19 팬데믹을 계기로 빠르게 확산된 근무 형태입니다.",
        summary: "발표력이 좋습니다.",
        keywords: "재택근무, 코로나19, 팬데믹",
        speaking_speed: {
          average_wpm: 212.5,
          comment: "조금 빠른 말하기입니다.",
        },
        pause_analysis: {
          long_pauses: [
            { start: "00:12.3", end: "00:14.8" },
            { start: "00:34.0", end: "00:35.7" },
          ],
          pause_ratio: 0.17,
          comment: "자연스러운 말하기입니다.",
        },
      });
      setSessionData({
        situation: "Presentation (발표)",
        audience: "Colleague / Team member (동료 / 팀원)",
        style: "Formal (격식형)",
        fileName: "test_audio.mp3",
        uploadTime: new Date().toLocaleString(),
      });
    }

    setHovered(true);
    const timer = setTimeout(() => {
      setHovered(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, [location]);

  const scrollToBottom = () => {
    if (BoxRef.current) {
      BoxRef.current.scrollTo({
        top: BoxRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  // 사이드바 네비게이션 핸들러
  const handleNavigation = (path) => {
    switch (path) {
      case "home":
        navigate("/");
        break;
      case "coaching":
        navigate("/coaching/select");
        break;
        // case "archive":
        //   navigate("/main"); 서진언니 커밋하면 추가하기
        break;
      default:
        console.log(`${path} 페이지로 이동`);
    }
  };

  // exportButton 클릭 핸들러
  const handleExportButtonClick = () => {
    setShowActionButtons((prev) => !prev);
  };

  // 새로운 코칭 시작
  const handleNewCoaching = () => {
    navigate("/coaching/select");
  };

  // 텍스트 복사 함수
  const copyToClipboard = async () => {
    try {
      let content = `파일명: ${sessionData?.fileName}\n생성일시: ${sessionData?.uploadTime}\n설정: ${sessionData?.situation} / ${sessionData?.audience} / ${sessionData?.style}\n\n`;

      if (feedbackData) {
        content += `=== 원본 텍스트 ===\n${
          feedbackData.original_text || "원본 텍스트 없음"
        }\n\n`;
        content += `=== 요약 ===\n${feedbackData.summary || "요약 없음"}\n\n`;
        content += `=== 키워드 ===\n${
          feedbackData.keywords || "키워드 없음"
        }\n\n`;

        if (feedbackData.speaking_speed) {
          content += `=== 말하기 속도 분석 ===\n평균 WPM: ${feedbackData.speaking_speed.average_wpm}\n코멘트: ${feedbackData.speaking_speed.comment}\n\n`;
        }

        if (feedbackData.pause_analysis) {
          content += `=== 말하기 템포 분석 ===\n잠깐 쉬는 비율: ${feedbackData.pause_analysis.pause_ratio}\n코멘트: ${feedbackData.pause_analysis.comment}\n`;
        }
      }

      await navigator.clipboard.writeText(content);
      alert("코칭 피드백이 클립보드에 복사되었습니다.");
    } catch (err) {
      console.error("복사 실패:", err);
      alert("복사에 실패했습니다.");
    }
  };

  // 파일로 내보내기 함수
  const exportToFile = () => {
    const fileName = `코칭피드백_${
      sessionData?.fileName?.replace(/\.[^/.]+$/, "") || "audio"
    }_${new Date().toLocaleDateString("ko-KR").replace(/\./g, "")}.txt`;

    let content = `파일명: ${sessionData?.fileName}\n생성일시: ${sessionData?.uploadTime}\n설정: ${sessionData?.situation} / ${sessionData?.audience} / ${sessionData?.style}\n\n`;

    if (feedbackData) {
      content += `=== 원본 텍스트 ===\n${
        feedbackData.original_text || "원본 텍스트 없음"
      }\n\n`;
      content += `=== 요약 ===\n${feedbackData.summary || "요약 없음"}\n\n`;
      content += `=== 키워드 ===\n${
        feedbackData.keywords || "키워드 없음"
      }\n\n`;

      if (feedbackData.speaking_speed) {
        content += `=== 말하기 속도 분석 ===\n평균 WPM: ${feedbackData.speaking_speed.average_wpm}\n코멘트: ${feedbackData.speaking_speed.comment}\n\n`;
      }

      if (feedbackData.pause_analysis) {
        content += `=== 말하기 템포 분석 ===\n잠깐 쉬는 비율: ${feedbackData.pause_analysis.pause_ratio}\n코멘트: ${feedbackData.pause_analysis.comment}\n`;
      }
    }

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // 액션 버튼 데이터 배열
  const actionButtons = [
    {
      id: "copy",
      text: "📄 텍스트 복사",
      title: "코칭 피드백을 클립보드에 복사합니다",
      onClick: copyToClipboard,
      style: {
        backgroundColor: "#ecead5",
        color: "white",
        border: "none",
      },
    },
    {
      id: "export",
      text: "💾 파일로 내보내기",
      title: "코칭 피드백을 텍스트 파일로 다운로드합니다",
      onClick: exportToFile,
      style: {
        backgroundColor: "#ecead5",
        color: "white",
        border: "none",
      },
    },
    {
      id: "newCoaching",
      text: "🎯 새 코칭 시작",
      title: "새로운 코칭을 시작합니다",
      onClick: handleNewCoaching,
      style: {
        backgroundColor: "#00492C",
        color: "white",
        border: "none",
      },
    },
  ];

  // 탭 데이터
  const tabs = [
    { id: "summary", label: "💬 요약 & 키워드", icon: "💬" },
    { id: "speed", label: "⚡ 말하기 속도", icon: "⚡" },
    { id: "pause", label: "⏸️ 말하기 템포", icon: "⏸️" },
  ];

  // 탭 컨텐츠 렌더링
  const renderTabContent = () => {
    if (!feedbackData) return <p>피드백 데이터를 불러오는 중...</p>;

    switch (activeTab) {
      case "summary":
        return (
          <div>
            <div style={{ marginBottom: "20px" }}>
              <h3
                style={{
                  color: "#00492C",
                  marginBottom: "10px",
                  fontSize: "1.1rem",
                }}
              >
                📝 요약
              </h3>
              <p style={{ lineHeight: "1.6", color: "#333" }}>
                {feedbackData.summary || "요약이 없습니다."}
              </p>
            </div>
            <div>
              <h3
                style={{
                  color: "#00492C",
                  marginBottom: "10px",
                  fontSize: "1.1rem",
                }}
              >
                🔑 키워드
              </h3>
              <p style={{ lineHeight: "1.6", color: "#333" }}>
                {feedbackData.keywords || "키워드가 없습니다."}
              </p>
            </div>
          </div>
        );

      case "speed":
        return (
          <div>
            <h3
              style={{
                color: "#00492C",
                marginBottom: "15px",
                fontSize: "1.1rem",
              }}
            >
              ⚡ 말하기 속도 분석
            </h3>
            {feedbackData.speaking_speed ? (
              <div>
                <div
                  style={{
                    backgroundColor: "#f8f9fa",
                    padding: "15px",
                    borderRadius: "8px",
                    marginBottom: "15px",
                    border: "1px solid #e9ecef",
                  }}
                >
                  <p
                    style={{
                      margin: "0",
                      fontSize: "1.2rem",
                      fontWeight: "bold",
                      color: "#00492C",
                    }}
                  >
                    평균 {feedbackData.speaking_speed.average_wpm} WPM
                  </p>
                  <p
                    style={{
                      margin: "5px 0 0 0",
                      fontSize: "0.9rem",
                      color: "#666",
                    }}
                  >
                    Words Per Minute (분당 단어 수)
                  </p>
                </div>
                <div
                  style={{
                    backgroundColor: "#e8f5e8",
                    padding: "15px",
                    borderRadius: "8px",
                    border: "1px solid #c3e6c3",
                  }}
                >
                  <p style={{ margin: "0", lineHeight: "1.6", color: "#333" }}>
                    💡 {feedbackData.speaking_speed.comment}
                  </p>
                </div>
              </div>
            ) : (
              <p>말하기 속도 데이터가 없습니다.</p>
            )}
          </div>
        );

      case "pause":
        return (
          <div>
            <h3
              style={{
                color: "#00492C",
                marginBottom: "15px",
                fontSize: "1.1rem",
              }}
            >
              ⏸️ 말하기 템포 분석
            </h3>
            {feedbackData.pause_analysis ? (
              <div>
                <div
                  style={{
                    backgroundColor: "#f8f9fa",
                    padding: "15px",
                    borderRadius: "8px",
                    marginBottom: "15px",
                    border: "1px solid #e9ecef",
                  }}
                >
                  <p
                    style={{
                      margin: "0 0 10px 0",
                      fontWeight: "bold",
                      color: "#00492C",
                    }}
                  >
                    잠깐 쉬는 비율:{" "}
                    {(feedbackData.pause_analysis.pause_ratio * 100).toFixed(1)}
                    %
                  </p>
                  {feedbackData.pause_analysis.long_pauses &&
                    feedbackData.pause_analysis.long_pauses.length > 0 && (
                      <div>
                        <p
                          style={{
                            margin: "0 0 8px 0",
                            fontWeight: "500",
                            color: "#555",
                          }}
                        >
                          오래 멈춘 구간:
                        </p>
                        {feedbackData.pause_analysis.long_pauses.map(
                          (pause, index) => (
                            <p
                              key={index}
                              style={{
                                margin: "0",
                                fontSize: "0.9rem",
                                color: "#666",
                              }}
                            >
                              • {pause.start} ~ {pause.end}
                            </p>
                          )
                        )}
                      </div>
                    )}
                </div>
                <div
                  style={{
                    backgroundColor: "#e8f5e8",
                    padding: "15px",
                    borderRadius: "8px",
                    border: "1px solid #c3e6c3",
                  }}
                >
                  <p style={{ margin: "0", lineHeight: "1.6", color: "#333" }}>
                    💡 {feedbackData.pause_analysis.comment}
                  </p>
                </div>
              </div>
            ) : (
              <p>말하기 템포 분석 데이터가 없습니다.</p>
            )}
          </div>
        );

      default:
        return <p>잘못된 탭입니다.</p>;
    }
  };

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
      {/* 좌측 영역 - 원본 텍스트 */}
      <div
        ref={BoxRef}
        style={{
          width: "50%",
          height: "100%",
          overflowY: "auto",
          overflowX: "hidden",
          justifyContent: "center",
          padding: "20px",
          boxSizing: "border-box",
          borderRight: "2px solid #ECEAD5",
        }}
      >
        <div style={{ minHeight: "100%" }}>
          <h1
            style={{
              color: "#656247",
              fontFamily: "Noto Sans KR, sans-serif",
              fontWeight: 500,
              fontSize: "1.5rem",
              margin: "0px",
              paddingTop: "3%",
              paddingBottom: "5px",
              paddingLeft: "7%",
              position: "relative",
            }}
          >
            파일명 : {sessionData?.fileName || "알 수 없음"}
            {/* exportButton */}
            <button
              className="exportButton"
              title="내보내기 옵션"
              onClick={handleExportButtonClick}
              style={{
                color: "#656247",
                backgroundColor: showActionButtons ? "#d4d1b8" : "#ecead5",
                fontFamily: "Noto Sans KR, sans-serif",
                fontWeight: 600,
                fontSize: "11px",
                border: "none",
                lineHeight: "0.1",
                justifyContent: "center",
                textAlign: "center",
                cursor: "pointer",
                padding: "10px 10px",
                marginLeft: "10px",
                borderRadius: "15px",
                transition: "all 0.2s ease-in-out",
                position: "relative",
              }}
            >
              . . .{/* 액션 버튼들 */}
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  left: "0",
                  zIndex: 1001,
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  marginTop: "5px",
                  opacity: showActionButtons ? 1 : 0,
                  transform: showActionButtons
                    ? "translateY(0)"
                    : "translateY(-10px)",
                  transition: "all 0.3s ease-in-out",
                  visibility: showActionButtons ? "visible" : "hidden",
                  pointerEvents: showActionButtons ? "auto" : "none",
                }}
              >
                {actionButtons.map((button) => (
                  <button
                    key={button.id}
                    title={button.title}
                    onClick={button.onClick}
                    style={{
                      padding: "8px 16px",
                      borderRadius: "6px",
                      fontFamily: "Noto Sans KR, sans-serif",
                      fontWeight: 500,
                      fontSize: "0.7rem",
                      cursor: "pointer",
                      transition: "all 0.2s ease-in-out",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                      border: "none",
                      whiteSpace: "nowrap",
                      minWidth: "140px",
                      ...button.style,
                    }}
                  >
                    {button.text}
                  </button>
                ))}
              </div>
            </button>
          </h1>
          <h2
            style={{
              color: "#656247",
              fontFamily: "Noto Sans KR, sans-serif",
              fontWeight: 300,
              fontSize: "0.84rem",
              paddingLeft: "7%",
              paddingTop: "0px",
              margin: "0px",
            }}
          >
            {sessionData?.uploadTime}
          </h2>

          <div
            style={{
              color: "#656247",
              backgroundColor: "#ECEAD5",
              fontFamily: "Noto Sans KR, sans-serif",
              fontWeight: 400,
              fontSize: "1rem",
              marginTop: "20px",
              marginLeft: "7%",
              marginRight: "5%",
              paddingTop: "40px",
              paddingBottom: "50px",
              paddingLeft: "7%",
              paddingRight: "7%",
              lineHeight: "1.8",
              borderRadius: "10px",
            }}
          >
            <h3
              style={{
                margin: "0 0 20px 0",
                color: "#4a4332",
                fontSize: "1.1rem",
              }}
            >
              📄 원본 텍스트
            </h3>
            <p style={{ margin: "0", lineHeight: "1.8" }}>
              {feedbackData?.original_text ||
                "원본 텍스트를 불러올 수 없습니다."}
            </p>
          </div>

          <img
            src={godown}
            onClick={scrollToBottom}
            alt="최하단으로 이동"
            style={{
              position: "fixed",
              left: "25%",
              bottom: "50px",
              transform: "translateX(-50%)",
              cursor: "pointer",
              width: "50px",
              height: "30px",
            }}
          />
        </div>
      </div>

      {/* 우측 영역 - 피드백 */}
      <div
        style={{
          width: "50%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#ECEAD5",
          padding: "20px",
          boxSizing: "border-box",
        }}
      >
        {/* 세션 정보 표시 */}
        <div
          style={{
            marginBottom: "20px",
            textAlign: "center",
            padding: "15px",
            backgroundColor: "#ffffff",
            borderRadius: "10px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          <p
            style={{
              margin: "0",
              fontWeight: "bold",
              color: "#00492C",
              fontFamily: "Noto Sans KR, sans-serif",
              fontSize: "0.9rem",
            }}
          >
            {sessionData?.situation} ◦ {sessionData?.audience} ◦{" "}
            {sessionData?.style}
          </p>
        </div>

        {/* 탭 메뉴 */}
        <div
          style={{
            display: "flex",
            marginBottom: "20px",
            backgroundColor: "#ffffff",
            borderRadius: "10px",
            padding: "5px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                padding: "10px 5px",
                border: "none",
                backgroundColor:
                  activeTab === tab.id ? "#00492C" : "transparent",
                color: activeTab === tab.id ? "white" : "#666",
                borderRadius: "8px",
                cursor: "pointer",
                fontFamily: "Noto Sans KR, sans-serif",
                fontSize: "0.8rem",
                fontWeight: "500",
                transition: "all 0.2s ease",
              }}
            >
              {tab.icon} {tab.label.split(" ")[1]}
            </button>
          ))}
        </div>

        {/* 탭 컨텐츠 */}
        <div
          style={{
            flex: 1,
            backgroundColor: "#ffffff",
            borderRadius: "10px",
            padding: "20px",
            overflowY: "auto",
            fontFamily: "Noto Sans KR, sans-serif",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          {renderTabContent()}
        </div>

        {/* 새로운 코칭 시작 버튼 */}
        <button
          onClick={handleNewCoaching}
          style={{
            marginTop: "15px",
            padding: "12px 24px",
            backgroundColor: "#00492C",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontFamily: "Noto Sans KR, sans-serif",
            fontSize: "14px",
            fontWeight: "500",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#003d25")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#00492C")}
        >
          🎯 새로운 코칭 시작하기
        </button>
      </div>

      {/* 마우스 감지 영역 */}
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          width: "20px",
          zIndex: 1000,
        }}
      ></div>

      {/* 사이드바 */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          width: "200px",
          backgroundColor: "#00492C",
          color: "white",
          transform: hovered ? "translateX(0)" : "translateX(-200px)",
          transition: "transform 0.2s ease",
          padding: "20px",
          boxSizing: "border-box",
          zIndex: 15,
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          <li
            style={{
              marginBottom: "16px",
              cursor: "pointer",
              padding: "8px",
              borderRadius: "4px",
              transition: "background-color 0.2s",
            }}
            onClick={() => handleNavigation("home")}
            onMouseEnter={(e) =>
              (e.target.style.backgroundColor = "rgba(255,255,255,0.1)")
            }
            onMouseLeave={(e) =>
              (e.target.style.backgroundColor = "transparent")
            }
          >
            홈
          </li>
          <li
            style={{
              marginBottom: "16px",
              cursor: "pointer",
              padding: "8px",
              borderRadius: "4px",
              backgroundColor: "rgba(255,255,255,0.1)", // 현재 페이지 표시
            }}
            onClick={() => handleNavigation("coaching")}
            onMouseEnter={(e) =>
              (e.target.style.backgroundColor = "rgba(255,255,255,0.1)")
            }
            onMouseLeave={(e) =>
              (e.target.style.backgroundColor = "transparent")
            }
          >
            코칭
          </li>
          <li
            style={{
              marginBottom: "16px",
              cursor: "pointer",
              padding: "8px",
              borderRadius: "4px",
              transition: "background-color 0.2s",
            }}
            onClick={() => handleNavigation("archive")}
            onMouseEnter={(e) =>
              (e.target.style.backgroundColor = "rgba(255,255,255,0.1)")
            }
            onMouseLeave={(e) =>
              (e.target.style.backgroundColor = "transparent")
            }
          >
            아카이브
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Coach;
