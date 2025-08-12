import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

type Props = {
  authedText?: string;
  unauthText?: string;
};

export default function LoginState({
  authedText = "Logout",
  unauthText = "Login",
}: Props) {
  const [isAuthed, setIsAuthed] = useState(false);
  const [text, setText] = useState("확인 중...");
  const navigate = useNavigate();

  // 로그인 상태 평가
  const evaluateAuth = useCallback(() => {
    const hasAny = localStorage.length > 0;
    setIsAuthed(hasAny);
    setText(hasAny ? authedText : unauthText);
  }, [authedText, unauthText]);

  useEffect(() => {
    evaluateAuth();
  }, [evaluateAuth]);

  // 같은 탭/다른 탭 변화 모두 반영
  useEffect(() => {
    const onStorage = () => evaluateAuth(); // 다른 탭
    const onAuthChange = () => evaluateAuth();
    const onFocus = () => evaluateAuth();

    window.addEventListener("storage", onStorage);
    window.addEventListener("authchange", onAuthChange);
    window.addEventListener("focus", onFocus);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("authchange", onAuthChange);
      window.removeEventListener("focus", onFocus);
    };
  }, [evaluateAuth]);

  // 로그아웃 함수
  const handleLogout = useCallback(() => {
    if (!window.confirm("정말 로그아웃할까요?")) return;

    localStorage.removeItem("userEmail");
    localStorage.removeItem("loginTime");
    localStorage.removeItem("userInfo");
    localStorage.removeItem("summaryData");

    // 같은 탭에서 즉시 반영
    window.dispatchEvent(new Event("authchange"));

    alert("로그아웃되셨습니다.");
    navigate("/login");
  }, [navigate]);

  // 로그인 함수
  const handleLogin = useCallback(() => {
    navigate("/login");
  }, [navigate]);

  return (
    <button
      onClick={isAuthed ? handleLogout : handleLogin}
      style={{
        position: "fixed",
        top: "12%",
        right: "2%",
        zIndex: 99999,
        padding: "6px 30px",
        background: isAuthed ? "#02824F" : "#2E5143",
        color: "#fff",
        borderRadius: 12,
        boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
        fontFamily: "Noto Sans KR, sans-serif",
        fontSize: "1rem",
        fontWeight: 600,
        border: "none",
        cursor: "pointer",
      }}
      title={isAuthed ? "로그아웃하기" : "로그인하기"}
    >
      {text}
    </button>
  );
}
