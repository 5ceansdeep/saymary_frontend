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

  // 이메일 입력 형식 제어
  const handleEmailChange = (e) => {
    const { value } = e.target;
    const filteredValue = value.replace(/[^a-zA-Z0-9@.!*$]/g, ""); // 이메일 input에 영어 대소문자, 숫자, @, ., !, *, $ 만 허용
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmail(filteredValue);
    if (filteredValue === "" || emailRegex.test(filteredValue)) {
      setEmailError(""); // 통과하면 에러 제거
    } else {
      setEmailError("Please enter a valid email address.");
    }
  };

  // 비밀번호 입력 형식 제어
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
    } else {
      setConfirmPasswordError("");
    }
  }; // 비밀번호 input에 최소 6자 이상 입력

  // 비밀번호 확인 입력
  const handleConfirmPasswordChange = (e) => {
    const { value } = e.target;
    setConfirmPassword(value);
    if (value !== password) {
      setConfirmPasswordError("Passwords do not match.");
    } else {
      setConfirmPasswordError("");
    }
  };
  // 회원가입도 동일하게 처리
  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      setError("모든 필드를 입력해주세요.");
      return;
    }

    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "http://3.34.19.178:8080/api/user/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            password: password,
          }),
        }
      );

      // 응답 형식 확인
      const contentType = response.headers.get("content-type");
      let result;

      if (contentType && contentType.includes("application/json")) {
        result = await response.json();
      } else {
        result = await response.text();
      }

      console.log("회원가입 응답:", result);

      if (response.ok) {
        // 성공 처리
        if (typeof result === "string" && result.includes("회원가입 성공")) {
          alert("회원가입이 완료되었습니다!");
          navigate("/login");
        } else if (typeof result === "object" && result.success) {
          alert("회원가입이 완료되었습니다!");
          navigate("/login");
        } else {
          throw new Error("회원가입에 실패했습니다.");
        }
      } else {
        // 에러 처리
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
      {/* 계정 생성 페이지 */}
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
        Wecome :-)
      </h1>
      {/* 회원가입 폼 박스 */}
      <div
        style={{
          position: "absolute",
          bottom: "0",
          left: "50%",
          transform: "translateX(-50%)",
          width: "90%", // 전체 너비의 90%
          maxWidth: "500px", // 최대 너비 제한
          height: "60vh", // 전체 높이의 60%
          padding: "5vw", // 반응형 여백
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
        {/* Nickname 인풋 */}
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
          style={{
            marginBottom: "5px",
            fontSize: "1rem",
            borderRadius: "5px",
            backgroundColor: "#FFFCE4",
            border: "solid 2px #C7C29B",
            padding: "10px",
            width: "300px",
            marginLeft: "18%",
          }}
        />

        {/* 이메일 인풋 */}
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
          style={{
            marginBottom: "5px",
            fontSize: "1rem",
            borderRadius: "5px",
            backgroundColor: "#FFFCE4",
            border: "solid 2px #C7C29B",
            padding: "10px",
            width: "300px",
            marginLeft: "18%",
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

        {/* pw 인풋 */}
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
          style={{
            marginBottom: "5px",
            fontSize: "1rem",
            borderRadius: "5px",
            backgroundColor: "#FFFCE4",
            border: "solid 2px #C7C29B",
            padding: "10px",
            width: "300px",
            marginLeft: "18%",
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

        {/* pw 확인 인풋 */}
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
          style={{
            marginBottom: "5px",
            fontSize: "1rem",
            borderRadius: "5px",
            backgroundColor: "#FFFCE4",
            border: "solid 2px #C7C29B",
            padding: "10px",
            width: "300px",
            marginLeft: "18%",
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

        {/* sign up 버튼 */}
        <button
          onClick={handleRegister}
          style={{
            padding: "12px",
            fontSize: "1rem",
            borderRadius: "5px",
            backgroundColor: "#00492C",
            color: "white",
            border: "none",
            cursor: "pointer",
            marginLeft: "18%",
            marginTop: "10px",
            width: "320px",
          }}
        >
          Sign up
        </button>
      </div>
    </div>
  );
}

export default Register;
