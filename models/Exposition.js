const mongoose = require("mongoose");

const ExpositionSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, "Proszę podać tytuł wystawy"],
  },
  description: {
    type: String,
    required: [true, "Proszę podać opis wystawy"],
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
});

module.exports = mongoose.model("Exposition", ExpositionSchema);
