const express = require("express");
const {
  getExpositions,
  getExposition,
  addExposition,
  updateExposition,
  deleteExposition,
} = require("../controllers/expositions");

const router = express.Router({ mergeParams: true });

router.route("/").get(getExpositions).post(addExposition);
router
  .route("/:id")
  .get(getExposition)
  .put(updateExposition)
  .delete(deleteExposition);
module.exports = router;
