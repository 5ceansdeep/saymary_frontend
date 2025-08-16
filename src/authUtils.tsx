// 인증 관련 유틸리티 함수들

export interface UserInfo {
  email: string;
  nickname?: string;
  [key: string]: unknown;
}


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
