import { useState, useContext } from "react";
import { API } from "../api/axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [errors, setErrors] = useState({});
  const [errMsg, setErrMsg] = useState("");

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrors({});
    setErrMsg("");

    // تحقق من الحقول قبل الإرسال
    const tempErrors = {};
    if (!form.name) tempErrors.name = "يرجى إدخال الاسم";
    if (!form.email) tempErrors.email = "يرجى إدخال البريد الإلكتروني";
    if (!form.password) tempErrors.password = "يرجى إدخال كلمة المرور";
    if (!form.confirmPassword) tempErrors.confirmPassword = "يرجى تأكيد كلمة المرور";
    if (form.password && form.confirmPassword && form.password !== form.confirmPassword)
      tempErrors.confirmPassword = "كلمتا المرور غير متطابقتين";

    if (Object.keys(tempErrors).length > 0) {
      setErrors(tempErrors);
      return;
    }

    try {
      console.log("Sending Register Payload:", form); // لمراقبة البيانات

      const res = await API.post("/auth/register", form);

      console.log("Register Response:", res.data); // لمراقبة الرد

      login(res.data.token, res.data.user);
      navigate("/");
    } catch (error) {
      console.error("Register Error:", error.response?.data);

      const serverError = error.response?.data?.errors
        ? Object.fromEntries(error.response.data.errors.map(e => [e.path, e.msg]))
        : {};
      setErrors(serverError);

      if (!Object.keys(serverError).length)
        setErrMsg(error.response?.data?.msg || "حدث خطأ غير متوقع");
    }
  };

  return (
    <div className="auth-container">
      <h2>إنشاء حساب</h2>

      <form onSubmit={handleRegister}>
        <input
          name="name"
          placeholder="الاسم"
          value={form.name}
          onChange={handleChange}
        />
        {errors.name && <p className="error">{errors.name}</p>}

        <input
          name="email"
          type="email"
          placeholder="البريد الإلكتروني"
          value={form.email}
          onChange={handleChange}
        />
        {errors.email && <p className="error">{errors.email}</p>}

        <input
          name="password"
          type="password"
          placeholder="كلمة المرور"
          value={form.password}
          onChange={handleChange}
        />
        {errors.password && <p className="error">{errors.password}</p>}

        <input
          name="confirmPassword"
          type="password"
          placeholder="تأكيد كلمة المرور"
          value={form.confirmPassword}
          onChange={handleChange}
        />
        {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}

        {errMsg && <p className="error">{errMsg}</p>}

        <button type="submit">إنشاء حساب</button>
      </form>
    </div>
  );
}
