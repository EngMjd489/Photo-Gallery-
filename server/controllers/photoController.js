import Photo from "../models/Photo.js";
import mongoose from "mongoose";

// رفع صورة
export const uploadPhoto = async (req, res) => {
  const photo = await Photo.create({
    title: req.body.title,
    description: req.body.description,
    imageUrl: "/uploads/" + req.file.filename,
    user: req.user.id
  });
  res.json(photo);
};

// عرض أحدث الصور
export const latestPhotos = async (req, res) => {
  const photos = await Photo.find().sort({ createdAt: -1 });
  res.json(photos);
};

// الإعجاب بصورة
export const likePhoto = async (req, res) => {
  const photo = await Photo.findById(req.params.id);
  const userId = new mongoose.Types.ObjectId(req.user.id);
  const index = photo.likedBy.indexOf(userId);
  if (index > -1) {
    // إزالة الإعجاب
    photo.likedBy.splice(index, 1);
  } else {
    // إضافة إعجاب
    photo.likedBy.push(userId);
  }
  await photo.save();
  res.json({ likes: photo.likedBy.length, likedBy: photo.likedBy });
};

// الصور الخاصة بالمستخدم
export const myPhotos = async (req, res) => {
  const photos = await Photo.find({ user: req.user.id });
  res.json(photos);
};

// تعديل صورة
export const updatePhoto = async (req, res) => {
  const updated = await Photo.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    { title: req.body.title, description: req.body.description },
    { new: true }
  );
  res.json(updated);
};

// حذف صورة
export const deletePhoto = async (req, res) => {
  await Photo.findOneAndDelete({ _id: req.params.id, user: req.user.id });
  res.json({ msg: "Deleted" });
};

export const getPhotoById = async (req, res) => {
  const photo = await Photo.findById(req.params.id).populate("user", "name email");
  if (!photo) return res.status(404).json({ msg: "Photo not found" });

  res.json({
    id: photo._id,
    title: photo.title,
    description: photo.description,
    imageUrl: photo.imageUrl,
    likes: photo.likedBy.length,
    likedBy: photo.likedBy,
    user: photo.user,
    createdAt: photo.createdAt,
    updatedAt: photo.updatedAt
  });
};
