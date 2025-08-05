import { useState, useEffect } from "react";
import Load from "./load";
import Layout from "./Layout";
import Archive from "./archive";

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      {loading ? (
        <Load />
      ) : (
        <Layout>
          <Archive />
        </Layout>
      )}
    </div>
  );
}

export default App;