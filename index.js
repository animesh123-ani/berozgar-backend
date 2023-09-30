const express = require("express");
const db = require("./db/db");
const dotenv = require("dotenv");
const cors = require("cors");
const app = express();
const { Router } = require("./routes/route");
const notesRouter = require("./routes/noteRoute");

const PORT = process.env.PORT || "3030";

app.use(express.json());

// Configure CORS to allow specific origins (e.g., http://localhost:3000)
const allowedOrigins = ["https://berozzgar-app.vercel.app"];
app.use(
  cors({
    origin: allowedOrigins,
  })
);

app.use("/api/v1", Router);
app.use("/api/v1", notesRouter);

// Start the server
app.listen(PORT, () => {
  db((isConnect) => {
    if (isConnect) {
      console.log(`Server is running on http://localhost:${PORT}`);
    } else {
      console.log("Server Can't Be Start...");
    }
  });
});
