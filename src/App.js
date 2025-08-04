import Load from "./mainpage/load.js";
import Main from "./mainpage/main.js";
import Login from "./login/login.js";
import Register from "./login/register.js";
import Forgot from "./login/forgot.js";
import Newpw from "./login/newpw.js";
import Select from "./coaching/select.js";
import Coach from "./coaching/coach.js";
import UploadFile from "./mainpage/uploadFile.js";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

function App() {
  return (
    // <Router>
    //   <Routes>
    //     <Route path="/reset-password" element={<Newpw />} />
    //     {/* <Load />
    //   <Main /> */}
    //     {/* {/* <Login /> */}
    //     {/* <Register /> */}
    //     {/* <Forgot /> */}
    //   </Routes>
    // </Router>
    // <div>
    //   {/* <Register /> */}
    //   {/* <Forgot /> */}
    //   {/* <Login /> */}
    //   {/* <Select /> */}
    //   {/* <Coach /> */}
    //   {/* <Load /> */}
    //   {/* <Main /> */}
    //   {/* <Upload /> */}
    //   {/* <Archive /> */}
    //   {/* <Sidebar /> */}
    //   </div>
    <Router>
      <div className="App">
        <Routes>
          {/* 기본 경로 - 로딩 페이지 */}
          <Route path="/" element={<Load />} />

          {/* 파일 업로드 페이지 */}
          <Route path="/upload" element={<UploadFile />} />

          {/* 요약 결과 페이지 */}
          <Route path="/main" element={<Main />} />

          {/* 잘못된 경로 처리 - 기본 페이지로 리다이렉트 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
