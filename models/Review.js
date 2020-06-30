const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, "Proszę podać nagłówek opinii"],
    maxlength: 150,
  },
  text: {
    type: String,
    required: [true, "Opinia nie może być pusta"],
  },
  rating: {
    type: Number,
    min: 1,
    max: 10,
    required: [true, "Ocena musi być w skali od 1 do 10"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  museum: {
    type: mongoose.Schema.ObjectId,
    ref: "Museum",
    required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Review", ReviewSchema);
