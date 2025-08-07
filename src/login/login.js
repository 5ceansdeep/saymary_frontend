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
      const response = await fetch("https://api.saymary.site/api/user/login", {
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
        // 세션 기반 인증 성공 처리
        console.log("로그인 성공, 쿠키 기반 세션 생성됨");
        console.log("서버 응답:", result);

        // 사용자 정보 가져오기 (/user/me API 호출)
        try {
          const userResponse = await fetch("https://api.saymary.site/api/user/me", {
            method: "GET",
            credentials: "include", // 세션 쿠키 포함
          });

          if (userResponse.ok) {
            const userData = await userResponse.json();
            console.log("사용자 정보:", userData);

            // 사용자 정보를 localStorage에 저장
            localStorage.setItem("userEmail", userData.email || email);
            localStorage.setItem("userInfo", JSON.stringify(userData));

            // Remember me 처리
            if (rememberMe) {
              localStorage.setItem("rememberedEmail", email);
            } else {
              localStorage.removeItem("rememberedEmail");
            }

            alert("로그인 성공!");
            navigate("/upload");
          } else {
            console.error("사용자 정보를 가져올 수 없습니다:", userResponse.status);
            // 로그인은 성공했지만 사용자 정보를 못 가져온 경우
            localStorage.setItem("userEmail", email);
            
            if (rememberMe) {
              localStorage.setItem("rememberedEmail", email);
            } else {
              localStorage.removeItem("rememberedEmail");
            }

            alert("로그인 성공!");
            navigate("/upload");
          }
        } catch (userInfoError) {
          console.error("사용자 정보 요청 실패:", userInfoError);
          // 사용자 정보는 못 가져왔지만 로그인은 성공
          localStorage.setItem("userEmail", email);
          
          if (rememberMe) {
            localStorage.setItem("rememberedEmail", email);
          } else {
            localStorage.removeItem("rememberedEmail");
          }

          alert("로그인 성공!");
          navigate("/upload");
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
