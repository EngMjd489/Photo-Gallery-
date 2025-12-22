import { useState, useContext } from "react";
import { API } from "../api/axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });
  const [err, setErr] = useState("");

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      return setErr("يرجى ملء جميع الحقول");
    }

    try {
      const res = await API.post("/auth/login", {
        email: form.email,
        password: form.password
      });

      login(res.data.token, res.data.user);
      navigate("/");
    } catch (error) {
      const data = error.response?.data;
      if (data?.errors) {
        setErr(data.errors.map(e => e.msg).join(', '));
      } else {
        setErr(data?.msg || "حدث خطأ غير متوقع");
      }
    }
  };

  return (
    <div className="auth-container">
      <h2>تسجيل الدخول</h2>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          name="email"
          placeholder="البريد الإلكتروني"
          value={form.email}
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="كلمة المرور"
          value={form.password}
          onChange={handleChange}
        />

        {err && <p className="error">{err}</p>}

        <button type="submit">دخول</button>
      </form>
    </div>
  );
}
