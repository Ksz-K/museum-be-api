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

//Prevent user from submitting more than one review per museum
ReviewSchema.index({ museum: 1, user: 1 }, { unique: true });

//Static method to get average rating of the museum
ReviewSchema.statics.getAverageRating = async function (museumId) {
  const obj = await this.aggregate([
    {
      $match: { museum: museumId },
    },
    {
      $group: {
        _id: "$museum",
        averageRating: { $avg: "$rating" },
      },
    },
  ]);
  try {
    await this.model("Museum").findByIdAndUpdate(museumId, {
      averageRating: obj[0].averageRating,
    });
  } catch (err) {
    console.error(err);
  }
};

//Call getAverageRating after save
ReviewSchema.post("save", function () {
  this.constructor.getAverageRating(this.museum);
});

//Call getAverageRating before remove
ReviewSchema.pre("remove", function () {
  this.constructor.getAverageRating(this.museum);
});

module.exports = mongoose.model("Review", ReviewSchema);
