import dotenv from "dotenv";

dotenv.config();

interface Config {
  port: number;
  appUrl: string;
  nodeEnv: string;
}

const config: Config = {
  port: Number(process.env.PORT) || 5000,
  appUrl: process.env.APP_URL || "http://localhost:3000",
  nodeEnv: process.env.NODE_ENV || "development",
};

export default config;
