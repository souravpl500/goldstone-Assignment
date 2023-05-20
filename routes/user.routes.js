const express = require("express");
const { userModel } = require("../Models/user.model");
const CsvParser = require("json2csv").Parser;

const userRouter = express.Router();

userRouter.use(express.json());

userRouter.get("/", async (req, res) => {
  const query = req.query;
  try {
    const users = await userModel.find(query);
    res.send(users);
  } catch (error) {
    console.log(err);
    res.send({ err: "Something went wrong" });
  }
});

userRouter.get("/export", async (req, res) => {
  try {
    let users = [];
    const userData = await userModel.find({});
    userData.forEach((user) => {
      const { name, email, gender, status } = user;
      users.push({ name, email, gender, status });
    });
    const CsvFields = ["Name", "Email", "Gender", "Status"];
    const CsvParsers = new CsvParser({ CsvFields });
    const csvData = CsvParsers.parse(users);
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment: filename=usersData.csv");
    res.status(200).end(csvData);
  } catch (error) {
    console.log(error);
    res.send({ error: "Something went wrong" });
  }
});

userRouter.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const user = await userModel.findById({ _id: id });
    if (user) {
      res.status(200).json({
        success: true,
        user: user,
      });
    }
  } catch (err) {
    console.log({ err: err });
    res.status(400).send({ success: false, err: err });
  }
});

userRouter.post("/", async (req, res) => {
  const payload = req.body;
  try {
    const newUser = new userModel(payload);
    await newUser.save();
    res.status(201).json({ newUser, message: "New User successfully Added" });
  } catch (err) {
    console.log("err :", err);
    res.status(400).send({ msg: err });
  }
});

userRouter.put("/:id", async (req, res) => {
  const payload = req.body;
  const id = req.params.id;
  try {
    const user = await userModel.findByIdAndUpdate({ _id: id }, payload);
    res.status(204).send({
      success: true,
      msg: "Successfully Updated the user",
      users: user,
    });
    await user.save();
  } catch (err) {
    console.log({ err: err, msg: " user Update Error!" });
    res.send({ success: false, msg: " user Update Error!", err: err });
  }
});

module.exports = {
  userRouter,
};
