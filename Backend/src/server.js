import express from 'express';
import { ENV } from './lib/env.js'
import path from 'path'
import { fileURLToPath } from "url";
import { connectDB } from './lib/db.js';
import cors from 'cors'
import { serve } from "inngest/express";
import { inngest, functions } from "./src/inngest"


const app = express();

// ✅ Proper __dirname in ESM (since "type": "module" in backend/package.json)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//middleware
app.use(express.json());
//credential:true meaning?->it server allow a browser to include cookies on request
app.use(cors({origin:ENV.CLIENT_URL,credentials:true}));

app.use("/api/inngest", serve({ client: inngest, functions }));




app.get("/", (req, res) => {
  res.status(200).json({
    msg: "success from api2e2"
  })
});


// ----------------- SERVE FRONTEND IN PROD -----------------
// This runs when NODE_ENV = "production" (on Vercel)
if (ENV.NODE_ENV === "production") {
  // server.js is in backend/src -> go two levels up to project root, then frontend/dist
  const distPath = path.join(__dirname, "../../frontend/dist");

  app.use(express.static(distPath));

  // SPA fallback: any non-API route returns index.html
  // ❗ use "/*" not "/{*any}"
  app.get("/{*any}", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

const startServer = async () => {
  try {
    await connectDB();
    app.listen(ENV.PORT, () => {
      console.log("server is running on:" + ENV.PORT);
    })

  } catch (error) {
    console.error("Error to start server" + error);

  }
}
startServer();