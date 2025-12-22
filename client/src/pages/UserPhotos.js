import { useEffect, useState } from "react";
import { API } from "../api/axios";
import { Link } from "react-router-dom";

export default function UserPhotos() {
  const [photos, setPhotos] = useState([]);
  const [editing, setEditing] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [loading, setLoading] = useState(true);

  const loadPhotos = async () => {
    try {
      const res = await API.get("/photos/my");
      setPhotos(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPhotos();
  }, []);

  const deletePhoto = async (id) => {
    if (window.confirm("هل أنت متأكد من حذف هذه الصورة؟")) {
      await API.delete(`/photos/delete/${id}`);
      loadPhotos();
    }
  };

  const startEdit = (photo) => {
    setEditing(photo._id);
    setEditTitle(photo.title);
    setEditDescription(photo.description);
  };

  const saveEdit = async () => {
    await API.put(`/photos/update/${editing}`, {
      title: editTitle,
      description: editDescription,
    });
    setEditing(null);
    loadPhotos();
  };

  if (loading) return <div className="container"><h3>جاري تحميل صورك...</h3></div>;

  return (
    <div className="container">
      <h2>صوري الخاصة 📸</h2>
      {photos.length === 0 ? (
        <h3 style={{ textAlign: "center", color: "#94a3b8" }}>لم تقم برفع أي صور بعد.</h3>
      ) : (
        <div className="grid">
          {photos.map((p) => (
            <div key={p._id} className="card">
              {/* تعديل مسار الصورة هنا عشان يظهر صح */}
              <div className="card-img-wrapper">
                <img
                  src={"http://localhost:5000" + p.imageUrl}
                  alt={p.title}
                />
              </div>

              <div className="card-body">
                {editing === p._id ? (
                  <div className="edit-form">
                    <input
                      type="text"
                      className="form-input"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      placeholder="العنوان الجديد"
                    />
                    <textarea
                      className="form-input"
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      placeholder="الوصف الجديد"
                    />
                    <div style={{ display: "flex", gap: "10px" }}>
                      <button onClick={saveEdit} className="btn-primary" style={{ flex: 1, padding: "8px" }}>حفظ</button>
                      <button onClick={() => setEditing(null)} className="btn-secondary" style={{ flex: 1, padding: "8px" }}>إلغاء</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <Link to={`/photo/${p._id}`} style={{ textDecoration: 'none' }}>
                       <span className="card-title">{p.title}</span>
                    </Link>
                    <p className="card-description" style={{ fontSize: '0.9rem', marginBottom: '15px' }}>
                      {p.description.substring(0, 60)}...
                    </p>
                    <div className="card-footer">
                      <button onClick={() => startEdit(p)} className="btn-secondary" style={{ padding: "5px 15px", fontSize: "0.8rem" }}>
                        تعديل
                      </button>
                      <button onClick={() => deletePhoto(p._id)} className="btn-danger" style={{ padding: "5px 15px", fontSize: "0.8rem" }}>
                        حذف
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}