import React from "react";

function Login() {
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
          top: "10%",
          left: "5%",
          color: "#F2C81B",
          fontSize: "50px",
          margin: 0,
        }}
      >
        Please Login.
      </h1>
      {/* <div
        style={{
          position: "fixed",
          bottom: "0",
          left: "50%",
          transform: "translateX(-50%)",
          backgroundColor: "#FFFCE4",
          color: "#656247",
          flexDirection: "column",
          width: "80%",
          height: "80%",
          borderTopLeftRadius: "30px",
          borderTopRightRadius: "30px",
          borderBottomLeftRadius: "0px",
          borderBottomRightRadius: "0px",
          display: "flex",
        }}
      > */}
      <div
        style={{
          position: "absolute",
          bottom: "0",
          left: "50%",
          transform: "translate(-50%, -0%)", // 완전 가운데 정렬
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "stretch",
          width: "90%", // 전체 너비의 90%
          maxWidth: "500px", // 최대 너비 제한
          height: "60%", // 전체 높이의 60%
          padding: "5vw", // 반응형 여백
          backgroundColor: "#FFFCE4",
          borderRadius: "10px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          borderTopLeftRadius: "30px",
          borderTopRightRadius: "30px",
          borderBottomLeftRadius: "0px",
          borderBottomRightRadius: "0px",
        }}
      >
        <h3 style={{ marginBottom: "5px", fontSize: "1.2rem" }}>Email</h3>
        <input
          type="email"
          placeholder="Enter your email"
          style={{
            marginBottom: "10px",
            fontSize: "1rem",
            borderRadius: "5px",
            backgroundColor: "#FFFCE4",
            border: "solid 2px #C7C29B",
            padding: "10px",
          }}
        />
        <h3
          style={{
            marginBottom: "5px",
            marginTop: "10px",
            fontSize: "1.2rem",
          }}
        >
          Password
        </h3>
        <input
          type="password"
          placeholder="Enter your password"
          style={{
            marginBottom: "20px",
            fontSize: "1rem",
            borderRadius: "5px",
            backgroundColor: "#FFFCE4",
            border: "solid 2px #C7C29B",
            padding: "10px",
          }}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "20px",
            fontSize: "0.9rem",
          }}
        >
          <h3 style={{ textDecoration: "underline", margin: 0 }}>
            Remember me
          </h3>
          <h3 style={{ textDecoration: "underline", margin: 0 }}>
            Forgot password
          </h3>
        </div>
        <button
          style={{
            padding: "12px",
            fontSize: "1rem",
            borderRadius: "5px",
            backgroundColor: "#00492C",
            color: "white",
            border: "none",
          }}
        >
          Sign Up
        </button>
      </div>
    </div>
    // </div>
  );
}

export default Login;
