import Load from "./mainpage/load.js";
import Main from "./mainpage/main.js";
import Login from "./login/login.js";
import Register from "./login/register.js";
import Forgot from "./login/forgot.js";
import Newpw from "./login/newpw.js";
import Select from "./coaching/select.js";
import Coach from "./coaching/coach.js";
import Upload from "./mainpage/uploadFile.js";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

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
    <div>
      {/* <Register /> */}
      {/* <Forgot /> */}
      {/* <Login /> */}
      {/* <Select /> */}
      {/* <Coach /> */}
      {/* <Load /> */}
      <Main />
      {/* <Upload /> */}
      {/* <Archive /> */}
      {/* <Sidebar /> */}
      </div>
  );
}

export default App;
