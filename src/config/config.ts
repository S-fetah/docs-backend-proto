import dotenv from "dotenv";

dotenv.config();

interface Config {
  port: number;
  nodeEnv: string;
  dbPass: string | undefined;
  dbName: string | undefined;
}

const config: Config = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || "development",
  dbName: process.env.DB_NAME,
  dbPass: process.env.DB_PASS,
};

export default config;
