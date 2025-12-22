import { body } from "express-validator";

// التحقق من بيانات رفع الصورة
export const uploadPhotoValidator = [
  body("title")
    .notEmpty()
    .withMessage("عنوان الصورة مطلوب"),
  body("description")
    .notEmpty()
    .withMessage("وصف الصورة مطلوب")
];

// التحقق من بيانات تعديل الصورة
export const updatePhotoValidator = [
  body("title")
    .notEmpty()
    .withMessage("عنوان الصورة مطلوب"),
  body("description")
    .notEmpty()
    .withMessage("وصف الصورة مطلوب")
];
