const fs = require("fs");
const mongoose = require("mongoose");
const colors = require("colors");
const dotenv = require("dotenv");

//Load env vars
dotenv.config({ path: "./config/config.env" });

//Load models
const Museum = require("./models/Museum");
const Exposition = require("./models/Exposition");
const User = require("./models/User");

//Connect to DB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

//Read JSON files
const museums = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/museums.json`, "utf-8")
);

const expositions = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/expositions.json`, "utf-8")
);

const users = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/users.json`, "utf-8")
);

//Import into DB
const importData = async () => {
  try {
    await Museum.create(museums);
    await Exposition.create(expositions);
    await User.create(users);

    console.log("Data imported...".green.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

//Delete data
const deleteData = async () => {
  try {
    await Museum.deleteMany();
    await Exposition.deleteMany();
    await User.deleteMany();

    console.log("Data deleted...".red.bold);
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

if (process.argv[2] === "-i") {
  importData();
} else if (process.argv[2] === "-d") {
  deleteData();
}
