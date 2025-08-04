import { useEffect, useState, useRef } from "react";
import "./main.css";
import godown from "./img/godown.png";
import homeIcon from "./img/home.png";
import coachingIcon from "./img/coaching.png";
import archiveIcon from "./img/archive.png";

function Main({loading}) {
  const [animate1, setAnimate1] = useState(false);
  const BoxRef = useRef();

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimate1(true);
    }, 3800);
    return () => clearTimeout(timer);
  }, []);

  const scrollToBottom = () => {
    if (BoxRef.current) {
      BoxRef.current.scrollTo({
        top: BoxRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

   if (loading) return null;
   
  return (
   <>
      {!loading && (
        <>
          {/* ✅ 왼쪽 사이드바 */}
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: 0,
              transform: "translateY(-50%)",
              width: "110px",
              height: "auto",
              backgroundColor: "#00492C",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              paddingTop: "40px",
              paddingBottom: "40px",
              zIndex: 1000,
              borderRadius: "0 20px 20px 0",
            }}
          >
            <h1
              style={{
                color: "#F4C94D",
                fontSize: "28px",
                fontWeight: "700",
                fontFamily: "serif",
                marginBottom: "60px",
              }}
            >
              Saymary
            </h1>
            <SidebarButton icon={homeIcon} text="Home" />
            <SidebarButton icon={coachingIcon} text="Coaching" />
            <SidebarButton icon={archiveIcon} text="Archive" />
          </div>

          {/* ✅ 보관함에 저장 버튼 */}
          <button
            onClick={() => {
              const filename = prompt("저장할 파일명을 입력하세요");
              if (!filename) return;
              const date = new Date().toISOString().slice(2, 10).replace(/-/g, ".");
              const file = {
                name: filename,
                date,
              };
              const existing = JSON.parse(localStorage.getItem("savedFiles")) || [];
              localStorage.setItem("savedFiles", JSON.stringify([...existing, file]));
              alert("보관함에 저장되었습니다!");
            }}
            style={{
              position: "fixed",
              top: "30px",
              right: "40px",
              backgroundColor: "#00492C",
              color: "white",
              padding: "10px 20px",
              borderRadius: "10px",
              fontSize: "14px",
              fontWeight: "bold",
              cursor: "pointer",
              zIndex: 1000,
            }}
          >
            보관함에 저장
          </button>
        </>
      )}

      {/* ✅ 노란 박스 */}
      <div
        className="custom-scroll"
        ref={BoxRef}
        style={{
          backgroundColor: "#FFFCE4",
          position: "absolute",
          borderRadius: "10px",
          boxShadow: "-20px 5px 0px rgba(0, 0, 0, 0.2)",
          top: "20%",
          left: "12%",
          width: "88%",
          height: "80%",
          opacity: animate1 ? 1 : 0,
          transition: "all 0.3s ease-in-out",
          overflowY: "auto",
        }}
      >
        <h1
          style={{
            color: "#656247",
            fontFamily: "Noto Sans KR, sans-serif",
            fontWeight: 500,
            fontSize: "18px",
            margin: "0px",
            paddingTop: "3%",
            paddingBottom: "5px",
            paddingLeft: "7%",
          }}
        >
          파일명 : 알아서 AI가 요약해준대로 임시로 지정
          <div className="exportButtonContainer">
            <button className="exportButton">. . .</button>
            <button className="hoverButton">이미지 1, 이미지 2</button>
          </div>
        </h1>
        <h2
          style={{
            color: "#656247",
            fontFamily: "Noto Sans KR, sans-serif",
            fontWeight: 300,
            fontSize: "11px",
            paddingLeft: "7%",
            paddingTop: "0px",
            margin: "0px",
          }}
        >
          {new Date().toLocaleString()}
        </h2>

        {/* ✅ 요약 텍스트 박스 */}
        <p
          style={{
            color: "#656247",
            backgroundColor: "#ECEAD5",
            fontFamily: "Noto Sans KR, sans-serif",
            fontWeight: 400,
            fontSize: "12px",
            marginTop: "20px",
            marginLeft: "7%",
            marginRight: "8%",
            paddingTop: "40px",
            paddingBottom: "50px",
            paddingLeft: "40px",
            paddingRight: "40px",
            lineHeight: "2",
            borderRadius: "10px",
          }}
        >
          재택근무는 코로나19 팬데믹을 계기로 빠르게 확산된 근무 형태이다.
          직원들은 출퇴근 시간이 사라지면서 더 많은 여유 시간을 확보할 수 있게 되었다.
          이는 워라밸(Work-Life Balance) 향상에 긍정적인 영향을 주었다.
          ...
          {/* 생략 가능 - 여기에 긴 텍스트 들어감 */}
        </p>

        {/* ✅ 하단으로 스크롤 이동 버튼 */}
        <img
          src={godown}
          onClick={scrollToBottom}
          alt="최하단으로 이동"
          style={{
            position: "fixed",
            left: "55%",
            bottom: "50px",
            transform: "translateX(-50%)",
            zIndex: 999,
            cursor: "pointer",
            width: "50px",
            height: "30px",
          }}
        />
      </div>
      <div style={{ position: "relative" }}>
      {/* 기타 컴포넌트 */}
      </div>
    </>
  );
}

function SidebarButton({ icon, text }) {
  return (
    <div
      style={{
        width: "80px",
        height: "80px",
        backgroundColor: "#006B3F",
        borderRadius: "20px",
        marginBottom: "20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
      }}
    >
      <img src={icon} alt={text} style={{ width: "26px", height: "26px", marginBottom: "5px" }} />
      <span
        style={{
          color: "white",
          fontSize: "11px",
          fontWeight: "bold",
          fontFamily: "Noto Sans KR, sans-serif",
        }}
      >
        {text}
      </span>
    </div>
  );
}

export default Main;