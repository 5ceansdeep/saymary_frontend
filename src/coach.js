import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import axios from "axios";
import godown from "./img/godown.png";

function Coach() {
  const [hovered, setHovered] = useState(false);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    setHovered(true);
    const timer = setTimeout(() => {
      setHovered(false);
    }, 1200); // 페이지 로딩 완료 후 1.2초 메뉴바 보여줌

    return () => clearTimeout(timer);
  }, []);

  const BoxRef = useRef();
  const scrollToBottom = () => {
    if (BoxRef.current) {
      BoxRef.current.scrollTo({
        top: BoxRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("audience", "팀원");
    formData.append("style", "격식있는");
    formData.append("situation", "발표");

    try {
      const res = await axios.post(
        "http://localhost:8080/api/coaching/feedback",
        formData
      );
      setFeedback(res.data.feedback);
    } catch (err) {
      console.error("요청 실패", err);
    }
  };

  return (
    <div
      className="custom-scroll"
      style={{
        backgroundColor: "#FFFCE4",
        height: "100vh",
        display: "flex",
        padding: "0px",
        margin: "0px",
        position: "relative",
      }}
    >
      {/* 좌우 반반 분할 */}
      <div
        ref={BoxRef}
        style={{
          width: "50%",
          height: "100%",
          overflowY: "auto", // 독립 스크롤
          justifyContent: "center",
          padding: "20px",
          boxSizing: "border-box",
          borderRight: "2px solid #ECEAD5",
        }}
      >
        <div style={{ height: "1500px" }}>
          <h1
            style={{
              color: "#656247",
              fontFamily: "Noto Sans KR, sans-serif",
              fontWeight: 500,
              fontSize: "1.5rem",
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
              fontSize: "0.84rem",
              paddingLeft: "7%",
              paddingTop: "0px",
              margin: "0px",
            }}
          >
            {new Date().toLocaleString()} {/* 생성된 (현재) 날짜와 시간 표시 */}
          </h2>
          {/* 요약 텍스트 본문 */}
          <p
            style={{
              color: "#656247",
              backgroundColor: "#ECEAD5",
              fontFamily: "Noto Sans KR, sans-serif",
              fontWeight: 400,
              fontSize: "1rem",
              marginTop: "20px",
              marginLeft: "7%",
              marginRight: "5%",
              paddingTop: "40px",
              paddingBottom: "50px",
              paddingLeft: "7%",
              paddingRight: "7%",
              lineHeight: "1.8",
              borderRadius: "10px",
            }}
          >
            재택근무는 코로나19 팬데믹을 계기로 빠르게 확산된 근무 형태이다.
            직원들은 출퇴근 시간이 사라지면서 더 많은 여유 시간을 확보할 수 있게
            되었다. 이는 워라밸(Work-Life Balance) 향상에 긍정적인 영향을
            주었다. 또한, 자율적인 시간 관리가 가능해져 개인의 집중력이 오히려
            높아지기도 한다. 기업 입장에서는 사무실 운영비용 절감 등의 경제적
            이점이 존재한다. 반면, 팀원 간의 소통이 부족해지며 협업 효율이
            낮아지는 경우도 있다. 물리적 거리감은 심리적 거리감으로 이어져 조직
            소속감을 약화시킬 수 있다. 특히 신입사원의 경우 적응이 어렵고
            피드백이 늦어 성장이 더뎌질 수 있다. 업무와 사생활의 경계가
            모호해지면서 오히려 스트레스를 유발하기도 한다. 사이버 보안 및
            데이터 보호 문제도 재택근무의 큰 과제로 남아 있다. 일부 기업은
            하이브리드 근무 형태를 도입하여 장단점을 조율하고 있다. 기술
            인프라와 커뮤니케이션 도구의 발전은 원격 협업을 점차 수월하게 만들고
            있다. 재택근무는 직무의 특성과 개인의 성향에 따라 효과가 달라질 수
            있다. 따라서 일률적인 정책보다는 유연한 제도 설계가 필요하다.
            결론적으로 재택근무는 미래 업무 환경의 중요한 축으로 자리 잡아가고
            있다. 재택근무는 코로나19 팬데믹을 계기로 빠르게 확산된 근무
            형태이다. 직원들은 출퇴근 시간이 사라지면서 더 많은 여유 시간을
            확보할 수 있게 되었다. 이는 워라밸(Work-Life Balance) 향상에
            긍정적인 영향을 주었다. 또한, 자율적인 시간 관리가 가능해져 개인의
            집중력이 오히려 높아지기도 한다. 기업 입장에서는 사무실 운영비용
            절감 등의 경제적 이점이 존재한다. 반면, 팀원 간의 소통이 부족해지며
            협업 효율이 낮아지는 경우도 있다. 물리적 거리감은 심리적 거리감으로
            이어져 조직 소속감을 약화시킬 수 있다. 특히 신입사원의 경우 적응이
            어렵고 피드백이 늦어 성장이 더뎌질 수 있다. 업무와 사생활의 경계가
            모호해지면서 오히려 스트레스를 유발하기도 한다. 사이버 보안 및
            데이터 보호 문제도 재택근무의 큰 과제로 남아 있다. 일부 기업은
            하이브리드 근무 형태를 도입하여 장단점을 조율하고 있다. 기술
            인프라와 커뮤니케이션 도구의 발전은 원격 협업을 점차 수월하게 만들고
            있다. 재택근무는 직무의 특성과 개인의 성향에 따라 효과가 달라질 수
            있다. 따라서 일률적인 정책보다는 유연한 제도 설계가 필요하다.
            결론적으로 재택근무는 미래 업무 환경의 중요한 축으로 자리 잡아가고
            있다. 재택근무는 코로나19 팬데믹을 계기로 빠르게 확산된 근무
            형태이다. 직원들은 출퇴근 시간이 사라지면서 더 많은 여유 시간을
            확보할 수 있게 되었다. 이는 워라밸(Work-Life Balance) 향상에
            긍정적인 영향을 주었다. 또한, 자율적인 시간 관리가 가능해져 개인의
            집중력이 오히려 높아지기도 한다. 기업 입장에서는 사무실 운영비용
            절감 등의 경제적 이점이 존재한다. 반면, 팀원 간의 소통이 부족해지며
            협업 효율이 낮아지는 경우도 있다. 물리적 거리감은 심리적 거리감으로
            이어져 조직 소속감을 약화시킬 수 있다. 특히 신입사원의 경우 적응이
            어렵고 피드백이 늦어 성장이 더뎌질 수 있다. 업무와 사생활의 경계가
            모호해지면서 오히려 스트레스를 유발하기도 한다. 사이버 보안 및
            데이터 보호 문제도 재택근무의 큰 과제로 남아 있다. 일부 기업은
            하이브리드 근무 형태를 도입하여 장단점을 조율하고 있다. 기술
            인프라와 커뮤니케이션 도구의 발전은 원격 협업을 점차 수월하게 만들고
            있다. 재택근무는 직무의 특성과 개인의 성향에 따라 효과가 달라질 수
            있다. 따라서 일률적인 정책보다는 유연한 제도 설계가 필요하다.
            결론적으로 재택근무는 미래 업무 환경의
          </p>

          {/* 하단 한번에 이동 버튼 */}
          <img
            src={godown}
            onClick={scrollToBottom}
            alt="최하단으로 이동"
            style={{
              position: "fixed",
              left: "25%",
              bottom: "50px",
              transform: "translateX(-50%)",
              zIndex: 999,
              cursor: "pointer",
              width: "50px", // 원하는 크기로
              height: "30px",
            }}
          />
        </div>
      </div>
      {/* 오른쪽 영역 */}
      <div
        style={{
          width: "50%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#ECEAD5",
        }}
      >
        <p>Meeting (회의) / Customer (고객) / Persuasive (설득형)</p>
        <div style={{ whiteSpace: "pre-wrap", lineHeight: "1.7" }}>
          <ReactMarkdown>{feedback}</ReactMarkdown>
        </div>
      </div>

      
      {/* 마우스 감지 영역 (얇게) */}
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          width: "20px", // 감지용 영역
          zIndex: 20,
        }}
      ></div>

      {/* 사이드바 실제 영역 */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          width: "200px",
          backgroundColor: "#00492C",
          color: "white",
          transform: hovered ? "translateX(0)" : "translateX(-200px)",
          transition: "transform 0.2s ease",
          padding: "20px",
          boxSizing: "border-box",
          zIndex: 15,
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          <li style={{ marginBottom: "16px" }}>홈</li>
          <li style={{ marginBottom: "16px" }}>코칭</li>
          <li>아카이브</li>
        </ul>
      </div>
    </div>
  );
}

export default Coach;
