import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  // 누락된 상태 변수들 추가
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
    if (confirmPassword && value !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match.");
    } else if (confirmPassword && value === confirmPassword) {
      setConfirmPasswordError("");
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const { value } = e.target;
    setConfirmPassword(value);
    if (value !== password) {
      setConfirmPasswordError("Passwords do not match.");
    } else {
      setConfirmPasswordError("");
    }
  };

  const handleRegister = async () => {
    if (!nickname || !email || !password || !confirmPassword) {
      setError("모든 필드를 입력해주세요.");
      return;
    }

    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (emailError || passwordError || confirmPasswordError) {
      setError("입력 오류를 수정해주세요.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("https://api.saymary.site/api/user/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nickname: nickname,
          email: email,
          password: password,
        }),
      });

      const contentType = response.headers.get("content-type");
      let result;

      if (contentType && contentType.includes("application/json")) {
        result = await response.json();
      } else {
        result = await response.text();
      }

      console.log("회원가입 응답:", result);

      if (response.ok) {
        if (typeof result === "string" && result.includes("회원가입 성공")) {
          // 회원가입 성공 시 로컬스토리지에 사용자 정보 저장
          localStorage.setItem("userEmail", email);
          localStorage.setItem("userNickname", nickname);
          localStorage.setItem("loginTime", new Date().toISOString());

          alert("회원가입이 완료되었습니다!");
          navigate("/login");
        } else if (typeof result === "object" && result.success) {
          // 회원가입 성공 시 로컬스토리지에 사용자 정보 저장
          localStorage.setItem("userEmail", email);
          localStorage.setItem("userNickname", nickname);
          localStorage.setItem("loginTime", new Date().toISOString());

          alert("회원가입이 완료되었습니다!");
          navigate("/login");
        } else {
          throw new Error("회원가입에 실패했습니다.");
        }
      } else {
        let errorMessage =
          typeof result === "string"
            ? result
            : result.message || "회원가입에 실패했습니다.";

        if (errorMessage.includes("이미 존재")) {
          setError("이미 가입된 이메일입니다.");
        } else {
          setError(errorMessage);
        }
      }
    } catch (error) {
      console.error("회원가입 오류:", error);

      if (error.name === "SyntaxError" && error.message.includes("JSON")) {
        setError("서버 응답 형식에 오류가 있습니다. 관리자에게 문의하세요.");
      } else if (error.message.includes("Failed to fetch")) {
        setError("네트워크 연결을 확인해주세요.");
      } else {
        setError(error.message || "회원가입 중 오류가 발생했습니다.");
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
        Welcome :-)
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
            회원가입 중...
          </div>
        )}

        <h3
          style={{
            marginBottom: "5px",
            fontSize: "1.2rem",
            margin: "0 auto",
            marginLeft: "18%",
          }}
        >
          Nickname
        </h3>
        <input
          type="text"
          placeholder="Enter your nickname"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          disabled={loading}
          style={{
            marginBottom: "5px",
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

        <h3
          style={{
            marginBottom: "5px",
            marginTop: "10px",
            fontSize: "1.2rem",
            marginLeft: "18%",
          }}
        >
          Email ID
        </h3>
        <input
          type="email"
          value={email}
          placeholder="Enter your email"
          onChange={handleEmailChange}
          disabled={loading}
          style={{
            marginBottom: "5px",
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
            marginBottom: "5px",
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

        <h3
          style={{
            marginBottom: "5px",
            marginTop: "10px",
            fontSize: "1.2rem",
            marginLeft: "18%",
            color: "#00492C",
          }}
        >
          Confirm Password
        </h3>
        <input
          type="password"
          placeholder="Enter your password"
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
          disabled={loading}
          style={{
            marginBottom: "5px",
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
        {confirmPasswordError && (
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
            {confirmPasswordError}
          </p>
        )}

        <button
          onClick={handleRegister}
          disabled={
            loading ||
            !nickname ||
            !email ||
            !password ||
            !confirmPassword ||
            emailError ||
            passwordError ||
            confirmPasswordError
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
              loading ||
              !nickname ||
              !email ||
              !password ||
              !confirmPassword ||
              emailError ||
              passwordError ||
              confirmPasswordError
                ? 0.6
                : 1,
          }}
        >
          {loading ? "가입 중..." : "Sign up"}
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
            Already have an account?
          </label>
          <label
            onClick={!loading ? () => navigate("/login") : undefined}
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
            Sign in
          </label>
        </div>
      </div>
    </div>
  );
}

export default Register;
