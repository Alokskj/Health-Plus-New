import express from "express";
import multer from "multer";
import {
  createPatientRecord,
  deletePatientRecord,
  editPatientRecord,
  exportPatientRecords,
  getAllPatientRecords,
  uploadPatientRecords,
} from "../controllers/patientRecord.controllers.js";
import { checkRole, protectRoute } from "../middlewares/auth.middlewares.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.get("/", protectRoute, getAllPatientRecords);
router.post("/create", protectRoute, createPatientRecord);
router.post("/upload", protectRoute, upload.single("file"), uploadPatientRecords);
router.get("/export", protectRoute, exportPatientRecords);
router.put("/edit/:id", protectRoute, checkRole(['admin']), editPatientRecord);
router.delete("/delete/:id", protectRoute, checkRole(['admin']), deletePatientRecord);

export default router;
