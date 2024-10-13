import dotenv from "dotenv";
dotenv.config({ path: ".env" });

const config = {};
config.PORT = process.env.PORT ?? 8000;
config.MONGODB_URI = process.env.MONGODB_URI;
config.JWT_SECRET = process.env.JWT_SECRET;

export { config };
