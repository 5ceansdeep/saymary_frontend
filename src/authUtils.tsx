// 인증 관련 유틸리티 함수들

/** 세션/쿠키 기반 인증 상태 확인 */
export const checkAuthStatus = async (): Promise<boolean> => {
  try {
    const response = await fetch("https://api.saymary.site/api/user/me", {
      method: "GET",
      credentials: "include", // 쿠키 포함
    });

    if (response.ok) {
      const userData = await response.json();
      console.log("인증된 사용자:", userData);
      return true;
    } else {
      console.log("인증되지 않은 상태");
      return false;
    }
  } catch (e) {
    console.error("인증 상태 확인 중 오류:", e);
    return false;
  }
};

export interface UserInfo {
  email: string;
  nickname?: string;
  [key: string]: unknown;
}

/** 세션에서 사용자 정보 가져오기 */
export const getUserInfo = async (): Promise<UserInfo | null> => {
  try {
    const response = await fetch("https://api.saymary.site/api/user/me", {
      method: "GET",
      credentials: "include",
    });

    if (response.ok) {
      const userData = await response.json();
      return userData as UserInfo;
    } else {
      return null;
    }
  } catch (e) {
    console.error("사용자 정보 조회 중 오류:", e);
    return null;
  }
};

/** 로그아웃 (세션 종료) */
export const logout = async (): Promise<boolean> => {
  try {
    const response = await fetch("https://api.saymary.site/api/user/logout", {
      method: "POST",
      credentials: "include",
    });

    if (response.ok) {
      console.log("로그아웃 성공");
      return true;
    } else {
      console.error("로그아웃 실패:", response.status);
      return false;
    }
  } catch (e) {
    console.error("로그아웃 중 오류:", e);
    return false;
  }
};
