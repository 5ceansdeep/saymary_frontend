import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./main.css";
import godown from "../img/godown.png";

function Main() {
  const navigate = useNavigate();

  // 상태 관리
  const [animate1, setAnimate1] = useState(false);
  const [activeButton, setActiveButton] = useState(null);
  const [showActionButtons, setShowActionButtons] = useState(false);
  const BoxRef = useRef();

  // 3.8초 후 노란 박스 애니메이션 시작
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimate1(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // 스크롤 함수
  const scrollToBottom = () => {
    if (BoxRef.current) {
      BoxRef.current.scrollTo({
        top: BoxRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  // 버튼 클릭 핸들러
  const handleButtonClick = (buttonId, originalOnClick) => {
    setActiveButton(buttonId);
    if (originalOnClick) {
      originalOnClick();
    }
  };

  // exportButton 클릭 핸들러
  const handleExportButtonClick = () => {
    setShowActionButtons((prev) => !prev);
  };

  // 새 파일 업로드 핸들러 (업로드 페이지로 이동)
  const handleNewUpload = () => {
    navigate("/upload");
  };

  // 요약 텍스트 (실제 데이터)
  const summaryText = `재택근무는 코로나19 팬데믹을 계기로 빠르게 확산된 근무 형태이다. 직원들은 출퇴근 시간이 사라지면서 더 많은 여유 시간을 확보할 수 있게 되었다. 이는 워라밸(Work-Life Balance) 향상에 긍정적인 영향을 주었다. 또한, 자율적인 시간 관리가 가능해져 개인의 집중력이 오히려 높아지기도 한다. 기업 입장에서는 사무실 운영비용 절감 등의 경제적 이점이 존재한다. 반면, 팀원 간의 소통이 부족해지며 협업 효율이 낮아지는 경우도 있다. 물리적 거리감은 심리적 거리감으로 이어져 조직 소속감을 약화시킬 수 있다. 특히 신입사원의 경우 적응이 어렵고 피드백이 늦어 성장이 더뎌질 수 있다. 업무와 사생활의 경계가 모호해지면서 오히려 스트레스를 유발하기도 한다. 사이버 보안 및 데이터 보호 문제도 재택근무의 큰 과제로 남아 있다. 일부 기업은 하이브리드 근무 형태를 도입하여 장단점을 조율하고 있다. 기술 인프라와 커뮤니케이션 도구의 발전은 원격 협업을 점차 수월하게 만들고 있다. 재택근무는 직무의 특성과 개인의 성향에 따라 효과가 달라질 수 있다. 따라서 일률적인 정책보다는 유연한 제도 설계가 필요하다. 결론적으로 재택근무는 미래 업무 환경의 중요한 축으로 자리 잡아가고 있다.`;

  // 텍스트 복사 함수
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(summaryText);
      alert("클립보드에 복사되었습니다.");
    } catch (err) {
      const textArea = document.createElement("textarea");
      textArea.value = summaryText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      alert("클립보드에 복사되었습니다.");
    }
  };

  // 파일로 내보내기 함수
  const exportToFile = () => {
    const fileName = `요약_${new Date()
      .toLocaleDateString("ko-KR")
      .replace(/\./g, "")}.txt`;
    const fileContent = `파일명: 알아서 AI가 요약해준대로 임시로 지정
생성일시: ${new Date().toLocaleString()}

${summaryText}`;

    const blob = new Blob([fileContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // 버튼 데이터 배열
  const summaryButtons = [
    {
      id: "simple",
      text: "간단 요약",
      title: "짧고 핵심적인 한두 문장으로 내용을 압축한 요약",
      onClick: () => console.log("간단 요약 클릭"),
    },
    {
      id: "detailed",
      text: "상세 요약",
      title: "전체 내용을 자세히 풀어 설명한 장문 요약",
      onClick: () => console.log("상세 요약 클릭"),
    },
    {
      id: "keyword",
      text: "키워드 요약",
      title: "핵심 키워드만 뽑아낸 리스트형 요약",
      onClick: () => console.log("키워드 요약 클릭"),
    },
  ];

  // 액션 버튼 데이터 배열
  const actionButtons = [
    {
      id: "copy",
      text: "텍스트 복사",
      title: "요약 내용을 클립보드에 복사",
      onClick: copyToClipboard,
      style: {
        backgroundColor: "#F2C81B",
        color: "white",
        border: "none",
      },
    },
    {
      id: "export",
      text: "txt 파일 저장",
      title: "요약 내용을 텍스트 파일로 다운로드",
      onClick: exportToFile,
      style: {
        backgroundColor: "#F2C81B",
        color: "white",
        border: "none",
      },
    },
    {
      id: "newUpload",
      text: "새 파일 업로드",
      title: "새로운 파일을 업로드",
      onClick: handleNewUpload,
      style: {
        backgroundColor: "#00492C",
        color: "white",
        border: "none",
      },
    },
  ];

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
      {/* 제목 - 클릭하면 홈(업로드 페이지)로 이동 */}
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
          e.target.style.opacity = "0.8";
        }}
        onMouseLeave={(e) => {
          e.target.style.opacity = "1";
        }}
        title="홈으로 돌아가기"
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
          파일명 : 알아서 AI가 요약해준대로 임시로 지정
          {/* exportButton */}
          <button
            className="exportButton"
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
            . . .
            {/* 액션 버튼들 */}
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
                  aria-label={button.title}
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
                    e.target.style.transform = "scale(1.02)";
                    e.target.style.boxShadow = "0 4px 12px rgba(0,0,0,0.25)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = "scale(1)";
                    e.target.style.boxShadow = "0 2px 8px rgba(0,0,0,0.15)";
                  }}
                >
                  {button.text}
                </button>
              ))}
            </div>
          </button>
        </h1>

        {/* 날짜 표시 */}
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
          {new Date().toLocaleString()}
        </h2>

        {/* 요약 텍스트 본문 */}
        <p
          style={{
            color: "#656247",
            backgroundColor: "#ECEAD5",
            fontFamily: "Noto Sans KR, sans-serif",
            fontWeight: 400,
            fontSize: "12px",
            marginTop: "20px",
            marginLeft: "7%",
            marginRight: "8%",
            paddingTop: "40px",
            paddingBottom: "50px",
            paddingLeft: "40px",
            paddingRight: "40px",
            lineHeight: "2",
            borderRadius: "10px",
          }}
        >
          {summaryText}

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
            {summaryButtons.map((button) => (
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
                  fontSize: "0.7rem",
                  cursor: "pointer",
                  marginTop: "15px",
                  transition: "all 0.3s ease-in-out",
                }}
              >
                {button.text}
              </button>
            ))}
          </div>
        </p>

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
