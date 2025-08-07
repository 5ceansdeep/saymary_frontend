// 인증 관련 유틸리티 함수들
export const checkAuthStatus = async () => {
  const userEmail = localStorage.getItem("userEmail");
  const loginTime = localStorage.getItem("loginTime");

  if (!userEmail) {
    return false;
  }

  // 로그인 시간이 24시간 이내인지 확인
  if (loginTime) {
    const loginDate = new Date(loginTime);
    const now = new Date();
    const hoursDiff = (now - loginDate) / (1000 * 60 * 60);

    if (hoursDiff > 24) {
      console.warn("로그인 시간이 24시간을 초과했습니다.");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("userNickname");
      localStorage.removeItem("loginTime");
      return false;
    }
  }

  return true; // localStorage에 유효한 정보가 있으면 인증됨으로 처리
};

// 사용자 정보 저장
export const saveUserInfo = (email, nickname) => {
  localStorage.setItem("userEmail", email);
  localStorage.setItem("userNickname", nickname);
  localStorage.setItem("loginTime", new Date().toISOString());
};

// 사용자 정보 가져오기
export const getUserInfo = () => {
  return {
    email: localStorage.getItem("userEmail"),
    nickname: localStorage.getItem("userNickname"),
    loginTime: localStorage.getItem("loginTime"),
  };
};

// 로그아웃 (사용자 정보 삭제)
export const logout = () => {
  localStorage.removeItem("userEmail");
  localStorage.removeItem("userNickname");
  localStorage.removeItem("loginTime");
};
