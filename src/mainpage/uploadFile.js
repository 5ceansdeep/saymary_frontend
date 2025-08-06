import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function UploadFile() {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState(null);

  // 상태 관리
  const [animate1, setAnimate1] = useState(false);

  // 0.1초 후 노란 박스 애니메이션 시작
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimate1(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // 상태 초기화 함수
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
      return await response.text(); // JSON 파싱 실패 시 텍스트로 fallback
    }
  };

  // API 호출 함수 - 개선된 버전
  const uploadFileToAPI = async (file) => {
    setIsUploading(true);
    setUploadProgress(0);
    setUploadError(null);

    let progressInterval;

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("situation", "회의"); // 기본값으로 설정
      formData.append("audience", "일반"); // 기본값으로 설정
      formData.append("style", "친근"); // 기본값으로 설정

      // 더 자연스러운 진행률 시뮬레이션
      progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.random() * 15; // 더 자연스러운 진행률
        });
      }, 500);

      // URL 수정
      const response = await fetch(
        "https://3.34.19.178:8080/api/fastapi/upload",
        {
          method: "POST",
          body: formData,
          // 타임아웃 설정 (30초)
          signal: AbortSignal.timeout(30000),
        }
      );

      clearInterval(progressInterval);
      progressInterval = null;
      setUploadProgress(100);

      // 안전한 응답 처리
      const result = await safeParseResponse(response);
      console.log("API 응답:", result);

      if (response.ok) {
        // 응답이 텍스트인지 객체인지 확인하여 처리
        let summaryData;

        if (typeof result === "string") {
          // 텍스트 응답인 경우 - 성공 여부 확인
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
          // JSON 객체인 경우
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

        // 성공 메시지 표시
        setTimeout(() => {
          navigate("/main");
        }, 1000);
      } else {
        // HTTP 상태 코드별 상세 에러 메시지
        let errorMessage;
        if (typeof result === "string") {
          errorMessage = result;
        } else {
          switch (response.status) {
            case 413:
              errorMessage = "파일 크기가 너무 큽니다. (최대 50MB)";
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

      // 진행률 인터벌 정리
      if (progressInterval) {
        clearInterval(progressInterval);
      }

      // 네트워크 에러나 타임아웃 처리
      let errorMessage = error.message;
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
      }

      // 에러 상태 설정
      setUploadError(errorMessage);

      // 진행률을 0으로 리셋
      setUploadProgress(0);

      // 사용자에게 알림 (선택사항)
      // alert(`업로드 실패: ${errorMessage}`);

      // 2초 후 부분적 상태 초기화 (에러는 유지하고 파일만 리셋)
      setTimeout(() => {
        setIsUploading(false);
        setSelectedFile(null);
        setUploadProgress(0);
      }, 2000);
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

    const maxSize = 50 * 1024 * 1024; // 50MB

    if (
      !allowedTypes.includes(file.type) &&
      !file.name.match(/\.(mp3|wav|m4a|aac)$/i)
    ) {
      throw new Error(
        "지원되지 않는 파일 형식입니다. (MP3, WAV, M4A, AAC만 지원)"
      );
    }

    if (file.size > maxSize) {
      throw new Error("파일 크기가 너무 큽니다. (최대 50MB)");
    }

    if (file.size < 1024) {
      // 1KB 미만
      throw new Error("파일이 너무 작습니다.");
    }

    return true;
  };

  // 파일 업로드 처리
  const handleFileUpload = (file) => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    try {
      // 파일 검증
      validateFile(file);

      setSelectedFile(file);
      console.log("업로드된 파일:", file);

      // API 호출
      uploadFileToAPI(file);
    } catch (error) {
      alert(error.message);
      resetUploadState();
    }
  };

  // 파일 선택 핸들러
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      handleFileUpload(file);
    }
    // input 값 초기화 (같은 파일을 다시 선택할 수 있도록)
    event.target.value = "";
  };

  // 드래그 앤 드롭 핸들러 개선
  const handleDragOver = (event) => {
    event.preventDefault();
    if (!isUploading) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    // 드래그가 실제로 영역을 벗어났는지 확인
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

  // 파일 입력 클릭
  const handleClick = () => {
    if (!isUploading) {
      document.getElementById("fileInput").click();
    }
  };

  // 업로드 취소 함수
  const handleCancelUpload = () => {
    if (isUploading) {
      resetUploadState();
      // TODO: AbortController를 사용하여 실제 API 요청도 취소
    }
  };

  // 업로드 상태에 따른 텍스트 결정
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

  // 파일 크기를 읽기 쉬운 형태로 변환
  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
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
          cursor: isUploading ? "default" : "pointer",
        }}
        onClick={!isUploading ? () => navigate("/") : undefined}
        title={isUploading ? "" : "홈으로 돌아가기"}
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
          opacity: animate1 ? 1 : 0,
          transition: "all 0.3s ease-in-out",
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        {/* 업로드 박스 */}
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

            {/* 선택된 파일 정보 표시 */}
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

            {/* 업로드 진행률 표시 */}
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

                {/* 취소 버튼 */}
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
                  지원 형식: MP3, WAV, M4A, AAC (최대 50MB)
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

            {/* 에러 시 다시 시도 버튼 */}
            {uploadError && (
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
            )}
          </div>

          {/* 숨겨진 파일 입력 */}
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
