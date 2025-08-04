import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function UploadFile() {
  const [animate1, setAnimate1] = useState(false);

  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  // 3.8초 후 노란 박스 애니메이션 시작
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimate1(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // 파일 업로드 처리
  const handleFileUpload = (file) => {
    if (file && file.type.startsWith("audio/")) {
      setSelectedFile(file);
      // 파일 처리 로직 (실제로는 서버로 전송 등)
      console.log("업로드된 파일:", file);

      // main.js 페이지로 이동 (실제로는 파일 처리 완료 후)
      setTimeout(() => {
        navigate("/main");
      }, 1500); // 1.5초 후 이동 (로딩 시뮬레이션)
    } else {
      alert("음성 파일만 업로드 가능합니다.");
    }
  };

  // 파일 선택 핸들러
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  // 드래그 앤 드롭 핸들러
  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  // 파일 입력 클릭
  const handleClick = () => {
    document.getElementById("fileInput").click();
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
            backgroundColor: isDragging ? "#ddd8be" : "#ECEAD5",
            fontFamily: "Noto Sans KR, sans-serif",
            fontWeight: 600,
            fontSize: "1.5rem",
            position: "relative",
            top: "50%",
            transform: "translateY(-50%)",
            marginLeft: "20%",
            marginRight: "20%",
            paddingTop: "60px",
            paddingBottom: "60px",
            paddingLeft: "3%",
            paddingRight: "3%",
            borderRadius: "10px",
            border: isDragging
              ? "2px dashed #F2C81B"
              : "2px dashed transparent",
            transition: "all 0.3s ease-in-out",
            cursor: "pointer",
          }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <div style={{ textAlign: "center" }}>
            <p style={{ margin: "0px" }}>
              {selectedFile
                ? `선택된 파일: ${selectedFile.name}`
                : "음성파일을 업로드 해주세요..."}
            </p>
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
            <button
              style={{
                padding: "10px 30px",
                borderRadius: "10px",
                border: "none",
                backgroundColor: selectedFile ? "#F2C81B" : "#00492C",
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
            >
              {selectedFile ? "Uploading ..." : "Click to upload file"}
            </button>
          </div>

          {/* 숨겨진 파일 입력 */}
          <input
            id="fileInput"
            type="file"
            accept="audio/*"
            style={{ display: "none" }}
            onChange={handleFileSelect}
          />
        </div>
      </div>
    </div>
  );
}

export default UploadFile;
