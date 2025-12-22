import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav
      className="nav"
      style={{
        padding: "12px",
        background: "#222",
        color: "white",
        display: "flex",
        gap: "15px",
        alignItems: "center",
      }}
    >
      <Link to="/" style={{ color: "white", textDecoration: "none" }}>
        الصفحة الرئيسية
      </Link>

      {user ? (
        <>
          <Link to="/upload" style={{ color: "white", textDecoration: "none" }}>
            رفع صورة
          </Link>

          <Link
            to="/myphotos"
            style={{ color: "white", textDecoration: "none" }}
          >
            صوري
          </Link>

          <button
            type="button"
            onClick={logout}
            style={{
              background: "#ff2d55",
              color: "white",
              border: "none",
              padding: "8px 12px",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            تسجيل خروج
          </button>
        </>
      ) : (
        <>
          <Link to="/login" style={{ color: "white", textDecoration: "none" }}>
            تسجيل الدخول
          </Link>

          <Link
            to="/register"
            style={{ color: "white", textDecoration: "none" }}
          >
            إنشاء حساب
          </Link>
        </>
      )}
    </nav>
  );
}
