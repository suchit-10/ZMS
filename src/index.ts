import express from "express";
import { LoadEnv, config } from "./config";
import apiRouter from "./routes";
import { connectToDatabase } from "./database/connection";
import cors from "cors"

const app = express();
LoadEnv();

app.use(cors())
app.use(express.json());
app.use('/api/v1', apiRouter);


const startServer = async () => {
  try {
    await connectToDatabase();
    
    const port = config.PORT;
    
    app.listen(port, () => {
      console.log(`🚀 Server started at port ${port}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();