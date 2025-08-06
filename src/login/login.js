 import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  // 누락된 상태 변수들 추가
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleEmailChange = (e) => {
    const { value } = e.target;
    const filteredValue = value.replace(/[^a-zA-Z0-9@.!*$]/g, "");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmail(filteredValue);
    if (filteredValue === "" || emailRegex.test(filteredValue)) {
      setEmailError("");
    } else {
      setEmailError("Please enter a valid email address.");
    }
  };

  const handlePasswordChange = (e) => {
    const { value } = e.target;
    setPassword(value);
    if (value.length > 0 && value.length < 6) {
      setPasswordError("Password must be at least 6 characters long.");
    } else {
      setPasswordError("");
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      setError("이메일과 비밀번호를 입력해주세요.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("https://3.34.19.178:8080/api/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
        credentials: "include", // ✅ 핵심 줄!
      });

      const contentType = response.headers.get("content-type");
      let result;

      if (contentType && contentType.includes("application/json")) {
        result = await response.json();
      } else {
        result = await response.text();
      }

      console.log("서버 응답:", result);
      console.log("응답 타입:", typeof result);

      if (response.ok) {
        // 성공 처리 - 실제 토큰 찾기
        let actualToken = null;

        if (typeof result === "string") {
          // 텍스트 응답에서 토큰 추출 시도
          if (result.includes("로그인 성공") || result.includes("success")) {
            // 만약 응답이 단순 텍스트라면 서버에 토큰 요청 필요
            console.log(
              "⚠️ 텍스트 응답입니다. 서버에서 토큰을 제공하지 않는 것 같습니다."
            );
            console.log(
              "서버 개발자에게 로그인 시 토큰 반환 요청이 필요합니다."
            );

            // 임시방편: 사용자 정보로 임시 토큰 생성 (실제로는 서버에서 해야 함)
            actualToken = btoa(
              JSON.stringify({
                email: email,
                timestamp: Date.now(),
                type: "temp",
              })
            );

            console.log("임시 토큰 생성:", actualToken);
          } else {
            throw new Error(result || "로그인에 실패했습니다.");
          }
        } else {
          // JSON 응답에서 토큰 찾기
          actualToken =
            result.token ||
            result.accessToken ||
            result.access_token ||
            result.authToken ||
            result.jwt;

          if (!actualToken && result.success) {
            console.log("⚠️ JSON 응답이지만 토큰 필드가 없습니다:", result);

            // 사용 가능한 모든 키 출력
            console.log("응답의 모든 키:", Object.keys(result));

            // 임시 토큰 생성
            actualToken = btoa(
              JSON.stringify({
                email: email,
                timestamp: Date.now(),
                type: "temp",
                response: result,
              })
            );
          }
        }

        if (actualToken) {
          console.log("✅ 토큰 저장:", actualToken.substring(0, 20) + "...");
          localStorage.setItem("accessToken", actualToken);
          localStorage.setItem("userEmail", email);

          // Remember me 처리
          if (rememberMe) {
            localStorage.setItem("rememberedEmail", email);
          } else {
            localStorage.removeItem("rememberedEmail");
          }

          alert("로그인 성공!");
          navigate("/upload");
        } else {
          throw new Error(
            "서버에서 토큰을 받지 못했습니다. 서버 개발자에게 문의하세요."
          );
        }
      } else {
        // 에러 처리 (기존과 동일)
        let errorMessage;

        if (typeof result === "string") {
          errorMessage = result;
        } else {
          errorMessage = result.message || `서버 오류: ${response.status}`;
        }

        if (errorMessage.includes("존재하지 않는 이메일")) {
          setError("존재하지 않는 이메일입니다.");
        } else if (errorMessage.includes("비밀번호")) {
          setError("비밀번호가 일치하지 않습니다.");
        } else if (response.status === 401) {
          setError("인증에 실패했습니다. 이메일과 비밀번호를 확인해주세요.");
        } else {
          setError(errorMessage || "로그인에 실패했습니다.");
        }
      }
    } catch (error) {
      console.error("로그인 오류:", error);

      if (error.name === "SyntaxError" && error.message.includes("JSON")) {
        setError("서버 응답 형식에 오류가 있습니다. 관리자에게 문의하세요.");
      } else if (error.message.includes("Failed to fetch")) {
        setError("네트워크 연결을 확인해주세요.");
      } else {
        setError(error.message || "로그인 중 오류가 발생했습니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100vh",
        backgroundColor: "#00492C",
      }}
    >
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
        Please Login.
      </h1>

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
        {/* 에러 메시지 표시 */}
        {error && (
          <div
            style={{
              color: "red",
              fontSize: "0.9rem",
              marginBottom: "15px",
              marginLeft: "18%",
              fontFamily: "Noto Sans KR, sans-serif",
            }}
          >
            {error}
          </div>
        )}

        {/* 로딩 상태 표시 */}
        {loading && (
          <div
            style={{
              color: "#00492C",
              fontSize: "0.9rem",
              marginBottom: "15px",
              marginLeft: "18%",
              fontFamily: "Noto Sans KR, sans-serif",
            }}
          >
            로그인 중...
          </div>
        )}

        <h3
          style={{
            marginBottom: "5px",
            fontSize: "1.2rem",
            marginLeft: "18%",
          }}
        >
          Email ID
        </h3>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={handleEmailChange}
          disabled={loading}
          style={{
            marginBottom: "10px",
            fontSize: "1rem",
            borderRadius: "5px",
            backgroundColor: "#FFFCE4",
            border: "solid 2px #C7C29B",
            padding: "10px",
            width: "300px",
            marginLeft: "18%",
            opacity: loading ? 0.6 : 1,
          }}
        />
        {emailError && (
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

        <h3
          style={{
            marginBottom: "5px",
            marginTop: "10px",
            fontSize: "1.2rem",
            marginLeft: "18%",
          }}
        >
          Password
        </h3>
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={handlePasswordChange}
          disabled={loading}
          style={{
            marginBottom: "10px",
            fontSize: "1rem",
            borderRadius: "5px",
            backgroundColor: "#FFFCE4",
            border: "solid 2px #C7C29B",
            padding: "10px",
            width: "300px",
            marginLeft: "18%",
            opacity: loading ? 0.6 : 1,
          }}
        />
        {passwordError && (
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
            {passwordError}
          </p>
        )}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "20px",
            fontSize: "0.9rem",
          }}
        >
          <div
            style={{ display: "flex", alignItems: "center", marginLeft: "18%" }}
          >
            <input
              type="checkbox"
              id="remember-me"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              disabled={loading}
              style={{ marginRight: "5px" }}
            />
            <label
              htmlFor="remember-me"
              style={{
                textDecoration: "underline",
                margin: 0,
                fontSize: "1rem",
                cursor: loading ? "default" : "pointer",
                opacity: loading ? 0.6 : 1,
              }}
            >
              Remember me
            </label>
          </div>

          <label
            onClick={!loading ? () => navigate("/forgot") : undefined}
            style={{
              textDecoration: "underline",
              margin: 0,
              fontSize: "1rem",
              cursor: loading ? "default" : "pointer",
              marginRight: "18%",
              opacity: loading ? 0.6 : 1,
            }}
          >
            Forgot password
          </label>
        </div>

        <button
          onClick={handleLogin}
          disabled={
            loading || !email || !password || emailError || passwordError
          }
          style={{
            padding: "12px",
            fontSize: "1rem",
            borderRadius: "5px",
            backgroundColor: loading ? "#666" : "#00492C",
            color: "white",
            border: "none",
            cursor: loading ? "default" : "pointer",
            marginLeft: "18%",
            marginTop: "10px",
            width: "320px",
            opacity:
              loading || !email || !password || emailError || passwordError
                ? 0.6
                : 1,
          }}
        >
          {loading ? "로그인 중..." : "Sign in"}
        </button>

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
            onClick={!loading ? () => navigate("/register") : undefined}
            style={{
              color: "#000000",
              fontWeight: "bold",
              textDecoration: "underline",
              margin: 0,
              fontSize: "1rem",
              cursor: loading ? "default" : "pointer",
              opacity: loading ? 0.6 : 1,
            }}
          >
            Sign up
          </label>
        </div>
      </div>
    </div>
  );
}

export default Login;