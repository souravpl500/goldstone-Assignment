const express = require("express");
const { connection } = require("./Configs/db");
const { userRouter } = require("./routes/user.routes");
require("dotenv").config();
const cors = require("cors");

const app = express();
app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome Home Page");
});

app.use("/user", userRouter);

app.listen(process.env.port, async () => {
  try {
    await connection;
    console.log("Connected to the DB");
  } catch (err) {
    console.log("Trouble connecting to the DB");
    console.log(err);
  }
  console.log(`Running at ${process.env.port} Port`);
});
