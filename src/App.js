import Load from "./load.js";
import Main from "./main.js";
import Login from "./login.js";
import Register from "./register.js";
import Forgot from "./forgot.js";
import Newpw from "./newpw.js";
import Select from "./select.js";
import Coach from "./coach.js";
import Upload from "./uploadFile.js";
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
      <Select />
      {/* <Coach /> */}
      {/* <Upload /> */}
    </div>
  );
}

export default App;
