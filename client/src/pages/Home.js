import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { API } from "../api/axios";
import { AuthContext } from "../context/AuthContext";

export default function Home() {
  const { user } = useContext(AuthContext);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const res = await API.get("/photos/latest");
        setPhotos(res.data);
      } catch (error) {
        setErr("حدث خطأ أثناء تحميل الصور");
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
  }, []);

  const handleLike = async (id) => {
    if (!user) return alert("يجب تسجيل الدخول للإعجاب!");
    try {
      const res = await API.post(`/photos/like/${id}`);
      setPhotos((prev) =>
        prev.map((p) =>
          p._id === id ? { ...p, likes: res.data.likes, likedBy: res.data.likedBy } : p
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <h3>جاري التحميل...</h3>;
  if (err) return <h3>{err}</h3>;
  if (photos.length === 0) return <h3>لا توجد صور بعد.</h3>;

  return (
    <div className="container">
      <h2>أحدث الصور</h2>
      <div className="grid">
        {photos.map((p) => (
          <div key={p._id} className="card">
            <Link to={`/photo/${p._id}`} style={{ textDecoration: "none", color: "inherit" }}>
              <img src={"http://localhost:5000" + p.imageUrl} alt={p.title} />
              <p>{p.title}</p>
            </Link>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <small>عدد الإعجابات: {p.likes}</small>
              {user && <button onClick={() => handleLike(p._id)}>إعجاب</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
