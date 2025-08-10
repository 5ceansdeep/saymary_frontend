import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

function Select() {
  const navigate = useNavigate();

  // 옵션 목록 (불변 배열)
  const situation1 = [
    "Lecture (강의)",
    "Interview (면접)",
    "Presentation (발표)",
    "Speech (연설)",
    "Briefing (브리핑)",
  ] as const;
  const situation2 = [
    "Professor / Teacher (교수 / 선생님)",
    "Interviewer (면접관)",
    "Colleague / Team member (동료 / 팀원)",
    "Client / Boss (고객 / 상사)",
    "General audience (일반 청중)",
  ] as const;
  const situation3 = [
    "Explanatory (설명형)",
    "Self-introductory (자기소개형)",
    "Persuasive (설득형)",
    "Informal (비격식형)",
    "Formal (격식형)",
    "Q&A style (질문응답형)",
  ] as const;

  // 선택 상태 (인덱스 or null)
  const [activeStates1, setActiveStates1] = useState<number | null>(null);
  const [activeStates2, setActiveStates2] = useState<number | null>(null);
  const [activeStates3, setActiveStates3] = useState<number | null>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const selectedSituation =
    activeStates1 !== null ? situation1[activeStates1] : undefined;
  const selectedAudience =
    activeStates2 !== null ? situation2[activeStates2] : undefined;
  const selectedStyle =
    activeStates3 !== null ? situation3[activeStates3] : undefined;

  const isReadyToUpload =
    activeStates1 !== null && activeStates2 !== null && activeStates3 !== null;

  const handleClick1 = (index: number) => {
    setActiveStates1((prev) => (prev === index ? null : index));
  };

  const handleClick2 = (index: number) => {
    setActiveStates2((prev) => (prev === index ? null : index));
  };

  const handleClick3 = (index: number) => {
    setActiveStates3((prev) => (prev === index ? null : index));
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = async (
    e
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      await handleUpload(file);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleUpload = async (file: File) => {
    if (!file) {
      alert("파일을 선택해주세요.");
      return;
    }
    if (
      !isReadyToUpload ||
      !selectedSituation ||
      !selectedAudience ||
      !selectedStyle
    ) {
      alert("상단의 옵션을 모두 선택해주세요.");
      return;
    }

    // 라벨 → 코드
    type SituationLabel = (typeof situation1)[number];
    type AudienceLabel = (typeof situation2)[number];
    type StyleLabel = (typeof situation3)[number];

    const situationCode: Record<SituationLabel, string> = {
      "Lecture (강의)": "lecture",
      "Interview (면접)": "interview",
      "Presentation (발표)": "presentation",
      "Speech (연설)": "speech",
      "Briefing (브리핑)": "briefing",
    };
    const audienceCode: Record<AudienceLabel, string> = {
      "Professor / Teacher (교수 / 선생님)": "professor",
      "Interviewer (면접관)": "interviewer",
      "Colleague / Team member (동료 / 팀원)": "colleague",
      "Client / Boss (고객 / 상사)": "client",
      "General audience (일반 청중)": "general",
    };
    const styleCode: Record<StyleLabel, string> = {
      "Explanatory (설명형)": "explanatory",
      "Self-introductory (자기소개형)": "self_intro",
      "Persuasive (설득형)": "persuasive",
      "Informal (비격식형)": "informal",
      "Formal (격식형)": "formal",
      "Q&A style (질문응답형)": "qa",
    };

    const toCode = (label: string, dict: Record<string, string>) =>
      dict[label] ?? label;

    const fd = new FormData();
    fd.append("file", file);
    fd.append("situation", toCode(selectedSituation!, situationCode));
    fd.append("audience", toCode(selectedAudience!, audienceCode));
    fd.append("style", toCode(selectedStyle!, styleCode));

    console.log(
      "FD to send:",
      Array.from(fd.entries()).map(([k, v]) =>
        v instanceof File
          ? [k, { name: v.name, size: v.size, type: v.type }]
          : [k, v]
      )
    );

    setIsLoading(true);
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 20000);

    try {
      const res = await fetch(
        "https://api.saymary.site/api/fastapi/upload_feedback",
        {
          method: "POST",
          body: fd, // Content-Type 수동 지정 X
          signal: ctrl.signal,
          credentials: "include",
        }
      );
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`HTTP ${res.status} ${res.statusText} ${text}`);
      }
      const ct = res.headers.get("content-type") ?? "";
      const result = ct.includes("application/json")
        ? await res.json()
        : await res.text();

      navigate("/coaching/result", {
        state: {
          feedback: result,
          situation: selectedSituation,
          audience: selectedAudience,
          style: selectedStyle,
          fileName: file.name,
          uploadTime: new Date().toLocaleString(),
        },
      });
    } catch (e) {
      console.error("업로드 실패:", e);
      alert("업로드 실패");
    } finally {
      clearTimeout(timer);
      setIsLoading(false);
    }
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
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        {/* Situation */}
        <h1
          style={{
            color: "#000000",
            marginTop: "2.5%",
            marginBottom: "0px",
            fontFamily: "Noto Sans KR, sans-serif",
            fontWeight: 500,
            fontSize: "2rem",
            paddingBottom: "5px",
            paddingLeft: "7%",
          }}
        >
          Situation
          <div>
            {situation1.map((label, idx) => (
              <button
                key={idx}
                onClick={() => handleClick1(idx)}
                style={{
                  display: "inline-block",
                  marginTop: "0.3%",
                  marginRight: "1%",
                  paddingLeft: "20px",
                  paddingRight: "20px",
                  paddingTop: "3px",
                  paddingBottom: "4px",
                  borderRadius: "10px",
                  cursor: "pointer",
                  fontFamily: "Noto Sans KR, sans-serif",
                  fontWeight: 500,
                  fontSize: "0.9rem",
                  lineHeight: "normal",
                  border: "1px solid #C7C29B",
                  backgroundColor:
                    activeStates1 === idx ? "#00492C" : "#ECEAD5",
                  color: activeStates1 === idx ? "#ffffff" : "#000000",
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </h1>
        {/* Audience type */}
        <h1
          style={{
            color: "#000000",
            marginTop: "2%",
            marginBottom: "0px",
            fontFamily: "Noto Sans KR, sans-serif",
            fontWeight: 500,
            fontSize: "2rem",
            paddingBottom: "5px",
            paddingLeft: "7%",
          }}
        >
          Audience type
          <div>
            {situation2.map((label, idx) => (
              <button
                key={idx}
                onClick={() => handleClick2(idx)}
                style={{
                  display: "inline-block",
                  marginTop: "0.3%",
                  marginRight: "1%",
                  paddingLeft: "20px",
                  paddingRight: "20px",
                  paddingTop: "3px",
                  paddingBottom: "4px",
                  borderRadius: "10px",
                  cursor: "pointer",
                  fontFamily: "Noto Sans KR, sans-serif",
                  fontWeight: 500,
                  fontSize: "0.9rem",
                  lineHeight: "normal",
                  border: "1px solid #C7C29B",
                  backgroundColor:
                    activeStates2 === idx ? "#00492C" : "#ECEAD5",
                  color: activeStates2 === idx ? "#ffffff" : "#000000",
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </h1>
        {/* Speech style */}
        <h1
          style={{
            color: "#000000",
            marginTop: "2%",
            marginBottom: "2%",
            fontFamily: "Noto Sans KR, sans-serif",
            fontWeight: 500,
            fontSize: "2rem",
            paddingBottom: "5px",
            paddingLeft: "7%",
          }}
        >
          Speech style
          <div>
            {situation3.map((label, idx) => (
              <button
                key={idx}
                onClick={() => handleClick3(idx)}
                style={{
                  display: "inline-block",
                  marginTop: "0.3%",
                  marginBottom: "0.3%",
                  marginRight: "1%",
                  paddingLeft: "20px",
                  paddingRight: "20px",
                  paddingTop: "3px",
                  paddingBottom: "4px",
                  borderRadius: "10px",
                  cursor: "pointer",
                  fontFamily: "Noto Sans KR, sans-serif",
                  fontWeight: 500,
                  fontSize: "0.9rem",
                  lineHeight: "normal",
                  border: "1px solid #C7C29B",
                  backgroundColor:
                    activeStates3 === idx ? "#00492C" : "#ECEAD5",
                  color: activeStates3 === idx ? "#ffffff" : "#000000",
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </h1>
        <input
          type="file"
          accept=".mp3, .aac, .ac3, .ogg, .flac, .wav, .m4a"
          style={{ display: "none" }}
          ref={fileInputRef}
          onChange={handleFileChange}
        />
        {isReadyToUpload && (
          <button
            onClick={handleButtonClick}
            disabled={isLoading}
            style={{
              position: "fixed",
              top: "25%",
              right: "20px",
              zIndex: 1000,
              padding: "1.5% 3%",
              borderRadius: "15px",
              border: "none",
              backgroundColor: "#00492C",
              color: "#ffffff",
              fontFamily: "Noto Sans KR, sans-serif",
              fontWeight: 500,
              fontSize: "1.1rem",
              cursor: isLoading ? "wait" : "pointer",
              opacity: isLoading ? 0.6 : 1,
            }}
          >
            {isLoading ? "Uploading..." : "Upload File"}
          </button>
        )}
      </div>
    </div>
  );
}

export default Select;
