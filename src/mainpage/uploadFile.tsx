// src/mainpage/uploadFile.tsx
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

type Summaries = {
  simple?: string;
  detailed?: string;
  keyword?: string;
  [k: string]: string | undefined; // ← 임의 키 허용
};

type ApiJson =
  | {
      success?: boolean;
      original_text?: string;
      transcript?: string;
      text?: string;
      summaries?: Summaries; // 교체
      ["간단요약"]?: string;
      ["상세요약"]?: string;
      ["키워드요약"]?: string;
      // 새로운 응답 형식 필드들
      fileId?: string | null;
      originalFileName?: string | null;
      summary1?: string;
      summary2?: string;
      summary3?: string;
      userId?: string | null;
      message?: string;
    }
  | string;

type SummaryData = {
  text: string;
  간단요약: string;
  상세요약: string;
  키워드요약: string;
  fileName: string;
  uploadTime: string;
};

function UploadFile() {
  const navigate = useNavigate();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [animate1, setAnimate1] = useState(false);

  const progressIntervalRef = useRef<number | null>(null);

  // 세션 기반 인증 확인
  // const checkAuthStatus = useCallback(async (): Promise<boolean> => {
  //   try {
  //     const response = await fetch("https://api.saymary.site/api/user/me", {
  //       method: "GET",
  //       credentials: "include",
  //     });

  //     return response.status === 200;
  //   } catch {
  //     return false;
  //   }
  // }, []);

  // 마운트 애니메이션 + 인증 체크
  useEffect(() => {
    const t = window.setTimeout(() => setAnimate1(true), 100);

    (async () => {
      // const ok = await checkAuthStatus();
      // if (!ok) {
      //   navigate("/login");
      //   return;
      // }
    })();
  }, []);

  const resetUploadState = useCallback(() => {
    setIsUploading(false);
    setSelectedFile(null);
    setUploadProgress(0);
    setUploadError(null);
  }, []);

  // JSON/Text 안전 파싱
  const safeParseResponse = useCallback(
    async (response: Response): Promise<ApiJson> => {
      const contentType = response.headers.get("content-type") || "";
      try {
        if (contentType.includes("application/json")) {
          return (await response.json()) as ApiJson;
        }
        return (await response.text()) as string;
      } catch (err) {
        console.error("응답 파싱 오류:", err);
        return (await response.text()) as string;
      }
    },
    []
  );

  // 파일 검증
  const validateFile = useCallback((file: File): true => {
    const allowedTypes = new Set([
      "audio/mp3",
      "audio/mpeg",
      "audio/wav",
      "audio/wave",
      "audio/m4a",
      "audio/mp4",
      "audio/x-m4a",
      "audio/aac",
    ]);
    const maxSize = 50 * 1024 * 1024; // 50MB

    if (
      !allowedTypes.has(file.type) &&
      !/\.(mp3|wav|m4a|aac)$/i.test(file.name)
    ) {
      throw new Error(
        "지원되지 않는 파일 형식입니다. (MP3, WAV, M4A, AAC만 지원)"
      );
    }
    if (file.size > maxSize)
      throw new Error("파일 크기가 너무 큽니다. (현재 최대 50MB)");
    if (file.size < 1024) throw new Error("파일이 너무 작습니다.");

    return true;
  }, []);

  // AbortSignal.timeout 호환 핸들러 (폴백)
  const fetchWithTimeout = useCallback(
    async (
      input: RequestInfo | URL,
      init: RequestInit & { timeoutMs?: number } = {}
    ) => {
      const { timeoutMs = 300_000, signal, ...rest } = init; // 기본 5분
      if ((AbortSignal as any).timeout) {
        // 최신 브라우저
        return fetch(input, {
          signal: (AbortSignal as any).timeout(timeoutMs),
          ...rest,
        });
      }
      // 폴백: AbortController 사용
      const controller = new AbortController();
      const id = window.setTimeout(() => controller.abort(), timeoutMs);
      try {
        return await fetch(input, {
          signal: signal ?? controller.signal,
          ...rest,
        });
      } finally {
        window.clearTimeout(id);
      }
    },
    []
  );

  // API 업로드
  const uploadFileToAPI = useCallback(
    async (file: File) => {
      setIsUploading(true);
      setUploadProgress(0);
      setUploadError(null);

      // 진행률 시뮬
      progressIntervalRef.current = window.setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            if (progressIntervalRef.current) {
              window.clearInterval(progressIntervalRef.current);
              progressIntervalRef.current = null;
            }
            return 90;
          }
          return Math.min(prev + Math.random() * 15, 90);
        });
      }, 500);

      try {
        // const isAuthenticated = await checkAuthStatus();
        // if (!isAuthenticated) {
        //   throw new Error("로그인이 필요합니다. 다시 로그인해주세요.");
        // }

        const formData = new FormData();
        formData.append("file", file);

        // const response = await fetchWithTimeout(
        //   "https://api.saymary.site/api/fastapi/upload_stt_summary",
        //   {
        //     method: "POST",
        //     body: formData,
        //     credentials: "include",
        //     timeoutMs: 300_000,
        //   }
        // );

        const response = await fetchWithTimeout(
          "https://api.saymary.site/api/spring/upload",
          {
            method: "POST",
            body: formData,
            credentials: "include",
            timeoutMs: 300_000,
          }
        );

        console.log("=== API 응답 상태 ===");
        console.log("Status:", response.status);
        console.log("Status Text:", response.statusText);
        console.log("Headers:", Object.fromEntries(response.headers.entries()));

        if (progressIntervalRef.current) {
          window.clearInterval(progressIntervalRef.current);
          progressIntervalRef.current = null;
        }
        setUploadProgress(100);

        const result = await safeParseResponse(response);
        console.log("=== API 응답 데이터 ===");
        console.log("Raw Result:", result);
        console.log("Result Type:", typeof result);
        console.log("Is String:", typeof result === "string");
        console.log("Is Object:", typeof result === "object");

        const buildSummary = (data: ApiJson): SummaryData => {
          if (typeof data === "string") {
            if (data.includes("성공") || data.includes("success")) {
              return {
                text: "음성 파일이 성공적으로 처리되었습니다.",
                간단요약: data,
                상세요약: data,
                키워드요약: data,
                fileName: file.name,
                uploadTime: new Date().toLocaleString(),
              };
            }
            throw new Error(data || "업로드에 실패했습니다.");
          }

          // success 플래그가 없어도 필드가 있으면 성공으로 간주
          const text = data.original_text ?? data.transcript ?? data.text ?? "";

          const simple =
            data["간단요약"] ??
            data.summaries?.simple ??
            data.summaries?.["간단요약"] ??
            data.summary1 ??
            "";
          const detailed =
            data["상세요약"] ??
            data.summaries?.detailed ??
            data.summaries?.["상세요약"] ??
            data.summary2 ??
            "";
          const keyword =
            data["키워드요약"] ??
            data.summaries?.keyword ??
            data.summaries?.["키워드요약"] ??
            data.summary3 ??
            "";

          // 최소 요건 충족 시 성공 처리
          if (text || (simple && detailed && keyword)) {
            return {
              text: text || "텍스트를 불러올 수 없습니다.",
              간단요약: simple || "간단 요약을 생성할 수 없습니다.",
              상세요약: detailed || "상세 요약을 생성할 수 없습니다.",
              키워드요약: keyword || "키워드 요약을 생성할 수 없습니다.",
              fileName: file.name,
              uploadTime: new Date().toLocaleString(),
            };
          }

          // 정말 실패인 경우만 에러
          throw new Error(data.message || "업로드에 실패했습니다.");
        };

        // ✅ 200이면 여기서 바로 성공 처리하고 return
        if (response.ok) {
          const summaryData = buildSummary(result); // ← 실제 호출
          localStorage.setItem("summaryData", JSON.stringify(summaryData));
          setTimeout(() => navigate("/main", { replace: true }), 800);
          return; // ← 이게 없어서 아래 에러 처리로 떨어졌던 거
        }

        // 401 인증 오류 처리
        if (response.status === 401) {
          throw new Error("로그인이 필요합니다. 다시 로그인해주세요.");
        }

        // 기타 에러 해석
        let errorMessage: string;
        if (typeof result === "string") {
          errorMessage = result;
        } else {
          switch (response.status) {
            case 403:
              errorMessage = "접근 권한이 없습니다.";
              break;
            case 413:
              errorMessage = `서버에서 파일 크기 제한을 초과했습니다. 현재 파일: ${formatFileSize(
                file.size
              )}. 더 작은 파일을 시도해보거나 관리자에게 문의하세요.`;
              break;
            case 415:
              errorMessage = "지원되지 않는 파일 형식입니다.";
              break;
            case 500:
              errorMessage =
                "서버 내부 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
              break;
            case 503:
              errorMessage = "서버가 일시적으로 사용할 수 없습니다.";
              break;
            default:
              errorMessage =
                result.message ??
                `서버 오류: ${response.status} ${response.statusText}`;
          }
        }
        throw new Error(errorMessage);
      } catch (err) {
        const e = err as Error;
        console.error("업로드 오류:", e);

        if (progressIntervalRef.current) {
          window.clearInterval(progressIntervalRef.current);
          progressIntervalRef.current = null;
        }

        let msg = e.message || "업로드 중 오류가 발생했습니다.";
        if (e.name === "AbortError") {
          msg =
            "업로드 시간이 초과되었습니다. 파일 크기 또는 네트워크를 확인해주세요.";
        } else if (msg.includes("Failed to fetch")) {
          msg = "네트워크 연결을 확인해주세요.";
        } else if (e.name === "SyntaxError" && msg.includes("JSON")) {
          msg = "서버 응답 형식에 오류가 있습니다. 관리자에게 문의하세요.";
        }

        setUploadError(msg);
        setUploadProgress(0);

        if (msg.includes("로그인")) {
          setTimeout(() => navigate("/login"), 2000);
        }

        setTimeout(() => {
          setIsUploading(false);
          setSelectedFile(null);
          setUploadProgress(0);
        }, 2000);
      }
    },
    [
      // checkAuthStatus,
      fetchWithTimeout,
      navigate,
      safeParseResponse,
      validateFile,
    ]
  );

  // 파일 업로드 트리거
  const handleFileUpload = useCallback(
    async (file: File) => {
      try {
        // const ok = await checkAuthStatus();
        // if (!ok) {
        //   alert("로그인이 필요합니다. 로그인 페이지로 이동합니다.");
        //   navigate("/login");
        //   return;
        // }

        validateFile(file);
        setSelectedFile(file);
        console.log("업로드된 파일:", file);
        uploadFileToAPI(file);
      } catch (err) {
        const e = err as Error;
        alert(e.message);
        resetUploadState();
      }
    },
    [navigate, resetUploadState, uploadFileToAPI, validateFile]
  );

  // 이벤트 핸들러
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) handleFileUpload(file);
    event.target.value = ""; // 동일 파일 재선택 허용
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (!isUploading) setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    // 드롭존 밖으로 나갈 때만
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      setIsDragging(false);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    if (isUploading) return;
    const file = event.dataTransfer.files?.[0];
    if (file) handleFileUpload(file);
  };

  const handleClick = () => {
    if (isUploading) return;
    const input = document.getElementById(
      "fileInput"
    ) as HTMLInputElement | null;
    input?.click();
  };

  const handleCancelUpload = () => {
    if (isUploading) resetUploadState();
  };

  const getStatusText = () => {
    if (uploadError) return uploadError;
    if (isUploading) {
      if (uploadProgress < 20) return "파일 업로드 중...";
      if (uploadProgress < 50) return "음성 인식 중...";
      if (uploadProgress < 80) return "요약 생성 중...";
      if (uploadProgress < 100) return "완료 처리 중...";
      return "업로드 완료! 페이지 이동 중...";
    }
    if (selectedFile && !isUploading)
      return `선택된 파일: ${selectedFile.name}`;
    return "음성파일을 업로드 해주세요...";
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"] as const;
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  // userEmail은 더 이상 로컬에서 가져오지 않음 (세션 기반으로 변경됨)

  // interval 누수 방지
  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        window.clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  return (
    <div
      style={{
        position: "relative",
        backgroundColor: "#00492C",
        height: "100vh",
        display: "flex",
        padding: 0,
        margin: 0,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h1
        style={{
          color: "#F2C81B",
          fontFamily: "Cormorant Garamond, serif",
          fontWeight: 600,
          fontSize: "60px",
          position: "absolute",
          padding: 0,
          margin: 0,
          top: "7%",
          left: "13%",
          opacity: 1,
          cursor: isUploading ? "default" : "pointer",
        }}
        onClick={!isUploading ? () => navigate("/") : undefined}
        title={isUploading ? "" : "홈으로 돌아가기"}
      >
        Saymary
      </h1>

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
          opacity: animate1 ? 1 : 0,
          transition: "all 0.3s ease-in-out",
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        <div
          style={{
            color: "#656247",
            backgroundColor: isDragging
              ? "#ddd8be"
              : uploadError
              ? "#f5e6e6"
              : isUploading
              ? "#f0edd8"
              : "#ECEAD5",
            fontFamily: "Noto Sans KR, sans-serif",
            fontWeight: 600,
            fontSize: "1.5rem",
            position: "relative",
            top: "50%",
            transform: "translateY(-50%)",
            marginLeft: "15%",
            marginRight: "15%",
            paddingTop: "60px",
            paddingBottom: "60px",
            paddingLeft: "3%",
            paddingRight: "3%",
            borderRadius: "10px",
            border: isDragging
              ? "2px dashed #F2C81B"
              : uploadError
              ? "2px solid #e74c3c"
              : isUploading
              ? "2px solid #F2C81B"
              : "2px dashed transparent",
            transition: "all 0.3s ease-in-out",
            cursor: isUploading ? "default" : "pointer",
          }}
          onDragOver={!isUploading ? handleDragOver : undefined}
          onDragLeave={!isUploading ? handleDragLeave : undefined}
          onDrop={!isUploading ? handleDrop : undefined}
          onClick={!isUploading ? handleClick : undefined}
        >
          <div style={{ textAlign: "center" }}>
            <p
              style={{
                margin: 0,
                fontSize: isUploading ? "1.2rem" : "1.5rem",
                color: uploadError ? "#e74c3c" : "#656247",
                wordBreak: "break-word",
              }}
            >
              {getStatusText()}
            </p>

            {selectedFile && !isUploading && !uploadError && (
              <div
                style={{
                  margin: "15px 0",
                  fontSize: "0.9rem",
                  color: "#8a7d5c",
                }}
              >
                <p>크기: {formatFileSize(selectedFile.size)}</p>
                <p>형식: {selectedFile.type || "알 수 없음"}</p>
              </div>
            )}

            {isUploading && !uploadError && (
              <div style={{ margin: "20px 0" }}>
                <div
                  style={{
                    width: "80%",
                    height: 8,
                    backgroundColor: "#d4d1b8",
                    borderRadius: 4,
                    margin: "0 auto",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${Math.min(uploadProgress, 100)}%`,
                      height: "100%",
                      backgroundColor: "#F2C81B",
                      borderRadius: 4,
                      transition: "width 0.3s ease-in-out",
                    }}
                  />
                </div>
                <p
                  style={{
                    fontSize: "0.9rem",
                    margin: "10px 0 0 0",
                    color: "#8a7d5c",
                  }}
                >
                  {Math.round(uploadProgress)}%
                </p>

                <button
                  onClick={handleCancelUpload}
                  style={{
                    padding: "5px 15px",
                    borderRadius: "5px",
                    border: "none",
                    backgroundColor: "#e74c3c",
                    color: "#ffffff",
                    fontFamily: "Noto Sans KR, sans-serif",
                    fontWeight: 500,
                    fontSize: "0.6rem",
                    cursor: "pointer",
                    marginTop: "10px",
                    transition: "all 0.3s ease-in-out",
                  }}
                >
                  취소
                </button>
              </div>
            )}

            {!isUploading && !uploadError && (
              <>
                <p
                  style={{
                    fontFamily: "Noto Sans KR, sans-serif",
                    fontWeight: 600,
                    fontSize: "1rem",
                    margin: "10px 0",
                  }}
                >
                  {isDragging ? "파일을 여기에 놓으세요" : "Drag & Drop"}
                </p>
                <p
                  style={{
                    fontFamily: "Noto Sans KR, sans-serif",
                    fontWeight: 400,
                    fontSize: "0.8rem",
                    margin: "5px 0",
                    color: "#8a7d5c",
                  }}
                >
                  지원 형식: MP3, WAV, M4A, AAC (현재 최대 50MB)
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
                    transition: "all 0.3s ease-in-out",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClick();
                  }}
                  onMouseEnter={(e) => {
                    (
                      e.currentTarget as HTMLButtonElement
                    ).style.backgroundColor = "#005a35";
                  }}
                  onMouseLeave={(e) => {
                    (
                      e.currentTarget as HTMLButtonElement
                    ).style.backgroundColor = "#00492C";
                  }}
                >
                  Click to upload file
                </button>
              </>
            )}

            {uploadError && (
              <>
                <button
                  onClick={resetUploadState}
                  style={{
                    padding: "10px 30px",
                    borderRadius: "10px",
                    border: "none",
                    backgroundColor: "#F2C81B",
                    color: "#ffffff",
                    fontFamily: "Noto Sans KR, sans-serif",
                    fontWeight: 500,
                    fontSize: "0.7rem",
                    cursor: "pointer",
                    marginTop: "15px",
                    transition: "all 0.3s ease-in-out",
                  }}
                  onMouseEnter={(e) => {
                    (
                      e.currentTarget as HTMLButtonElement
                    ).style.backgroundColor = "#d4a617";
                  }}
                  onMouseLeave={(e) => {
                    (
                      e.currentTarget as HTMLButtonElement
                    ).style.backgroundColor = "#F2C81B";
                  }}
                >
                  다시 시도
                </button>

                {uploadError.includes("로그인") && (
                  <button
                    onClick={() => navigate("/login")}
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
                      marginTop: "10px",
                      marginLeft: "10px",
                      transition: "all 0.3s ease-in-out",
                    }}
                  >
                    로그인하러 가기
                  </button>
                )}
              </>
            )}
          </div>

          <input
            id="fileInput"
            type="file"
            accept="audio/*"
            style={{ display: "none" }}
            onChange={handleFileSelect}
            disabled={isUploading}
          />
        </div>
      </div>
    </div>
  );
}

export default UploadFile;
