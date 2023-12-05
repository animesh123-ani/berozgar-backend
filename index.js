const express = require("express");
const db = require("./db/db");
const dotenv = require("dotenv");
const cors = require("cors");
const app = express();
const { Router } = require("./routes/route");
const hodRouter = require("./routes/hodRoute");
const notesRouter = require("./routes/noteRoute");

const PORT = process.env.PORT || "3030";

app.use(express.json());

// Configure CORS to allow specific origins (e.g., http://localhost:3000)
app.use(
  cors({
    origin: "*",
  })
);

app.use((req, res, next) => {
  res.setHeader[
    "Access-Control-Allow-Origin', 'https://berozgar-next.vercel.app"
  ];
  next();
});

app.use("/api/v1", Router);
app.use("/api/v1", notesRouter);
app.use("/api/v1", hodRouter);

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
