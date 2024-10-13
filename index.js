import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import { config } from "./config/config.js";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import patientRecordRoutes from "./routes/patientRecord.routes.js";

const __dirname = path.resolve();
const app = express();

app.use(express.json());
app.use(cookieParser());
// Logger
import logger from "morgan"
app.use(logger("tiny"));
// all routes
app.use("/api/auth", authRoutes);
app.use("/api/patientRecords", patientRecordRoutes);

// bundle frontend code here
app.use(express.static(path.join(__dirname, "/client/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/client", "dist", "index.html"));
});

const PORT = config.PORT;

connectDB()
  .then((res) => {
    app.listen(PORT, () => {
      console.log(`Server is running on PORT : ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Error : ", err.message);
  });
