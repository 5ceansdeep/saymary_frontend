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
    try {
      const userEmail = localStorage.getItem("userEmail");
      const loginTime = localStorage.getItem("loginTime");
      let ok = !!userEmail;

      if (ok && loginTime) {
        const hours =
          (Date.now() - new Date(loginTime).getTime()) / (1000 * 60 * 60);
        if (hours > 24) {
          localStorage.removeItem("userEmail");
          localStorage.removeItem("loginTime");
          ok = false;
        }
      }
      setIsAuthed(ok);
      setText(ok ? authedText : unauthText);
    } catch {
      setIsAuthed(false);
      setText(unauthText);
    }
  }, [authedText, unauthText]);

  useEffect(() => {
    evaluateAuth();
  }, [evaluateAuth]);

  // (선택) 다른 탭에서 localStorage 바뀌면 동기화
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "userEmail" || e.key === "loginTime") evaluateAuth();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [evaluateAuth]);

// 로그아웃 함수
  const handleLogout = useCallback(() => {
    if (!window.confirm("정말 로그아웃할까요?")) return; // 취소 누르면 그대로 종료

    localStorage.removeItem("userEmail");
    localStorage.removeItem("loginTime");
    localStorage.removeItem("userInfo");
    localStorage.removeItem("summaryData");
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
