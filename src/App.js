import './App.css';
import Load from "./load.js";
import Main from "./main.js";
import Login from "./login.js";
import SideMenu from "./sideMenu.js";
import { BrowserRouter } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <div>
        {/* <Load />
        <Main /> */}
        {/* <Login /> */}
        <SideMenu />
      </div>
    </BrowserRouter>
  );
}

export default App;