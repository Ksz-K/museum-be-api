const mongoose = require("mongoose");
const slugify = require("slugify");
const geoCoder = require("../utils/geocoder");
const geocoder = require("../utils/geocoder");

const MuseumSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Proszę podać nazwę muzeum"],
    unique: true,
    trim: true,
    maxlength: [75, "Nazwa nie może przekroczyć 75 znaków"],
  },
  slug: String,
  description: {
    type: String,
    required: [true, "Proszę podać opis"],
    trim: true,
    maxlength: [1500, "Opis nie może przekroczyć 1500 znaków"],
  },
  website: {
    type: String,
    match: [
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
      "Proszę podać adres strony ropoczynając od HTTP lub HTTPS",
    ],
  },
  phone: {
    type: String,
    maxlength: [20, "Numer telefonu nie może przekroczyć 20 cyfr"],
  },
  email: {
    type: String,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Proszę podać poprawny adres email",
    ],
  },
  address: {
    type: String,
    required: [true, "Adres jest wymagany"],
  },
  location: {
    // GeoJSON Point
    type: {
      type: String,
      enum: ["Point"],
    },
    coordinates: {
      type: [Number],
      index: "2dsphere",
    },
    formattedAddress: String,
    street: String,
    city: String,
    state: String,
    zipcode: String,
    country: String,
  },
  averageRating: {
    type: Number,
    min: [1, "Ocena nie może być poniżej 1"],
    max: [10, "Maksymalna ocena to 10"],
  },
  photo: {
    type: String,
    default: "no-photo.jpg",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
},{
  toJSON:{virtuals:true},
  toObject:{virtuals:true}
});

//Create museum slug from the name
MuseumSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

//Geocode & creation field
MuseumSchema.pre("save", async function (next) {
  const loc = await geocoder.geocode(this.address);
  this.location = {
    type: "Point",
    coordinates: [loc[0].longitude, loc[0].latitude],
    formattedAddress: loc[0].formattedAddress,
    street: loc[0].streetName,
    city: loc[0].city,
    state: loc[0].stateCode,
    zipcode: loc[0].zipcode,
    country: loc[0].countryCode,
  };

  //Do not save address in DB
  this.address = undefined;
  next();
});

//Cascade delete expositions when museum is deleted
MuseumSchema.pre("remove", async function(next){
  console.log(`Expositions being removed from museum ${this._id}`)
await this.model("Exposition").deleteMany({museum:this._id})
next()
})

//virtuals - Reverse populate with virtuals
MuseumSchema.virtual("expositions",{
  ref:"Exposition",
  localField:"_id",
  foreignField:"museum",
  justOne:false
})
module.exports = mongoose.model("Museum", MuseumSchema);
