import React from "react";
import { useState, useEffect, useCallback } from "react";
import Search from "../img/search.png";
import { useNavigate, useLocation, Navigate } from "react-router-dom";

// --- Types ---
interface FileItem {
  fileId?: string | number;
  originalFileName?: string;
  transcript?: string;
  summary1?: string;
  summary2?: string;
  summary3?: string;
  createdAt?: string | number | Date;
  summaryType?: string;
}

type ActionMenuState = Record<string | number, boolean>;

interface ActionButton {
  id: string;
  text: string;
  title: string;
  onClick: (file: FileItem) => void;
  style: React.CSSProperties;
}

const normalizeSummaryType = (raw?: string) => {
  const s = (raw ?? "").toLowerCase();
  if (s.includes("상세") || s.includes("detail")) return "상세요약";
  if (s.includes("키워드") || s.includes("keyword")) return "키워드요약";
  return "간단요약";
};

const pickSummaryByType = (file: FileItem) => {
  const label = normalizeSummaryType(file.summaryType);
  let text: string | undefined;

  if (label === "상세요약") text = file.summary2;
  else if (label === "키워드요약") text = file.summary3;
  else text = file.summary1; // 간단요약

  if (!text) text = file.summary1 || file.summary2 || file.summary3 || "";

  return { label, text };
};

