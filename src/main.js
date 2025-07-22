import { useEffect, useState, useRef } from "react";
import "./main.css";
import godown from "./img/godown.png";

function Main() {
  const [animate1, setAnimate1] = useState(false);
  useEffect(() => {
    // 3.8초 후 노란 박스 애니메이션 시작
    const timer = setTimeout(() => {
      setAnimate1(true);
    }, 3800);

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

  return (
    <div
      /* 노란 박스 : animate1 */
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
        overflowY: "auto", // 스크롤 가능, 스크롤바는 index.css에서 설정
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
        {new Date().toLocaleString()} {/* 생성된 (현재) 날짜와 시간 표시 */}
      </h2>
      {/* 요약 텍스트 본문 */}
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
        직원들은 출퇴근 시간이 사라지면서 더 많은 여유 시간을 확보할 수 있게
        되었다. 이는 워라밸(Work-Life Balance) 향상에 긍정적인 영향을 주었다.
        또한, 자율적인 시간 관리가 가능해져 개인의 집중력이 오히려 높아지기도
        한다. 기업 입장에서는 사무실 운영비용 절감 등의 경제적 이점이 존재한다.
        반면, 팀원 간의 소통이 부족해지며 협업 효율이 낮아지는 경우도 있다.
        물리적 거리감은 심리적 거리감으로 이어져 조직 소속감을 약화시킬 수 있다.
        특히 신입사원의 경우 적응이 어렵고 피드백이 늦어 성장이 더뎌질 수 있다.
        업무와 사생활의 경계가 모호해지면서 오히려 스트레스를 유발하기도 한다.
        사이버 보안 및 데이터 보호 문제도 재택근무의 큰 과제로 남아 있다. 일부
        기업은 하이브리드 근무 형태를 도입하여 장단점을 조율하고 있다. 기술
        인프라와 커뮤니케이션 도구의 발전은 원격 협업을 점차 수월하게 만들고
        있다. 재택근무는 직무의 특성과 개인의 성향에 따라 효과가 달라질 수 있다.
        따라서 일률적인 정책보다는 유연한 제도 설계가 필요하다. 결론적으로
        재택근무는 미래 업무 환경의 중요한 축으로 자리 잡아가고 있다. 재택근무는
        코로나19 팬데믹을 계기로 빠르게 확산된 근무 형태이다. 직원들은 출퇴근
        시간이 사라지면서 더 많은 여유 시간을 확보할 수 있게 되었다. 이는
        워라밸(Work-Life Balance) 향상에 긍정적인 영향을 주었다. 또한, 자율적인
        시간 관리가 가능해져 개인의 집중력이 오히려 높아지기도 한다. 기업
        입장에서는 사무실 운영비용 절감 등의 경제적 이점이 존재한다. 반면, 팀원
        간의 소통이 부족해지며 협업 효율이 낮아지는 경우도 있다. 물리적 거리감은
        심리적 거리감으로 이어져 조직 소속감을 약화시킬 수 있다. 특히 신입사원의
        경우 적응이 어렵고 피드백이 늦어 성장이 더뎌질 수 있다. 업무와 사생활의
        경계가 모호해지면서 오히려 스트레스를 유발하기도 한다. 사이버 보안 및
        데이터 보호 문제도 재택근무의 큰 과제로 남아 있다. 일부 기업은
        하이브리드 근무 형태를 도입하여 장단점을 조율하고 있다. 기술 인프라와
        커뮤니케이션 도구의 발전은 원격 협업을 점차 수월하게 만들고 있다.
        재택근무는 직무의 특성과 개인의 성향에 따라 효과가 달라질 수 있다.
        따라서 일률적인 정책보다는 유연한 제도 설계가 필요하다. 결론적으로
        재택근무는 미래 업무 환경의 중요한 축으로 자리 잡아가고 있다. 재택근무는
        코로나19 팬데믹을 계기로 빠르게 확산된 근무 형태이다. 직원들은 출퇴근
        시간이 사라지면서 더 많은 여유 시간을 확보할 수 있게 되었다. 이는
        워라밸(Work-Life Balance) 향상에 긍정적인 영향을 주었다. 또한, 자율적인
        시간 관리가 가능해져 개인의 집중력이 오히려 높아지기도 한다. 기업
        입장에서는 사무실 운영비용 절감 등의 경제적 이점이 존재한다. 반면, 팀원
        간의 소통이 부족해지며 협업 효율이 낮아지는 경우도 있다. 물리적 거리감은
        심리적 거리감으로 이어져 조직 소속감을 약화시킬 수 있다. 특히 신입사원의
        경우 적응이 어렵고 피드백이 늦어 성장이 더뎌질 수 있다. 업무와 사생활의
        경계가 모호해지면서 오히려 스트레스를 유발하기도 한다. 사이버 보안 및
        데이터 보호 문제도 재택근무의 큰 과제로 남아 있다. 일부 기업은
        하이브리드 근무 형태를 도입하여 장단점을 조율하고 있다. 기술 인프라와
        커뮤니케이션 도구의 발전은 원격 협업을 점차 수월하게 만들고 있다.
        재택근무는 직무의 특성과 개인의 성향에 따라 효과가 달라질 수 있다.
        따라서 일률적인 정책보다는 유연한 제도 설계가 필요하다. 결론적으로
        재택근무는 미래 업무 환경의 중요한 축으로 자리 잡아가고 있다. 결론적으로
        재택근무는 미래 업무 환경의 중요한 축으로 자리 잡아가고 있다. 결론적으로
        재택근무는 미래 업무 환경의 중요한 축으로 자리 잡아가고 있다. 결론적으로
        재택근무는 미래 업무 환경의 중요한 축으로 자리 잡아가고 있다. 결론적으로
        재택근무는 미래 업무 환경의 중요한 축으로 자리 잡아가고 있다. 결론적으로
        재택근무는 미래 업무 환경의 중요한 축으로 자리 잡아가고 있다. 결론적으로
        재택근무는 미래 업무 환경의 중요한 축으로 자리 잡아가고 있다. 결론적으로
        재택근무는 미래 업무 환경의 중요한 축으로 자리 잡아가고 있다. 결론적으로
        재택근무는 미래 업무 환경의 중요한 축으로 자리 잡아가고 있다. 결론적으로
        재택근무는 미래 업무 환경의 중요한 축으로 자리 잡아가고 있다. 결론적으로
        재택근무는 미래 업무 환경의 중요한 축으로 자리 잡아가고 있다. 결론적으로
        재택근무는 미래 업무 환경의 중요한 축으로 자리 잡아가고 있다. 결론적으로
        재택근무는 미래 업무 환경의 중요한 축으로 자리 잡아가고 있다. 결론적으로
        재택근무는 미래 업무 환경의 중요한 축으로 자리 잡아가고 있다. 결론적으로
        재택근무는 미래 업무 환경의 중요한 축으로 자리 잡아가고 있다. 결론적으로
        재택근무는 미래 업무 환경의 중요한 축으로 자리 잡아가고 있다. 결론적으로
        재택근무는 미래 업무 환경의 중요한 축으로 자리 잡아가고 있다. 결론적으로
        재택근무는 미래 업무 환경의 중요한 축으로 자리 잡아가고 있다. 결론적으로
        재택근무는 미래 업무 환경의 중요한 축으로 자리 잡아가고 있다.
        {/* 값을 어떻게 받아오지 */}
      </p>

      {/* 하단 한번에 이동 버튼 */}
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
          width: "50px", // 원하는 크기로
          height: "30px",
        }}
      />
    </div>
  );
}

export default Main;
