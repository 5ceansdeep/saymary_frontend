import { useState, useEffect } from "react";
import Load from "./load.js";
import Main from "./main.js";
// import Login from "./login.js";

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3800); // Load.js에서 애니메이션이 끝나는 시간과 동일하게 설정
    return () => clearTimeout(timer);
  }, []);

   return (
    <div>
      <Load />
      {!loading && <Main />}
      {/* <Login /> */}
    </div>
  );
}

export default App;