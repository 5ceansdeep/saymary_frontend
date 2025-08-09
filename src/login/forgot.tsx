import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Forgot() {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);

  const handleEmailChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const { value } = e.target;
    // 이메일 인풋에 영어 대소문자, 숫자, @, ., _, +, - 만 허용
    const filteredValue = value.replace(/[^a-zA-Z0-9@._+-]/g, "");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    setEmail(filteredValue);

    if (filteredValue === "" || emailRegex.test(filteredValue)) {
      setEmailError("");
    } else {
      setEmailError("Please enter a valid email address.");
    }
  };

  const handleSubmit = async () => {
    if (!email || !!emailError) return;
    setSubmitting(true);
    try {
      const response = await fetch(
        "https://api.saymary.site/api/user/request-reset",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const text = await response.text();
      console.log("응답 내용:", text);

      if (!response.ok) {
        // 서버가 에러 코드를 반환하는 경우에도 사용자에게 메시지 제공
        alert("요청 처리 중 오류가 발생했습니다.");
        return;
      }

      if (text.includes("재설정")) {
        alert("비밀번호 재설정 메일이 발송되었습니다.");
      } else if (text.includes("존재")) {
        alert("등록되지 않은 이메일입니다.");
      } else {
        // 백엔드 응답 문구가 바뀌더라도 사용자 경험을 보장
        alert("요청이 접수되었습니다. 메일함을 확인해주세요.");
      }
    } catch (error) {
      alert("서버 연결 실패!");
      console.error("fetch error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const canSubmit = Boolean(email) && !emailError && !submitting;

  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100vh",
        backgroundColor: "#00492C",
      }}
    >
      {/* 타이틀 */}
      <h1
        style={{
          position: "absolute",
          bottom: "85%",
          left: "-20%",
          color: "#F2C81B",
          fontSize: "50px",
          marginBottom: 0,
          width: "100%",
          textAlign: "center",
        }}
      >
        I forgot my password :(
      </h1>

      {/* 폼 박스 */}
      <div
        style={{
          position: "absolute",
          bottom: "0",
          left: "50%",
          transform: "translateX(-50%)",
          width: "90%",
          maxWidth: "500px",
          height: "60vh",
          padding: "5vw",
          backgroundColor: "#FFFCE4",
          borderRadius: "10px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          borderTopLeftRadius: "30px",
          borderTopRightRadius: "30px",
          borderBottomLeftRadius: "0px",
          borderBottomRightRadius: "0px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        {/* 이메일 인풋 */}
        <h3
          style={{ marginBottom: "5px", fontSize: "1.2rem", marginLeft: "18%" }}
        >
          Email ID
        </h3>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={handleEmailChange}
          onKeyDown={(e) => {
            if (e.key === "Enter" && canSubmit) handleSubmit();
          }}
          style={{
            marginBottom: "10px",
            fontSize: "1rem",
            borderRadius: "5px",
            backgroundColor: "#FFFCE4",
            border: "solid 2px #C7C29B",
            padding: "10px",
            width: "300px",
            marginLeft: "18%",
          }}
        />
        {!!emailError && (
          <p
            style={{
              color: "red",
              fontSize: "0.8rem",
              marginLeft: "18%",
              marginTop: "0",
              marginBottom: "15px",
              fontFamily: "Noto Sans KR, sans-serif",
            }}
          >
            {emailError}
          </p>
        )}

        {/* 제출 버튼 */}
        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          style={{
            padding: "12px",
            fontSize: "1rem",
            borderRadius: "5px",
            backgroundColor: canSubmit ? "#00492C" : "#C7C29B",
            color: "white",
            border: "none",
            cursor: canSubmit ? "pointer" : "not-allowed",
            marginLeft: "18%",
            marginTop: "10px",
            width: "320px",
          }}
        >
          {submitting ? "Submitting..." : "Submit"}
        </button>

        {/* 계정 등록 링크 (sign up) */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            paddingTop: "20px",
          }}
        >
          <label
            style={{
              color: "#000000",
              margin: 0,
              fontSize: "1rem",
              marginRight: "5px",
            }}
          >
            Don't have an account?
          </label>
          <label
            onClick={() => navigate("/register")}
            style={{
              color: "#000000",
              fontWeight: "bold",
              textDecoration: "underline",
              margin: 0,
              fontSize: "1rem",
              cursor: "pointer",
            }}
          >
            Sign up
          </label>
        </div>
        {/* or Sign in */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <label
            style={{
              color: "#000000",
              margin: 0,
              fontSize: "1rem",
              marginRight: "5px",
            }}
          >
            or
          </label>
          <label
            onClick={() => navigate("/login")}
            style={{
              color: "#000000",
              fontWeight: "bold",
              textDecoration: "underline",
              margin: 0,
              fontSize: "1rem",
              cursor: "pointer",
            }}
          >
            Sign in
          </label>
        </div>
      </div>
    </div>
  );
}

export default Forgot;
