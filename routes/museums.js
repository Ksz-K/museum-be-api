const express = require("express");
const {
  getMuseum,
  getMuseums,
  createMuseum,
  updateMuseum,
  deleteMuseum,
  getMuseumsInRadius,
  museumPhotoUpload,
} = require("../controllers/museums");

//Include other resource routers
const expositionRouter = require("./expositions");

const router = express.Router();

//Re-route into other resource routers
router.use("/:museumId/expositions", expositionRouter);

router.route("/radius/:coordinates/:distance").get(getMuseumsInRadius);

router.route("/:id/photo").put(museumPhotoUpload);

router.route("/").get(getMuseums).post(createMuseum);

router.route("/:id").get(getMuseum).put(updateMuseum).delete(deleteMuseum);

module.exports = router;
