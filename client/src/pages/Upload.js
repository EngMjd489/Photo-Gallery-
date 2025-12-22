import { useState } from "react";
import { API } from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Upload() {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [image, setImage] = useState(null);

  const navigate = useNavigate();

  const upload = async (e) => {
    e.preventDefault();

    if (!image) {
      alert("يجب اختيار صورة");
      return;
    }

    const form = new FormData();
    form.append("title", title);
    form.append("description", desc);
    form.append("image", image);

    try {
      await API.post("/photos/upload", form, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: "Bearer " + localStorage.getItem("token")
        }
      });

      navigate("/");
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.msg || "حدث خطأ أثناء رفع الصورة");
    }
  };

  return (
    <div className="container">
      <h2>رفع صورة جديدة</h2>

      <form onSubmit={upload}>
        <input
          placeholder="العنوان"
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="الوصف"
          onChange={(e) => setDesc(e.target.value)}
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />

        <button>رفع</button>
      </form>
    </div>
  );
}

