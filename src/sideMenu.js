import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();

  const baseLinkStyle = {
    padding: "8px 16px",
    borderRadius: "4px",
    textDecoration: "none",
    display: "block",
  };

  const activeStyle = {
    ...baseLinkStyle,
    backgroundColor: "#1f2937", // gray-800
    color: "white",
  };

  const inactiveStyle = {
    ...baseLinkStyle,
    color: "#374151", // gray-700
    backgroundColor: "transparent",
  };

  return (
    <div
      style={{
        width: "160px",
        height: "100vh",
        backgroundColor: "#f3f4f6", // gray-100
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        padding: "16px",
        gap: "24px",
      }}
    >
      <Link
        to="/"
        style={location.pathname === "/" ? activeStyle : inactiveStyle}
      >
        Home
      </Link>
      <Link
        to="/archive"
        style={location.pathname === "/archive" ? activeStyle : inactiveStyle}
      >
        Archive
      </Link>
      <Link
        to="/account"
        style={location.pathname === "/account" ? activeStyle : inactiveStyle}
      >
        Account
      </Link>
    </div>
  );
};

export default Sidebar;