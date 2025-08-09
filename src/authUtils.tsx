// 인증 관련 유틸리티 함수들

/** localStorage 기반 인증 상태 확인 (24시간 유효) */
export const checkAuthStatus = async (): Promise<boolean> => {
  try {
    const userEmail = localStorage.getItem("userEmail");
    const loginTime = localStorage.getItem("loginTime");

    if (!userEmail) {
      console.log("등록되지 않은 이메일 입니다");
      return false;
    }

    // 로그인 시간이 24시간 이내인지 확인
    if (loginTime) {
      const loginDate = new Date(loginTime);
      const now = new Date();
      const hoursDiff =
        (now.getTime() - loginDate.getTime()) / (1000 * 60 * 60);

      if (hoursDiff > 24) {
        console.warn("로그인 시간이 24시간을 초과했습니다.");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userNickname");
        localStorage.removeItem("loginTime");
        return false;
      }
    }

    return true; // localStorage에 유효한 정보가 있으면 인증됨으로 처리
  } catch (e) {
    // (Optional) SSR/프라이빗 모드 등에서 localStorage 접근 실패 대비
    console.error("인증 상태 확인 중 오류:", e);
    return false;
  }
};

/** 사용자 정보 저장 */
export const saveUserInfo = (email: string, nickname: string): void => {
  localStorage.setItem("userEmail", email);
  localStorage.setItem("userNickname", nickname);
  localStorage.setItem("loginTime", new Date().toISOString());
};

export interface StoredUserInfo {
  email: string | null;
  nickname: string | null;
  loginTime: string | null; // ISO string
}

/** 사용자 정보 가져오기 */
export const getUserInfo = (): StoredUserInfo => {
  return {
    email: localStorage.getItem("userEmail"),
    nickname: localStorage.getItem("userNickname"),
    loginTime: localStorage.getItem("loginTime"),
  };
};

/** 로그아웃 (사용자 정보 삭제) */
export const logout = (): void => {
  localStorage.removeItem("userEmail");
  localStorage.removeItem("userNickname");
  localStorage.removeItem("loginTime");
};
