const express = require("express");
const db = require("./db/db");
const dotenv = require("dotenv");
const cors = require("cors");
const app = express();
const { Router } = require("./routes/route");
const notesRouter = require("./routes/noteRoute");

const PORT = process.env.PORT || "3030";

app.use(express.json());
app.use(cors());

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
