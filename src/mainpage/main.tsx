import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./main.css";
import godown from "../img/godown.png";

type SummaryButtonId = "간단요약" | "상세요약" | "키워드요약";

type SummaryData = {
  text?: string;
  간단요약?: string;
  상세요약?: string;
  키워드요약?: string;
  fileName?: string;
  uploadTime?: string;
  summaryType?: SummaryButtonId;
};

function Main() {
  const navigate = useNavigate();

  // 상태
  const [animate1, setAnimate1] = useState<boolean>(false);
  const [activeButton, setActiveButton] = useState<SummaryButtonId | null>(
    null
  );
  const [showActionMenu, setShowActionMenu] = useState<Record<string, boolean>>(
    {}
  );
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null);
  const [currentSummary, setCurrentSummary] = useState<string>("");
  // const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const BoxRef = useRef<HTMLDivElement | null>(null);

  // 박스 등장 애니메이션
  useEffect(() => {
    // if (!isAuthenticated) return;
    const t = window.setTimeout(() => setAnimate1(true), 500);
    return () => window.clearTimeout(t);
  }, []);

  // 요약 데이터 로드 (인증 후)
  useEffect(() => {
    // if (!isAuthenticated) return;

    const saved = localStorage.getItem("summaryData");
    if (saved) {
      try {
        const parsed: SummaryData = JSON.parse(saved);
        setSummaryData(parsed);
        const initial =
          parsed.간단요약 ?? parsed.text ?? "요약 데이터를 불러올 수 없습니다.";
        setCurrentSummary(initial);
        setActiveButton("간단요약");
        return;
      } catch (e) {
        console.error("데이터 파싱 오류:", e);
        setCurrentSummary("저장된 요약 데이터를 불러올 수 없습니다.");
      }
    }

    // 기본 테스트 데이터
    const defaultData: SummaryData = {
      text: "안녕하세요. 오늘은 정보통신공학과에 대해 소개해드리겠습니다. 정보통신공학은 쉽게 말해 ...",
      간단요약:
        "정보통신공학과는 IT와 통신 기술을 바탕으로 다양한 실습과 프로젝트를 통해 실무 능력을 기르고, 5G·AI 등 미래 기술에 대응하는 융합형 인재를 양성합니다.",
      상세요약:
        "정보통신공학과는 IT와 통신 기술을 융합한 분야로, 스마트폰과 인공지능 같은 일상 속 첨단 기술의 기반이 됩니다. ...",
      키워드요약:
        "• IT + 통신기술 융합\n• 디지털 신호처리, 무선통신, 네트워크, 프로그래밍\n• 5G, 6G, IoT, 자율주행\n• 실무 중심 교육, 캡스톤디자인\n• 산학협력 프로젝트\n• 통신사·IT기업·연구소 진출\n• 해외 인턴십, 글로벌 역량\n• 창의적·융합형 공학 인재",
      fileName: "sample_audio.mp3",
      uploadTime: new Date().toLocaleString(),
      summaryType: "간단요약",
    };
    setSummaryData(defaultData);
    setActiveButton("간단요약");
    setCurrentSummary(defaultData.간단요약!);
  }, []);

  // 스크롤
  const scrollToBottom = () => {
    if (BoxRef.current) {
      BoxRef.current.scrollTo({
        top: BoxRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  // 버튼 클릭
  const handleButtonClick = (
    buttonId: SummaryButtonId,
    originalOnClick?: () => void
  ) => {
    setActiveButton(buttonId);
    if (summaryData) {
      if (buttonId === "간단요약")
        setCurrentSummary(summaryData.간단요약 ?? summaryData.text ?? "");
      else if (buttonId === "상세요약")
        setCurrentSummary(summaryData.상세요약 ?? summaryData.text ?? "");
      else if (buttonId === "키워드요약")
        setCurrentSummary(summaryData.키워드요약 ?? summaryData.text ?? "");
    }
    originalOnClick?.();
  };

  // 액션 메뉴 토글
  const toggleActionMenu = (
    fileId: string,
    event: React.MouseEvent<HTMLSpanElement>
  ) => {
    event.stopPropagation();
    setShowActionMenu((prev) => ({ ...prev, [fileId]: !prev[fileId] }));
  };

  // 새 업로드
  const handleNewUpload = () => {
    localStorage.removeItem("summaryData");
    navigate("/upload");
  };

  const getSummaryTypeName = (buttonId: SummaryButtonId | null) => {
    switch (buttonId) {
      case "간단요약":
        return "간단 요약";
      case "상세요약":
        return "상세 요약";
      case "키워드요약":
        return "키워드 요약";
      default:
        return "요약";
    }
  };

  // 내보내기/복사 공통 텍스트
  const getFullContent = () => {
    const summaryTypeName = getSummaryTypeName(activeButton);
    let content = `파일명: ${summaryData?.fileName || "알 수 없음"}\n`;
    content += `생성일시: ${
      summaryData?.uploadTime || new Date().toLocaleString()
    }\n\n`;
    content += `=== 원본 텍스트 ===\n${
      summaryData?.text || "원본 텍스트를 불러올 수 없습니다."
    }\n\n`;
    if (activeButton && currentSummary) {
      content += `=== ${summaryTypeName} ===\n${currentSummary}`;
    }
    return content;
  };

  // 복사
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(getFullContent());
      alert("원본 텍스트와 요약이 클립보드에 복사되었습니다.");
    } catch {
      // 구형 브라우저 폴백
      const ta = document.createElement("textarea");
      ta.value = getFullContent();
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      alert("원본 텍스트와 요약이 클립보드에 복사되었습니다.");
    }
  };

  // 파일로 내보내기
  const exportToFile = () => {
    const fileName = `요약_${
      summaryData?.fileName?.replace(/\.[^/.]+$/, "") || "audio"
    }_${new Date().toLocaleDateString("ko-KR").replace(/\./g, "")}.txt`;
    const blob = new Blob([getFullContent()], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // 보관함 저장
  const saveToArchive = () => {
    const fileName = prompt("저장할 파일 이름을 입력하세요:");
    if (!fileName) return;

    const archiveList: any[] =
      JSON.parse(localStorage.getItem("archiveFiles") || "[]") || [];

    const newFile = {
      fileId: Date.now(),
      originalFileName: fileName,
      createdAt: new Date().toISOString(),
      transcript: summaryData?.text || "",
      summary1: summaryData?.간단요약 || "",
      summary2: summaryData?.상세요약 || "",
      summary3: summaryData?.키워드요약 || "",
    };

    archiveList.push(newFile);
    localStorage.setItem("archiveFiles", JSON.stringify(archiveList));
    alert("보관함에 저장되었습니다!");
  };

  // 우측 상단 액션 버튼들
  const actionButtons = [
    {
      id: "copy",
      text: "텍스트 복사",
      title: "원본 텍스트와 선택된 요약을 클립보드에 복사",
      onClick: copyToClipboard,
      style: { backgroundColor: "#f0f0f0", color: "#656247", border: "none" },
    },
    {
      id: "export",
      text: "txt 파일로 내보내기",
      title: "원본 텍스트와 선택된 요약을 텍스트 파일로 다운로드",
      onClick: exportToFile,
      style: { backgroundColor: "#f0f0f0", color: "#656247", border: "none" },
    },
    {
      id: "goToArchive",
      text: "Archive에 저장",
      title: "보관함에 저장",
      onClick: saveToArchive,
      style: { backgroundColor: "#f0f0f0", color: "#656247", border: "none" },
    },
    {
      id: "newUpload",
      text: "📁 새 파일 업로드",
      title: "새로운 파일을 업로드합니다",
      onClick: handleNewUpload,
      style: { backgroundColor: "#00492C", color: "white", border: "none" },
    },
  ] as const;

  // 인증 중 화면
  // if (!isAuthenticated) {
  //   return (
  //     <div
  //       style={{
  //         backgroundColor: "#00492C",
  //         height: "100vh",
  //         display: "flex",
  //         justifyContent: "center",
  //         alignItems: "center",
  //         color: "#F2C81B",
  //         fontSize: "18px",
  //         fontFamily: "Noto Sans KR, sans-serif",
  //       }}
  //     >
  //       인증 확인 중...
  //     </div>
  //   );
  // }

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
      {/* 제목 - 클릭하면 업로드 페이지로 이동 */}
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
          cursor: "pointer",
          transition: "all 0.3s ease-in-out",
        }}
        onClick={handleNewUpload}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLHeadingElement).style.opacity = "0.8";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLHeadingElement).style.opacity = "1";
        }}
        title="새 파일 업로드"
      >
        Saymary
      </h1>

      {/* 메인 컨텐츠 박스 */}
      <div
        className="custom-scroll"
        ref={BoxRef}
        style={{
          backgroundColor: "#FFFCE4",
          position: "absolute",
          borderRadius: "10px",
          boxShadow: "-20px 5px 0px rgba(0, 0, 0, 0.2)",
          top: "20%",
          left: "12%",
          width: "88%",
          height: "80%",
          opacity: animate1 ? 1 : 0,
          transition: "all 0.3s ease-in-out",
          overflowY: "auto",
          zIndex: 1000,
        }}
      >
        {/* 파일명 헤더 */}
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
            position: "relative",
          }}
        >
          파일명: {summaryData?.fileName || "알 수 없음"}
          {/* 액션 버튼 */}
          <span
            style={{
              color: "#656247",
              backgroundColor: "transparent",
              fontFamily: "Noto Sans KR, sans-serif",
              fontWeight: 600,
              fontSize: "16px",
              border: "none",
              lineHeight: "1",
              cursor: "pointer",
              padding: "8px 10px",
              marginLeft: "10px",
              borderRadius: "4px",
              transition: "all 0.2s ease-in-out",
              userSelect: "none",
            }}
            onClick={(e) => toggleActionMenu("main", e)}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLSpanElement).style.backgroundColor =
                "#ddd8c1";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLSpanElement).style.backgroundColor =
                "transparent";
            }}
          >
            ⋮
          </span>
          {/* 액션 메뉴 */}
          {showActionMenu["main"] && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                left: "27%",
                zIndex: 1001,
                display: "flex",
                flexDirection: "column",
                backgroundColor: "#fff",
                border: "1px solid #ccc",
                borderRadius: "8px",
                overflow: "hidden",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              }}
            >
              {actionButtons.map((btn) => (
                <button
                  key={btn.id}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    textAlign: "left",
                    cursor: "pointer",
                    fontSize: "14px",
                    transition: "background-color 0.2s ease",
                    whiteSpace: "nowrap",
                    ...btn.style,
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    btn.onClick();
                    setShowActionMenu({});
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLButtonElement;
                    if (btn.id === "newUpload")
                      el.style.backgroundColor = "#005a35";
                    else el.style.backgroundColor = "#f0f0f0";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLButtonElement;
                    el.style.backgroundColor =
                      (btn.style as any)?.backgroundColor || "#e8e7e0ff";
                  }}
                  title={btn.title}
                >
                  {btn.text}
                </button>
              ))}
            </div>
          )}
        </h1>

        {/* 날짜 */}
        <h2
          style={{
            color: "#656247",
            fontFamily: "Noto Sans KR, sans-serif",
            fontWeight: 300,
            fontSize: "11px",
            paddingLeft: "7%",
            paddingTop: "0px",
            margin: "0px",
          }}
        >
          {summaryData?.uploadTime || new Date().toLocaleString()}
        </h2>

        {/* 원본 텍스트 */}
        <div
          style={{
            color: "#656247",
            backgroundColor: "#ECEAD5",
            fontFamily: "Noto Sans KR, sans-serif",
            fontWeight: 400,
            fontSize: "0.8rem",
            marginTop: "20px",
            marginLeft: "7%",
            marginRight: "8%",
            paddingTop: "40px",
            paddingBottom: "50px",
            paddingLeft: "10%",
            paddingRight: "10%",
            lineHeight: "2",
            borderRadius: "10px",
            whiteSpace: "pre-line",
          }}
        >
          {summaryData?.text || "원본 텍스트를 불러올 수 없습니다."}

          {/* 요약 타입 선택 버튼들 */}
          <div
            style={{
              textAlign: "center",
              marginTop: "20px",
              display: "flex",
              justifyContent: "center",
              gap: "10%",
            }}
          >
            {(
              [
                {
                  id: "간단요약",
                  text: "간단 요약",
                  title: "짧고 핵심적인 한두 문장으로 내용을 압축한 요약",
                  onClick: () => console.log("간단 요약 클릭"),
                },
                {
                  id: "상세요약",
                  text: "상세 요약",
                  title: "전체 내용을 자세히 풀어 설명한 장문 요약",
                  onClick: () => console.log("상세 요약 클릭"),
                },
                {
                  id: "키워드요약",
                  text: "키워드 요약",
                  title: "핵심 키워드만 뽑아낸 리스트형 요약",
                  onClick: () => console.log("키워드 요약 클릭"),
                },
              ] as {
                id: SummaryButtonId;
                text: string;
                title: string;
                onClick: () => void;
              }[]
            ).map((button) => (
              <button
                key={button.id}
                title={button.title}
                aria-label={`${button.text}: ${button.title}`}
                onClick={() => handleButtonClick(button.id, button.onClick)}
                style={{
                  padding: "10px 30px",
                  borderRadius: "10px",
                  border: `dashed 4px ${
                    activeButton === button.id ? "#F2C81B" : "#9a8018ff"
                  }`,
                  backgroundColor:
                    activeButton === button.id
                      ? "rgba(242, 200, 27, 0.1)"
                      : "transparent",
                  color: "#000000",
                  fontFamily: "Noto Sans KR, sans-serif",
                  fontWeight: 500,
                  fontSize: "0.6rem",
                  cursor: "pointer",
                  marginTop: "15px",
                  transition: "all 0.3s ease-in-out",
                }}
              >
                {button.text}
              </button>
            ))}
          </div>
        </div>

        {/* 선택된 요약 */}
        <div
          style={{
            marginTop: "20px",
            marginLeft: "7%",
            marginRight: "8%",
            marginBottom: "50px",
          }}
        >
          <div
            style={{
              color: "#4a4332",
              backgroundColor: "#ECEAD5",
              fontFamily: "Noto Sans KR, sans-serif",
              fontWeight: activeButton === "키워드요약" ? 700 : 500,
              fontSize: activeButton === "키워드요약" ? "1rem" : "0.8rem",
              padding: "10%",
              lineHeight: "2.2",
              borderRadius: "10px",
              whiteSpace: "pre-line",
              minHeight: "120px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: activeButton ? "left" : "center",
            }}
          >
            {activeButton === "키워드요약" && currentSummary ? (
              <div style={{ width: "100%", textAlign: "left" }}>
                {currentSummary.split("\n").map((line, index) => {
                  // 키워드 라인인지 확인 (•나 -로 시작하는 라인)
                  if (
                    line.trim().startsWith("•") ||
                    line.trim().startsWith("-")
                  ) {
                    const keyword = line.replace(/^[•\-]\s*/, "").trim();
                    if (keyword) {
                      return (
                        <span
                          key={index}
                          style={{
                            display: "inline-block",
                            fontFamily: "Noto Sans KR, sans-serif",
                            margin: "5px 10px",
                            padding: "8px 16px",
                            backgroundColor: "#00492C",
                            borderRadius: "25px",
                            color: "#ffffff",
                            fontWeight: 500,
                            fontSize: "0.8rem",
                            minWidth: "80px",
                            textAlign: "center",
                            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                          }}
                        >
                          {keyword}
                        </span>
                      );
                    }
                  } else if (line.trim()) {
                    // 일반 텍스트 라인 (제목이나 설명)
                    return (
                      <div
                        key={index}
                        style={{ marginBottom: "15px", fontWeight: 600 }}
                      >
                        {line}
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            ) : (
              currentSummary || "위의 버튼을 클릭하여 요약을 확인해보세요! 📋"
            )}
          </div>
        </div>

        {/* 하단 스크롤 버튼 */}
        <img
          src={godown}
          onClick={scrollToBottom}
          alt="최하단으로 이동"
          title="최하단으로 스크롤"
          style={{
            position: "fixed",
            left: "55%",
            bottom: "50px",
            transform: "translateX(-50%)",
            zIndex: 999,
            cursor: "pointer",
            width: "50px",
            height: "30px",
          }}
        />
      </div>
    </div>
  );
}

export default Main;
