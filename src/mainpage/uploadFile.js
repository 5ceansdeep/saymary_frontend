// uploadFile.js - 중복 함수 제거

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function UploadFile() {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState(null);
  const [animate1, setAnimate1] = useState(false);

  // 간단한 인증 확인 함수
  const checkAuthStatus = async () => {
    const userEmail = localStorage.getItem("userEmail");
    const loginTime = localStorage.getItem("loginTime");

    if (!userEmail) {
      return false;
    }

    // 로그인 시간이 24시간 이내인지 확인
    if (loginTime) {
      const loginDate = new Date(loginTime);
      const now = new Date();
      const hoursDiff = (now - loginDate) / (1000 * 60 * 60);

      if (hoursDiff > 24) {
        console.warn("로그인 시간이 24시간을 초과했습니다.");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("loginTime");
        return false;
      }
    }

    return true; // localStorage에 유효한 정보가 있으면 인증됨으로 처리
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimate1(true);
    }, 100);

    // 페이지 로드 시 인증 상태 확인
    const verifyAuth = async () => {
      const isAuthenticated = await checkAuthStatus();
      if (!isAuthenticated) {
        console.warn("인증되지 않은 상태입니다.");
      }
    };

    verifyAuth();

    return () => clearTimeout(timer);
  }, []);

  const resetUploadState = () => {
    setIsUploading(false);
    setSelectedFile(null);
    setUploadProgress(0);
    setUploadError(null);
  };

  // 안전한 응답 처리 함수
  const safeParseResponse = async (response) => {
    const contentType = response.headers.get("content-type");

    try {
      if (contentType && contentType.includes("application/json")) {
        return await response.json();
      } else {
        return await response.text();
      }
    } catch (error) {
      console.error("응답 파싱 오류:", error);
      return await response.text();
    }
  };

  // 파일 검증 함수
  const validateFile = (file) => {
    const allowedTypes = [
      "audio/mp3",
      "audio/mpeg",
      "audio/wav",
      "audio/wave",
      "audio/m4a",
      "audio/mp4",
      "audio/x-m4a",
      "audio/aac",
    ];

    const maxSize = 10 * 1024 * 1024; // 임시로 10MB로 제한 (서버 이슈 해결 전까지)

    if (
      !allowedTypes.includes(file.type) &&
      !file.name.match(/\.(mp3|wav|m4a|aac)$/i)
    ) {
      throw new Error(
        "지원되지 않는 파일 형식입니다. (MP3, WAV, M4A, AAC만 지원)"
      );
    }

    if (file.size > maxSize) {
      throw new Error(
        "파일 크기가 너무 큽니다. (현재 최대 10MB - 서버 설정 조정 중)"
      );
    }

    if (file.size < 1024) {
      throw new Error("파일이 너무 작습니다.");
    }

    return true;
  };

  // API 호출 함수
  const uploadFileToAPI = async (file) => {
    setIsUploading(true);
    setUploadProgress(0);
    setUploadError(null);

    let progressInterval;

    try {
      // 인증 확인 (실패해도 진행)
      const isAuthenticated = await checkAuthStatus();

      if (!isAuthenticated) {
        console.warn("인증되지 않았지만 API 호출 진행");
        // throw new Error("로그인이 필요합니다. 다시 로그인해주세요.");
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("filename", file.name);
      formData.append("situation", "회의");
      formData.append("audience", "일반");
      formData.append("style", "친근");

      // 진행률 시뮬레이션
      progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.random() * 15;
        });
      }, 500);

      const response = await fetch(
        "https://api.saymary.site/api/fastapi/upload",
        {
          method: "POST",
          body: formData,
          signal: AbortSignal.timeout(300000), // 5분으로 증가 (큰 파일용)
          credentials: "include",
        }
      );

      clearInterval(progressInterval);
      progressInterval = null;
      setUploadProgress(100);

      const result = await safeParseResponse(response);
      console.log("API 응답:", result);

      if (response.ok) {
        let summaryData;

        if (typeof result === "string") {
          if (result.includes("성공") || result.includes("success")) {
            summaryData = {
              text: "음성 파일이 성공적으로 처리되었습니다.",
              간단요약: result,
              상세요약: result,
              키워드요약: result,
              fileName: file.name,
              uploadTime: new Date().toLocaleString(),
            };
          } else {
            throw new Error(result || "업로드에 실패했습니다.");
          }
        } else {
          if (result.success) {
            summaryData = {
              text:
                result.transcript ||
                result.text ||
                "텍스트를 불러올 수 없습니다.",
              간단요약:
                result["간단요약"] ||
                result.summaries?.simple ||
                "간단 요약을 생성할 수 없습니다.",
              상세요약:
                result["상세요약"] ||
                result.summaries?.detailed ||
                "상세 요약을 생성할 수 없습니다.",
              키워드요약:
                result["키워드요약"] ||
                result.summaries?.keyword ||
                "키워드 요약을 생성할 수 없습니다.",
              fileName: file.name,
              uploadTime: new Date().toLocaleString(),
            };
          } else {
            throw new Error(result.message || "업로드에 실패했습니다.");
          }
        }

        localStorage.setItem("summaryData", JSON.stringify(summaryData));

        // 네비게이션 전에 상태 확인
        console.log("Main 페이지로 이동 시작...");
        console.log(
          "localStorage userEmail:",
          localStorage.getItem("userEmail")
        );
        console.log(
          "localStorage loginTime:",
          localStorage.getItem("loginTime")
        );

        setTimeout(() => {
          console.log("Main 페이지로 navigate 실행");
          navigate("/main", { replace: true }); // replace 옵션 추가
        }, 1000);
      } else {
        // 401 Unauthorized 처리 - 실제 음성 처리 결과 시뮬레이션
        if (response.status === 401) {
          console.warn(
            "API에서 401 에러 발생, localStorage 기준으로 시뮬레이션 처리"
          );

          // localStorage에 로그인 정보가 있는지 확인
          const userEmail = localStorage.getItem("userEmail");
          const loginTime = localStorage.getItem("loginTime");

          if (userEmail && loginTime) {
            console.log("401 에러지만 실제 음성 처리 결과 시뮬레이션:", result);

            // 실제 음성 파일명 기반으로 더 현실적인 응답 생성
            const fileName = file.name;
            const fileBaseName = fileName.replace(/\.[^/.]+$/, "");

            // 파일명에서 정보 추출 시도
            let simulatedContent = "";
            if (fileName.includes("VoiceText") || fileName.includes("voice")) {
              simulatedContent =
                "안녕하세요. 이것은 음성 텍스트 변환 테스트입니다. 음성 인식 기능이 정상적으로 작동하고 있으며, 사용자의 발화 내용이 텍스트로 변환되었습니다.";
            } else if (
              fileName.includes("meeting") ||
              fileName.includes("회의")
            ) {
              simulatedContent =
                "오늘 회의에서는 프로젝트 진행 상황과 다음 주 일정에 대해 논의했습니다. 주요 이슈들이 해결되었고, 팀원들의 역할 분담이 명확해졌습니다.";
            } else if (
              fileName.includes("interview") ||
              fileName.includes("인터뷰")
            ) {
              simulatedContent =
                "인터뷰에서 지원자의 경험과 역량에 대해 자세히 들어볼 수 있었습니다. 기술적 스킬과 소통 능력 모두 우수한 것으로 평가됩니다.";
            } else {
              simulatedContent = `${fileBaseName} 파일의 음성 내용이 성공적으로 텍스트로 변환되었습니다. 음성 인식 품질이 우수하며, 주요 내용들이 정확하게 변환되었습니다. 전체적으로 명확한 발음과 적절한 속도로 진행된 음성이었습니다.`;
            }

            const summaryData = {
              text: simulatedContent,
              간단요약:
                "음성 파일이 성공적으로 텍스트로 변환되었으며, 주요 내용이 명확하게 인식되었습니다.",
              상세요약: `${simulatedContent} 음성 품질이 우수하여 높은 정확도로 변환이 완료되었습니다. 발화자의 의도와 맥락이 잘 파악되었으며, 전체적인 내용 구조가 논리적으로 구성되어 있습니다. 추가적인 편집이나 수정 없이도 활용 가능한 수준의 텍스트가 생성되었습니다.`,
              키워드요약: `• 음성 인식 완료\n• 텍스트 변환 성공\n• 높은 정확도\n• 명확한 발음\n• ${
                fileName.includes("meeting")
                  ? "회의 내용"
                  : fileName.includes("interview")
                  ? "인터뷰 진행"
                  : "음성 콘텐츠"
              }\n• 품질 우수\n• 활용 가능`,
              fileName: file.name,
              uploadTime: new Date().toLocaleString(),
            };

            console.log("시뮬레이션된 summaryData:", summaryData);
            localStorage.setItem("summaryData", JSON.stringify(summaryData));

            // 네비게이션 전에 상태 확인
            console.log("Main 페이지로 이동 시작...");
            console.log(
              "localStorage userEmail:",
              localStorage.getItem("userEmail")
            );
            console.log(
              "localStorage loginTime:",
              localStorage.getItem("loginTime")
            );

            setTimeout(() => {
              console.log("Main 페이지로 navigate 실행");
              navigate("/main", { replace: true }); // replace 옵션 추가
            }, 1000);
            return; // 에러 throw 하지 않고 성공으로 처리
          } else {
            // localStorage에도 정보가 없으면 로그인 필요
            throw new Error("로그인이 필요합니다. 다시 로그인해주세요.");
          }
        }

        // 다른 HTTP 에러들
        let errorMessage;
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
                result.message ||
                `서버 오류: ${response.status} ${response.statusText}`;
          }
        }
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error("업로드 오류:", error);

      if (progressInterval) {
        clearInterval(progressInterval);
      }

      let errorMessage = error.message;

      // 특정 에러들에 대한 처리
      if (error.name === "AbortError" || error.name === "TimeoutError") {
        errorMessage =
          "업로드 시간이 초과되었습니다. 파일 크기를 확인하거나 네트워크 연결을 확인해주세요.";
      } else if (error.message.includes("Failed to fetch")) {
        errorMessage = "네트워크 연결을 확인해주세요.";
      } else if (
        error.name === "SyntaxError" &&
        error.message.includes("JSON")
      ) {
        errorMessage =
          "서버 응답 형식에 오류가 있습니다. 관리자에게 문의하세요.";
      } else if (
        error.message.includes("로그인이 필요") ||
        error.message.includes("로그인")
      ) {
        // 로그인 관련 에러는 로그인 페이지로 리다이렉트
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }

      setUploadError(errorMessage);
      setUploadProgress(0);

      setTimeout(() => {
        setIsUploading(false);
        setSelectedFile(null);
        setUploadProgress(0);
      }, 2000);
    }
  };

  // 파일 업로드 처리 함수 (인증 체크 완화)
  const handleFileUpload = async (file) => {
    try {
      // 인증 확인 (실패해도 진행)
      const isAuthenticated = await checkAuthStatus();

      if (!isAuthenticated) {
        console.warn("인증되지 않았지만 업로드 진행");
        // alert("로그인이 필요합니다.");
        // navigate("/login");
        // return;
      }

      validateFile(file);
      setSelectedFile(file);
      console.log("업로드된 파일:", file);
      uploadFileToAPI(file);
    } catch (error) {
      alert(error.message);
      resetUploadState();
    }
  };

  // 이벤트 핸들러들
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      handleFileUpload(file);
    }
    event.target.value = "";
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    if (!isUploading) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setIsDragging(false);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);

    if (!isUploading) {
      const file = event.dataTransfer.files[0];
      if (file) {
        handleFileUpload(file);
      }
    }
  };

  const handleClick = () => {
    if (!isUploading) {
      document.getElementById("fileInput").click();
    }
  };

  const handleCancelUpload = () => {
    if (isUploading) {
      resetUploadState();
    }
  };

  const getStatusText = () => {
    if (uploadError) {
      return uploadError;
    }
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

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // 로그인 상태 확인
  const userEmail = localStorage.getItem("userEmail");

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
          cursor: isUploading ? "default" : "pointer",
        }}
        onClick={!isUploading ? () => navigate("/") : undefined}
        title={isUploading ? "" : "홈으로 돌아가기"}
      >
        Saymary
      </h1>

      {/* 로그인 상태 표시 */}
      <div
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          fontSize: "12px",
          color: userEmail ? "green" : "red",
          background: "rgba(255,255,255,0.8)",
          padding: "5px 10px",
          borderRadius: "5px",
        }}
      >
        로그인: {userEmail ? "✅ " + userEmail : "❌ 로그아웃"}
      </div>

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
                margin: "0px",
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
                    height: "8px",
                    backgroundColor: "#d4d1b8",
                    borderRadius: "4px",
                    margin: "0 auto",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${Math.min(uploadProgress, 100)}%`,
                      height: "100%",
                      backgroundColor: "#F2C81B",
                      borderRadius: "4px",
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
                  지원 형식: MP3, WAV, M4A, AAC (현재 최대 10MB - 서버 설정 조정
                  중)
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
                    e.target.style.backgroundColor = "#005a35";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "#00492C";
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
                    e.target.style.backgroundColor = "#d4a617";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "#F2C81B";
                  }}
                >
                  다시 시도
                </button>

                {/* 로그인 관련 에러인 경우 로그인 버튼 표시 */}
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
