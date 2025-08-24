import { configDotenv } from "dotenv";

export const config = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || "56342",
  JWT_SECRET: process.env.JWT_SECRET || "something_really_secret",
  MONGODB_URI: process.env.MONGODB_URI || "mongodb://localhost:27017",
};

export const LoadEnv = () => {
  if (config.NODE_ENV === "development") {
    return;
  }

  const file = ".env." + config.NODE_ENV;

  const output = configDotenv({
    path: file,
  });

  if (output.error) {
    throw Error(`error while loading config file for env: ${config.NODE_ENV}`);
  }
};