function Archive() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const shouldRender = pathname === "/archive"; // ✅ 렌더 플래그

  const [files, setFiles] = useState<FileItem[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showActionMenu, setShowActionMenu] = useState<ActionMenuState>({});
  const [userEmail, setUserEmail] = useState<string>("사용자");

  // --- helpers ---
  const safeParse = useCallback(<T,>(raw: string | null, fallback: T): T => {
    if (!raw) return fallback;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  }, []);

  const getSaved = useCallback((): FileItem[] => {
    const raw = localStorage.getItem("archiveFiles");
    try {
      return raw ? (JSON.parse(raw) as FileItem[]) : [];
    } catch {
      return [];
    }
  }, []);

  // 파일 목록 불러오기
  useEffect(() => {
    if (!shouldRender) return;
    
    setFiles(getSaved());
  }, [shouldRender, getSaved]);

  // 검색 실행 함수
  const handleSearch = () => {
    const saved = getSaved();

    if (!searchTerm.trim()) {
      setFiles(saved);
      return;
    }

    const keyword = searchTerm.toLowerCase();
    const filtered = saved.filter((file: FileItem) => {
      const inName = file.originalFileName?.toLowerCase().includes(keyword);
      const inTranscript = file.transcript?.toLowerCase().includes(keyword);
      const inS1 = file.summary1?.toLowerCase().includes(keyword);
      const inS2 = file.summary2?.toLowerCase().includes(keyword);
      const inS3 = file.summary3?.toLowerCase().includes(keyword);
      return Boolean(inName || inTranscript || inS1 || inS2 || inS3);
    });

    setFiles(filtered);
  };

  //파일 클릭 시 Main 페이지로 이동
  const handleFileClick = (file: FileItem) => {
    const created = file.createdAt ? new Date(file.createdAt) : new Date();
    const { label, text } = pickSummaryByType(file);

    const newSummaryData = {
      fileName: file.originalFileName,
      uploadTime: created.toLocaleString(),
      text: file.transcript,
      간단요약: file.summary1,
      상세요약: file.summary2,
      키워드요약: file.summary3,
      summaryType: file.summaryType,
        selectedSummaryLabel: label,
      selectedSummaryText: text,
    } as const;

    localStorage.setItem("summaryData", JSON.stringify(newSummaryData));
    navigate("/main");
  };

  // Enter 키 검색 (onKeyPress는 deprecated → onKeyDown 사용)
  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // 검색어 변경
  const handleSearchChange: React.ChangeEventHandler<HTMLInputElement> = (
    e
  ) => {
    const value = e.target.value;
    setSearchTerm(value);

    // 검색어가 비어있으면 전체 목록 표시
    if (!value.trim()) {
      setFiles(getSaved());
    }
  };

  //파일 삭제 핸들러
  const deleteFile = (fileToDelete: FileItem) => {
    if (
      !window.confirm(
        `"${fileToDelete.originalFileName ?? "이름 없음"}" 파일을 삭제할까요?`
      )
    )
      return;

    const saved = getSaved();
    const updated = saved.filter((file) => file.fileId !== fileToDelete.fileId);

    localStorage.setItem("archiveFiles", JSON.stringify(updated));
    setFiles(updated);
    setShowActionMenu({});
  };

  // 액션 메뉴 토글
  const toggleActionMenu = (fileId: string | number, e: React.MouseEvent) => {
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
  const copyToClipboard = async (file: FileItem) => {
    const textToCopy = `파일명: ${
      file.originalFileName ?? ""
    }\n\n원본 텍스트:\n${file.transcript ?? ""}\n\n요약 1: ${
      file.summary1 ?? ""
    }\n요약 2: ${file.summary2 ?? ""}\n요약 3: ${file.summary3 ?? ""}`;

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
  const exportToFile = (file: FileItem) => {
    const textToExport = `파일명: ${
      file.originalFileName ?? ""
    }\n생성일: ${formatDate(file.createdAt)}\n\n원본 텍스트:\n${
      file.transcript ?? ""
    }\n\n요약 1: ${file.summary1 ?? ""}\n\n요약 2: ${
      file.summary2 ?? ""
    }\n\n요약 3: ${file.summary3 ?? ""}`;

    const blob = new Blob([textToExport], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${(file.originalFileName ?? "export").replace(
      /\.[^/.]+$/,
      ""
    )}__요약.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setShowActionMenu({});
  };

  // 새 파일 업로드 (라우팅 연결 전 임시)
  const handleNewUpload = (_file: FileItem) => {
    console.log("새 파일 업로드");
    alert("새 파일 업로드 페이지로 이동합니다.");
    setShowActionMenu({});
    navigate("/upload");
  };

  // 액션 버튼 데이터 배열
  const actionButtons: ActionButton[] = [
    {
      id: "copy",
      text: "텍스트 복사",
      title: "원본 텍스트와 선택된 요약을 클립보드에 복사합니다",
      onClick: copyToClipboard,
      style: {
        backgroundColor: "#f0f0f0",
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
        backgroundColor: "#f0f0f0",
        color: "#333",
        border: "none",
      },
    },
    //파일삭제 버튼
    {
      id: "delete",
      text: "삭제하기",
      title: "이 파일을 보관함에서 삭제합니다",
      onClick: deleteFile,
      style: {
        backgroundColor: "#f0f0f0",
        color: "#B22222",
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
  const formatDate = (dateInput: FileItem["createdAt"]) => {
    if (!dateInput) return "";
    const date = new Date(dateInput);
    if (Number.isNaN(date.getTime())) return "";
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}.${month}.${day}`;
  };

  // --- Styles ---
  const archiveTitleStyle: React.CSSProperties = {
    fontFamily: "Cormorant Garamond, serif",
    fontSize: "26px",
    fontWeight: "bold",
    marginBottom: "30px",
    paddingTop: "3%",
    paddingLeft: "7%",
  };

  const searchBoxStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: "20px",
    paddingRight: "7%",
    position: "relative",
  };

  const searchInputStyle: React.CSSProperties = {
    width: "220px",
    height: "30px",
    borderRadius: "20px",
    border: "1px solid #999",
    padding: "0 35px 0 10px",
    backgroundColor: "white",
    fontSize: "14px",
  };

  const searchImageStyle: React.CSSProperties = {
    position: "absolute",
    right: "calc(7% + 10px)",
    width: "20px",
    height: "20px",
    cursor: "pointer",
    opacity: 0.7,
    transition: "opacity 0.2s ease",
  };

  const fileListStyle: React.CSSProperties = {
    fontFamily: "Noto Sans KR, sans-serif",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    paddingLeft: "7%",
    paddingRight: "7%",
    paddingBottom: "20px",
  };

  const fileItemStyle: React.CSSProperties = {
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

  const fileItemSpanStyle: React.CSSProperties = {
    fontSize: "13px",
    color: "#444",
  };

  const dotsStyle: React.CSSProperties = {
    fontWeight: "bold",
    fontSize: "16px",
    cursor: "pointer",
    padding: "5px 10px",
    borderRadius: "50%",
    transition: "background-color 0.2s ease",
  };

  const actionMenuStyle: React.CSSProperties = {
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

  const actionButtonStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px 16px",
    border: "none",
    backgroundColor: "white",
    textAlign: "left",
    cursor: "pointer",
    fontSize: "14px",
    transition: "background-color 0.2s ease",
  };

  const noFilesStyle: React.CSSProperties = {
    textAlign: "center",
    padding: "50px",
    fontSize: "16px",
    color: "#666",
  };

  if (!shouldRender) return null;

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
        <h1 style={archiveTitleStyle}>
          {userEmail}의 보관함
        </h1>

        {/* 검색 박스 */}
        <div style={searchBoxStyle}>
          <input
            type="text"
            placeholder="파일 검색..."
            value={searchTerm}
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown}
            style={searchInputStyle}
          />
          <img
            src={Search}
            alt="search"
            style={searchImageStyle}
            onClick={handleSearch}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLImageElement).style.opacity = "1";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLImageElement).style.opacity = "0.7";
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
            files.map((file: FileItem, idx: number) => {
              const key = file.fileId ?? idx;
              return (
                <div
                  style={fileItemStyle}
                  key={key}
                  onClick={() => handleFileClick(file)}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.backgroundColor =
                      "#ddd8c1";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.backgroundColor =
                      "#e8e4cf";
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <strong>{file.originalFileName || "이름 없음"}</strong>{" "}
                    <span style={fileItemSpanStyle}>
                      {formatDate(file.createdAt)}
                    </span>
{(() => {
                      const { label, text } = pickSummaryByType(file);
                      if (!text) return null;
                      const preview = text.length > 50 ? `${text.substring(0, 50)}...` : text;
                      return (
                        <div style={{ ...fileItemSpanStyle, marginTop: "4px" }}>
                          <strong style={{ marginRight: "5px", color: "#333" }}>{label}:</strong>
                          {preview}
                        </div>
                      );
                    })()}
                  </div>

                  {/* 액션 버튼 컨테이너 */}
                  <div style={{ position: "relative" }}>
                    <span
                      style={dotsStyle}
                      onClick={(e) => toggleActionMenu(key, e)}
                      onMouseEnter={(e) => {
                        (
                          e.currentTarget as HTMLSpanElement
                        ).style.backgroundColor = "#ddd8c1";
                      }}
                      onMouseLeave={(e) => {
                        (
                          e.currentTarget as HTMLSpanElement
                        ).style.backgroundColor = "transparent";
                      }}
                    >
                      ⋮
                    </span>

                    {/* 액션 메뉴 */}
                    {showActionMenu[key] && (
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
                              const target =
                                e.currentTarget as HTMLButtonElement;
                              if (button.id === "newUpload") {
                                target.style.backgroundColor = "#005a35";
                              } else {
                                target.style.backgroundColor = "#e8e7e0ff";
                              }
                            }}
                            onMouseLeave={(e) => {
                              (
                                e.currentTarget as HTMLButtonElement
                              ).style.backgroundColor = button.style
                                .backgroundColor as string;
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
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default Archive;
