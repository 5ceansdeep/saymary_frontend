// App.tsx 수정본
import Load from "./mainpage/load";
import Main from "./mainpage/main";
import Login from "./login/login";
import Register from "./login/register";
import Forgot from "./login/forgot";
import Newpw from "./login/newpw";
import Select from "./coaching/select";
import Coach from "./coaching/coach";
import UploadFile from "./mainpage/uploadFile";
import Sidebar from "./mainpage/sideBar";
import Archive from "./archivepage/archive";
// import LoginState from "./mainpage/loginstate"

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* 기본 경로 - 로딩 페이지 (사이드바 없음) */}
          <Route path="/" element={<Load />} />

          {/* 인증 관련 라우트 (사이드바 없음) */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot" element={<Forgot />} />
          <Route path="/reset-password" element={<Newpw />} />

          {/* 메인 기능 라우트 (사이드바 있음) */}
          <Route
            path="/upload"
            element={
              <Sidebar>
                {/* <LoginState /> */}
                <UploadFile />
              </Sidebar>
            }
          />
          <Route
            path="/main"
            element={
              <Sidebar>
                {/* <LoginState /> */}
                <Main />
              </Sidebar>
            }
          />

          {/* 코칭 기능 라우트 (사이드바 있음) */}
          <Route
            path="/coaching"
            element={
              <Sidebar>
                {/* <LoginState /> */}
                <Select />
              </Sidebar>
            }
          />
          <Route
            path="/coaching/select"
            element={
              <Sidebar>
                {/* <LoginState /> */}
                <Select />
              </Sidebar>
            }
          />
          <Route path="/coaching/result" element={<Coach />} />

          {/* 아카이브 라우트 (사이드바 있음) */}
          <Route
            path="/archive"
            element={
              <Sidebar>
                {/* <LoginState /> */}
                <Archive />
              </Sidebar>
            }
          />

          {/* 잘못된 경로 처리 - 기본 페이지로 리다이렉트 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
