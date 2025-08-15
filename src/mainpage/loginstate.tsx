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

  // 세션 기반 로그인 상태 평가
  const evaluateAuth = useCallback(async () => {
    try {
      const response = await fetch("https://api.saymary.site/api/user/me", {
        method: "GET",
        credentials: "include",
      });
      
      const authenticated = response.ok;
      setIsAuthed(authenticated);
      setText(authenticated ? authedText : unauthText);
    } catch (e) {
      console.error("인증 상태 확인 중 오류:", e);
      setIsAuthed(false);
      setText(unauthText);
    }
  }, [authedText, unauthText]);

  useEffect(() => {
    evaluateAuth();
  }, [evaluateAuth]);

  // 주기적 인증 상태 확인 (필요시)
  useEffect(() => {
    const onFocus = () => evaluateAuth();
    const onAuthChange = () => evaluateAuth();

    window.addEventListener("focus", onFocus);
    window.addEventListener("authchange", onAuthChange);
    
    return () => {
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("authchange", onAuthChange);
    };
  }, [evaluateAuth]);

  // 세션 기반 로그아웃 함수
  const handleLogout = useCallback(async () => {
    if (!window.confirm("정말 로그아웃할까요?")) return;

    try {
      const response = await fetch("https://api.saymary.site/api/user/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        // 로컬에 저장된 임시 데이터도 정리
        localStorage.removeItem("summaryData");
        localStorage.removeItem("archiveFiles");
        
        window.dispatchEvent(new Event("authchange"));
        alert("로그아웃되셨습니다.");
        navigate("/login");
      } else {
        alert("로그아웃 중 오류가 발생했습니다.");
      }
    } catch (e) {
      console.error("로그아웃 중 오류:", e);
      alert("로그아웃 중 오류가 발생했습니다.");
    }
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
