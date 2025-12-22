import express from "express";
import { authenticateUser } from "../Middleware/auth.middlewares.js";
import upload from "../upload.js";
import {
  uploadPhoto,
  latestPhotos,
  likePhoto,
  myPhotos,
  updatePhoto,
  deletePhoto,
  getPhotoById
} from "../controllers/photoController.js";
import { asyncHandler } from "../config/helpers.js";
import { uploadPhotoValidator, updatePhotoValidator } from "../validator/photoValidator.js";
import { validateRequest } from "../Middleware/validation.middleware.js";

const router = express.Router();


router.post(
  "/upload",
  authenticateUser,
  upload.single("image"),
  uploadPhotoValidator,
  validateRequest,
  asyncHandler(uploadPhoto)
);


router.put(
  "/update/:id",
  authenticateUser,
  updatePhotoValidator,
  validateRequest,
  asyncHandler(updatePhoto)
);


router.delete("/delete/:id", authenticateUser, asyncHandler(deletePhoto));


router.post("/like/:id", authenticateUser, asyncHandler(likePhoto));


router.get("/latest", asyncHandler(latestPhotos));


router.get("/my", authenticateUser, asyncHandler(myPhotos));

router.get("/:id", asyncHandler(getPhotoById));

export default router;
