import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import godown from "../img/godown.png";
import homeIcon from "../img/home.png";
import coachingIcon from "../img/coaching.png";
import archiveIcon from "../img/archive.png";

// ---------------- Types ----------------
interface SpeakingSpeed {
  average_wpm: number;
  duration_seconds: number;
  word_count: number;
  comment: string;
}

interface PauseAnalysis {
  pause_count: number;
  avg_pause_length: number;
  total_silence: number;
  long_pauses: unknown[]; // API상 개별 정보 없음
  comment: string;
}

interface FeedbackData {
  original_text: string;
  summary: string;
  detailed_summary: string;
  keywords: string;
  speaking_speed?: SpeakingSpeed;
  pause_analysis?: PauseAnalysis;
}

interface SessionData {
  situation: string;
  audience: string;
  style: string;
  fileName: string;
  uploadTime: string;
}

interface NavState {
  feedback?: unknown;
  situation?: string;
  audience?: string;
  style?: string;
  fileName?: string;
  uploadTime?: string;
}

interface ActionButton {
  id: string;
  text: string;
  title: string;
  onClick: () => void;
  style: React.CSSProperties;
}

type TabId = "summary" | "speed" | "pause";

interface TabItem {
  id: TabId;
  label: string;
  icon: string;
}

function Coach() {
  const navigate = useNavigate();
  // 타입 안정성을 위해 location을 별도 변수에 제네릭 형태로 보관
  const location = useLocation() as { state?: NavState; pathname: string };

  const [hovered, setHovered] = useState<boolean>(false);
  const [feedbackData, setFeedbackData] = useState<FeedbackData | null>(null);
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [showActionButtons, setShowActionButtons] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<TabId>("summary"); // 우측 탭 상태 기본값

  const BoxRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (location.state) {
      const receivedFeedback = location.state.feedback;
      // console.log("받은 피드백 데이터:", receivedFeedback);

      let parsed: any = {};
      if (typeof receivedFeedback === "string") {
        try {
          parsed = JSON.parse(receivedFeedback);
        } catch {
          parsed = { summary: receivedFeedback };
        }
      } else if (
        typeof receivedFeedback === "object" &&
        receivedFeedback !== null
      ) {
        parsed = receivedFeedback;
      }
      // 1) 래핑 제거(data/result/coaching 등)
      const payload =
        parsed?.data ?? parsed?.result ?? parsed?.coaching ?? parsed;

      // 2) 속도/템포 소스 선택
      const speedSrc = payload.speaking_speed ?? payload.speed_analysis ?? null;
      const pauseSrc = payload.pause_analysis ?? null;

      // 3) feedback을 요약/상세로 폴백
      const feedbackRaw =
        typeof payload.feedback === "string" ? payload.feedback.trim() : "";

      const firstPara = feedbackRaw
        ? feedbackRaw.split(/\r?\n\r?\n|\r?\n/)[0].replace(/^한줄평:\s*/, "")
        : "";

      const extractKeywords = (txt: string) => {
        if (!txt) return "";
        // "키워드: A, B, C" 같은 줄이 있으면 그걸 사용
        const m = txt.match(/키워드\s*[:：]\s*(.+)/i);
        if (m)
          return m[1]
            .split(/[,\s·]+/)
            .filter(Boolean)
            .join(", ");
        // 글머리표( -, •, · )로 시작하는 라인 몇 개를 키워드로 사용
        return txt
          .split(/\r?\n/)
          .filter((l) => /^[\-•·]/.test(l))
          .map((l) => l.replace(/^[\-•·]\s*/, ""))
          .slice(0, 8)
          .join(", ");
      };

      const summaryText =
        payload.summary ??
        payload.summary_text ??
        payload.summary?.text ??
        firstPara;

      const detailedText =
        payload.detailed_summary ?? (feedbackRaw || summaryText);

      const keywordsText = Array.isArray(payload.keywords)
        ? payload.keywords.join(", ")
        : (
            payload.keywords ??
            payload.summaries?.keyword ??
            payload.summaries?.["키워드요약"] ??
            extractKeywords(feedbackRaw)
          ) // ← 마지막 폴백
            .toString();

      // 4) 화면용 객체 생성
      const feedbackDataFormatted: FeedbackData = {
        original_text:
          payload.original_text ?? payload.transcript ?? payload.text ?? "",
        summary: summaryText || "",
        detailed_summary: detailedText || "",
        keywords: keywordsText,
        speaking_speed: speedSrc
          ? {
              average_wpm: speedSrc.average_wpm ?? speedSrc.wpm ?? 0,
              duration_seconds:
                speedSrc.duration_seconds ?? speedSrc.duration ?? 0,
              word_count: speedSrc.word_count ?? 0,
              comment: speedSrc.comment ?? speedSrc.feedback ?? "",
            }
          : undefined,
        pause_analysis: pauseSrc
          ? {
              pause_count:
                pauseSrc.pause_count ?? pauseSrc.pause_stats?.pause_count ?? 0,
              avg_pause_length:
                pauseSrc.avg_pause_length ??
                pauseSrc.pause_stats?.avg_pause_length ??
                0,
              total_silence:
                pauseSrc.total_silence ??
                pauseSrc.pause_stats?.total_silence ??
                0,
              long_pauses:
                pauseSrc.long_pauses ?? pauseSrc.pause_stats?.long_pauses ?? [],
              comment: pauseSrc.comment ?? pauseSrc.feedback ?? "",
            }
          : undefined,
      };

      // 5) 상태 반영
      setFeedbackData(feedbackDataFormatted);

      setSessionData({
        situation: location.state.situation || "알 수 없음",
        audience: location.state.audience || "알 수 없음",
        style: location.state.style || "알 수 없음",
        fileName: location.state.fileName || "파일 없음",
        uploadTime: location.state.uploadTime || new Date().toLocaleString(),
      });
    } else {
      // 직접 접근한 경우 테스트 데이터 설정
      setFeedbackData({
        original_text:
          "재택근무는 코로나19 팬데믹을 계기로 빠르게 확산된 근무 형태입니다.",
        summary: "발표력이 좋습니다.",
        detailed_summary: "전반적으로 명확하고 체계적인 발표였습니다.",
        keywords: "재택근무, 코로나19, 팬데믹",
        speaking_speed: {
          average_wpm: 160.37,
          duration_seconds: 17.21,
          word_count: 46,
          comment: "적절한 말하기 속도입니다.",
        },
        pause_analysis: {
          pause_count: 0,
          avg_pause_length: 0,
          total_silence: 0,
          long_pauses: [],
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
    const timer = window.setTimeout(() => {
      setHovered(false);
    }, 1200);

    return () => window.clearTimeout(timer);
  }, [location]);

  const scrollToBottom = () => {
    const el = BoxRef.current;
    if (el) {
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    }
  };

  // 사이드바 네비게이션 핸들러
  const handleNavigation = (path: "home" | "coaching" | "archive") => {
    switch (path) {
      case "home":
        navigate("/");
        break;
      case "coaching":
        navigate("/coaching/select");
        break;
      case "archive":
        navigate("/archive");
        break;
      default:
        // noop
        break;
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
        content += `=== 간단 요약 ===\n${
          feedbackData.summary || "요약 없음"
        }\n\n`;
        content += `=== 상세 요약 ===\n${
          feedbackData.detailed_summary || "상세 요약 없음"
        }\n\n`;
        content += `=== 키워드 ===\n${
          feedbackData.keywords || "키워드 없음"
        }\n\n`;

        if (feedbackData.speaking_speed) {
          content += `=== 말하기 속도 분석 ===\n평균 WPM: ${feedbackData.speaking_speed.average_wpm}\n발화 시간: ${feedbackData.speaking_speed.duration_seconds}초\n단어 수: ${feedbackData.speaking_speed.word_count}개\n코멘트: ${feedbackData.speaking_speed.comment}\n\n`;
        }

        if (feedbackData.pause_analysis) {
          content += `=== 말하기 템포 분석 ===\n멈춤 횟수: ${feedbackData.pause_analysis.pause_count}회\n평균 멈춤 길이: ${feedbackData.pause_analysis.avg_pause_length}초\n총 침묵 시간: ${feedbackData.pause_analysis.total_silence}초\n코멘트: ${feedbackData.pause_analysis.comment}\n`;
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
      content += `=== 간단 요약 ===\n${
        feedbackData.summary || "요약 없음"
      }\n\n`;
      content += `=== 상세 요약 ===\n${
        feedbackData.detailed_summary || "상세 요약 없음"
      }\n\n`;
      content += `=== 키워드 ===\n${
        feedbackData.keywords || "키워드 없음"
      }\n\n`;

      if (feedbackData.speaking_speed) {
        content += `=== 말하기 속도 분석 ===\n평균 WPM: ${feedbackData.speaking_speed.average_wpm}\n발화 시간: ${feedbackData.speaking_speed.duration_seconds}초\n단어 수: ${feedbackData.speaking_speed.word_count}개\n코멘트: ${feedbackData.speaking_speed.comment}\n\n`;
      }

      if (feedbackData.pause_analysis) {
        content += `=== 말하기 템포 분석 ===\n멈춤 횟수: ${feedbackData.pause_analysis.pause_count}회\n평균 멈춤 길이: ${feedbackData.pause_analysis.avg_pause_length}초\n총 침묵 시간: ${feedbackData.pause_analysis.total_silence}초\n코멘트: ${feedbackData.pause_analysis.comment}\n`;
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
  const actionButtons: ActionButton[] = [
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
      onClick: () => handleNewCoaching(),
      style: {
        backgroundColor: "#00492C",
        color: "white",
        border: "none",
      },
    },
  ];

  // 탭 데이터
  const tabs: TabItem[] = [
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
                📝 간단 요약
              </h3>
              <p
                style={{
                  lineHeight: "1.6",
                  color: "#333",
                  marginBottom: "15px",
                }}
              >
                {feedbackData.summary || "간단 요약이 없습니다."}
              </p>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <h3
                style={{
                  color: "#00492C",
                  marginBottom: "10px",
                  fontSize: "1.1rem",
                }}
              >
                📄 상세 요약
              </h3>
              <p
                style={{
                  lineHeight: "1.6",
                  color: "#333",
                  marginBottom: "15px",
                }}
              >
                {feedbackData.detailed_summary || "상세 요약이 없습니다."}
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
              <div
                style={{
                  lineHeight: "1.6",
                  color: "#333",
                  whiteSpace: "pre-line",
                }}
              >
                {feedbackData.keywords || "키워드가 없습니다."}
              </div>
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
                      margin: "0 0 10px 0",
                      fontSize: "1.2rem",
                      fontWeight: "bold",
                      color: "#00492C",
                    }}
                  >
                    평균 {feedbackData.speaking_speed.average_wpm} WPM
                  </p>
                  <p
                    style={{
                      margin: "5px 0",
                      fontSize: "0.9rem",
                      color: "#666",
                    }}
                  >
                    발화 시간: {feedbackData.speaking_speed.duration_seconds}초
                  </p>
                  <p
                    style={{
                      margin: "5px 0",
                      fontSize: "0.9rem",
                      color: "#666",
                    }}
                  >
                    총 단어 수: {feedbackData.speaking_speed.word_count}개
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
                    padding: "20px",
                    borderRadius: "10px",
                    border: "1px solid #c3e6c3",
                  }}
                >
                  <div
                    style={{
                      margin: "0",
                      lineHeight: "1.8",
                      color: "#333",
                      fontSize: "0.95rem",
                      wordBreak: "keep-all",
                      overflowWrap: "break-word",
                      maxHeight: "400px",
                      overflowY: "auto",
                    }}
                  >
                    💡
                    <span
                      dangerouslySetInnerHTML={{
                        __html: (feedbackData.speaking_speed.comment ?? "")
                          .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                          .replace(/\n(\d+)\. /g, "<br/><br/>$1. ")
                          .replace(/\n/g, "<br/>"),
                      }}
                    />
                  </div>
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
                    멈춤 통계
                  </p>
                  <p
                    style={{
                      margin: "5px 0",
                      fontSize: "0.9rem",
                      color: "#666",
                    }}
                  >
                    멈춤 횟수: {feedbackData.pause_analysis.pause_count}회
                  </p>
                  <p
                    style={{
                      margin: "5px 0",
                      fontSize: "0.9rem",
                      color: "#666",
                    }}
                  >
                    평균 멈춤 길이:{" "}
                    {feedbackData.pause_analysis.avg_pause_length}초
                  </p>
                  <p
                    style={{
                      margin: "5px 0",
                      fontSize: "0.9rem",
                      color: "#666",
                    }}
                  >
                    총 침묵 시간: {feedbackData.pause_analysis.total_silence}초
                  </p>
                </div>
                <div
                  style={{
                    backgroundColor: "#e8f5e8",
                    padding: "20px",
                    borderRadius: "10px",
                    border: "1px solid #c3e6c3",
                  }}
                >
                  <div
                    style={{
                      margin: "0",
                      lineHeight: "1.8",
                      color: "#333",
                      fontSize: "0.95rem",
                      wordBreak: "keep-all",
                      overflowWrap: "break-word",
                      maxHeight: "400px",
                      overflowY: "auto",
                    }}
                  >
                    💡
                    <span
                      dangerouslySetInnerHTML={{
                        __html: (feedbackData.pause_analysis.comment ?? "")
                          .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                          .replace(/\n(\d+)\. /g, "<br/><br/>$1. ")
                          .replace(/\n/g, "<br/>"),
                      }}
                    />
                  </div>
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
                    onMouseEnter={(e) => {
                      const target = e.currentTarget as HTMLButtonElement;
                      if (button.id === "newCoaching")
                        target.style.backgroundColor = "#003d25";
                      else target.style.opacity = "0.9";
                    }}
                    onMouseLeave={(e) => {
                      const target = e.currentTarget as HTMLButtonElement;
                      target.style.opacity = "1";
                      target.style.backgroundColor = button.style
                        .backgroundColor as string;
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
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor =
              "#003d25";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor =
              "#00492C";
          }}
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
      />

      {/* 사이드바 */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          width: "200px",
          backgroundColor: "#00492C",
          transform: hovered ? "translateX(0)" : "translateX(-200px)",
          transition: "transform 0.2s ease",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: "100px",
          gap: "40px",
          zIndex: 15,
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <SidebarButton
          label="Home"
          icon={homeIcon}
          isActive={location.pathname === "/"}
          onClick={() => handleNavigation("home")}
        />
        <SidebarButton
          label="Coaching"
          icon={coachingIcon}
          isActive={location.pathname.startsWith("/coaching")}
          onClick={() => handleNavigation("coaching")}
        />
        <SidebarButton
          label="Archive"
          icon={archiveIcon}
          isActive={location.pathname.startsWith("/archive")}
          onClick={() => handleNavigation("archive")}
        />
      </div>
    </div>
  );
}

export default Coach;

// ---------------- Sidebar Button ----------------
interface SidebarButtonProps {
  label: string;
  icon?: string; // 처리 방식에 따라 string URL
  isActive: boolean;
  onClick: () => void;
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
      {icon && (
        <img src={icon} alt={label} style={{ width: "24px", height: "24px" }} />
      )}
      <span>{label}</span>
    </button>
  );
}
