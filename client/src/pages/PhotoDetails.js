import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { API } from "../api/axios";
import { AuthContext } from "../context/AuthContext";

export default function PhotoDetails() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);

  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchPhoto = async () => {
      try {
        const res = await API.get(`/photos/${id}`);
        setPhoto(res.data);
        if (user)
          setLiked(res.data.likedBy.some(id => id.toString() === user.id));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPhoto();
  }, [id, user]);

  const toggleLike = async () => {
    if (!user) return alert("يجب تسجيل الدخول للإعجاب!");
    try {
      const res = await API.post(`/photos/like/${id}`);
      setPhoto((prev) => ({
        ...prev,
        likes: res.data.likes,
        likedBy: res.data.likedBy
      }));
      setLiked(res.data.likedBy.some(id => id.toString() === user.id));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p>جاري التحميل...</p>;
  if (!photo) return <p>الصورة غير موجودة</p>;

  return (
    <div className="photo-details">
      <h2>{photo.title}</h2>
      <img
        src={"http://localhost:5000" + photo.imageUrl}
        alt={photo.title}
        onClick={() => setShowModal(true)}
        style={{ cursor: "pointer" }}
      />
      <p>{photo.description}</p>
      <p>عدد الإعجابات: {photo.likes}</p>
      {user && <button onClick={toggleLike}>{liked ? "إزالة الإعجاب" : "إعجاب"}</button>}

      {showModal && (
        <div className="modal" onClick={() => setShowModal(false)}>
          <img
            src={"http://localhost:5000" + photo.imageUrl}
            alt={photo.title}
            className="modal-img"
          />
        </div>
      )}
    </div>
  );
}
