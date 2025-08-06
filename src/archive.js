import React, { useState, useEffect } from "react";
import Search from "../img/search.png";

function Archive() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showActionMenu, setShowActionMenu] = useState({});

  // Mock 데이터 (API 대신 사용)
  const mockFiles = [
    {
      originalFileName: "회의록_2025_01_15.pdf",
      transcript:
        "오늘 회의에서는 새로운 프로젝트 기획안에 대해 논의했습니다. 마케팅 팀에서 제안한 전략이 매우 흥미로웠고...",
      summary1: "주요 안건 논의 및 결정사항",
      summary2: "다음 주까지 완료해야 할 업무들",
      summary3: "예산 관련 검토 필요",
      userId: 1,
      fileId: 1,
      createdAt: "2025-01-15T10:30:00Z",
    },
    {
      originalFileName: "프레젠테이션_발표자료.pptx",
      transcript:
        "안녕하세요. 오늘 발표할 내용은 우리 회사의 새로운 비전에 관한 것입니다...",
      summary1: "회사 비전 및 목표 설정",
      summary2: "향후 3개년 계획 수립",
      summary3: "조직 구조 개편 방안",
      userId: 1,
      fileId: 2,
      createdAt: "2025-01-14T14:20:00Z",
    },
    {
      originalFileName: "고객인터뷰_분석보고서.docx",
      transcript:
        "고객 만족도 조사 결과, 전반적으로 긍정적인 반응을 보였습니다. 특히 서비스 품질에 대한...",
      summary1: "고객 만족도 조사 결과 분석",
      summary2: "서비스 개선 포인트 도출",
      summary3: "향후 고객 관리 전략",
      userId: 1,
      fileId: 3,
      createdAt: "2025-01-13T16:45:00Z",
    },
  ];

  // 컴포넌트 마운트 시 Mock 데이터 로드
  useEffect(() => {
    setFiles(mockFiles);
  }, []);

  // 검색 실행 함수
  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setFiles(mockFiles);
      return;
    }

    const filtered = mockFiles.filter(
      (file) =>
        file.originalFileName
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        file.transcript?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        file.summary1?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        file.summary2?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        file.summary3?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFiles(filtered);
  };

  // Enter 키 검색
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // 검색어 초기화
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    // 검색어가 비어있으면 전체 목록 표시
    if (!value.trim()) {
      setFiles(mockFiles);
    }
  };

  // 액션 메뉴 토글
  const toggleActionMenu = (fileId, e) => {
    e.stopPropagation();
    setShowActionMenu((prev) => ({
      ...prev,
      [fileId]: !prev[fileId],
    }));
  };

  // 액션 메뉴 외부 클릭 시 닫기
  const handleOutsideClick = () => {
    setShowActionMenu({});
  };

  // 텍스트 복사
  const copyToClipboard = async (file) => {
    const textToCopy = `파일명: ${file.originalFileName}\n\n원본 텍스트:\n${file.transcript}\n\n요약 1: ${file.summary1}\n요약 2: ${file.summary2}\n요약 3: ${file.summary3}`;

    try {
      await navigator.clipboard.writeText(textToCopy);
      alert("클립보드에 복사되었습니다!");
    } catch (err) {
      console.error("복사 실패:", err);
      alert("복사에 실패했습니다.");
    }
    setShowActionMenu({});
  };

  // 파일 내보내기
  const exportToFile = (file) => {
    const textToExport = `파일명: ${
      file.originalFileName
    }\n생성일: ${formatDate(file.createdAt)}\n\n원본 텍스트:\n${
      file.transcript
    }\n\n요약 1: ${file.summary1}\n\n요약 2: ${file.summary2}\n\n요약 3: ${
      file.summary3
    }`;

    const blob = new Blob([textToExport], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${file.originalFileName.replace(
      /\.[^/.]+$/,
      ""
    )}_요약.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setShowActionMenu({});
  };

  // 새 파일 업로드
  const handleNewUpload = () => {
    // 파일 업로드 페이지로 이동하는 로직
    console.log("새 파일 업로드");
    alert("새 파일 업로드 페이지로 이동합니다!");
    setShowActionMenu({});
  };

  // 액션 버튼 데이터 배열
  const actionButtons = [
    {
      id: "copy",
      text: "텍스트 복사",
      title: "원본 텍스트와 선택된 요약을 클립보드에 복사합니다",
      onClick: copyToClipboard,
      style: {
        backgroundColor: "#ecead5",
        color: "#333",
        border: "none",
      },
    },
    {
      id: "export",
      text: "txt 파일로 내보내기",
      title: "원본 텍스트와 선택된 요약을 텍스트 파일로 다운로드합니다",
      onClick: exportToFile,
      style: {
        backgroundColor: "#ecead5",
        color: "#333",
        border: "none",
      },
    },
    {
      id: "newUpload",
      text: "📁 새 파일 업로드",
      title: "새로운 파일을 업로드합니다",
      onClick: handleNewUpload,
      style: {
        backgroundColor: "#00492C",
        color: "white",
        border: "none",
      },
    },
  ];

  // 날짜 포맷 함수
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}.${month}.${day}`;
  };

  // 파일 클릭 핸들러
  const handleFileClick = (file) => {
    console.log("선택된 파일:", file);
    // 파일 상세 보기 로직
  };

  const archiveTitleStyle = {
    fontFamily: "Cormorant Garamond, serif",
    fontSize: "26px",
    fontWeight: "bold",
    marginBottom: "30px",
    paddingTop: "3%",
    paddingLeft: "7%",
  };

  const searchBoxStyle = {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: "20px",
    paddingRight: "7%",
    position: "relative",
  };

  const searchInputStyle = {
    width: "220px",
    height: "30px",
    borderRadius: "20px",
    border: "1px solid #999",
    padding: "0 35px 0 10px",
    backgroundColor: "white",
    fontSize: "14px",
  };

  const searchImageStyle = {
    position: "absolute",
    right: "calc(7% + 10px)",
    width: "20px",
    height: "20px",
    cursor: "pointer",
    opacity: 0.7,
    transition: "opacity 0.2s ease",
  };

  const fileListStyle = {
    fontFamily: "Noto Sans KR, sans-serif",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    paddingLeft: "7%",
    paddingRight: "7%",
    paddingBottom: "20px",
  };

  const fileItemStyle = {
    backgroundColor: "#e8e4cf",
    borderRadius: "10px",
    padding: "12px 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    cursor: "pointer",
    transition: "background-color 0.2s ease",
    position: "relative",
  };

  const fileItemSpanStyle = {
    fontSize: "13px",
    color: "#444",
  };

  const dotsStyle = {
    fontWeight: "bold",
    fontSize: "16px",
    cursor: "pointer",
    padding: "5px 10px",
    borderRadius: "50%",
    transition: "background-color 0.2s ease",
  };

  const actionMenuStyle = {
    position: "absolute",
    right: "0",
    top: "100%",
    backgroundColor: "white",
    border: "1px solid #ccc",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
    zIndex: 1000,
    minWidth: "180px",
    overflow: "hidden",
  };

  const actionButtonStyle = {
    width: "100%",
    padding: "12px 16px",
    border: "none",
    backgroundColor: "white",
    textAlign: "left",
    cursor: "pointer",
    fontSize: "14px",
    transition: "background-color 0.2s ease",
  };

  const noFilesStyle = {
    textAlign: "center",
    padding: "50px",
    fontSize: "16px",
    color: "#666",
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
      onClick={handleOutsideClick}
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
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        <h1 style={archiveTitleStyle}>누군가의 보관함</h1>

        {/* 검색 박스 */}
        <div style={searchBoxStyle}>
          <input
            type="text"
            placeholder="파일 검색..."
            value={searchTerm}
            onChange={handleSearchChange}
            onKeyPress={handleKeyPress}
            style={searchInputStyle}
          />
          <img
            src={Search}
            alt="search"
            style={searchImageStyle}
            onClick={handleSearch}
            onMouseEnter={(e) => {
              e.target.style.opacity = "1";
            }}
            onMouseLeave={(e) => {
              e.target.style.opacity = "0.7";
            }}
          />
        </div>

        {/* 파일 목록 */}
        <div style={fileListStyle}>
          {files.length === 0 ? (
            <div style={noFilesStyle}>
              {searchTerm ? "검색 결과가 없습니다." : "저장된 파일이 없습니다."}
            </div>
          ) : (
            files.map((file, idx) => (
              <div
                style={fileItemStyle}
                key={file.fileId || idx}
                onClick={() => handleFileClick(file)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#ddd8c1";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#e8e4cf";
                }}
              >
                <div style={{ flex: 1 }}>
                  <strong>{file.originalFileName || "이름 없음"}</strong>{" "}
                  <span style={fileItemSpanStyle}>
                    {formatDate(file.createdAt)}
                  </span>
                  {file.summary1 && (
                    <div style={{ ...fileItemSpanStyle, marginTop: "4px" }}>
                      {file.summary1.length > 50
                        ? `${file.summary1.substring(0, 50)}...`
                        : file.summary1}
                    </div>
                  )}
                </div>

                {/* 액션 버튼 컨테이너 */}
                <div style={{ position: "relative" }}>
                  <span
                    style={dotsStyle}
                    onClick={(e) => toggleActionMenu(file.fileId || idx, e)}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = "#ddd8c1";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = "transparent";
                    }}
                  >
                    ⋮
                  </span>

                  {/* 액션 메뉴 */}
                  {showActionMenu[file.fileId || idx] && (
                    <div style={actionMenuStyle}>
                      {actionButtons.map((button) => (
                        <button
                          key={button.id}
                          style={{
                            ...actionButtonStyle,
                            ...button.style,
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            button.onClick(file);
                          }}
                          onMouseEnter={(e) => {
                            if (button.id === "newUpload") {
                              e.target.style.backgroundColor = "#005a35";
                            } else {
                              e.target.style.backgroundColor = "#f0f0f0";
                            }
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor =
                              button.style.backgroundColor;
                          }}
                          title={button.title}
                        >
                          {button.text}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Archive;
