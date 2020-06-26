const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const User = require("../models/User");

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  //Create user
  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  //Create token
  const token = user.getSignedJwtToken();

  res.status(200).json({ succes: true, token });
});

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  //Validate email & password
  if (!email || !password) {
    return next(new ErrorResponse("Proszę podać email oraz hasło", 400));
  }

  //Check if user exists
  const user = await User.findOne({ email }).select("+password");

  //Check if email is in DB
  if (!user) {
    return next(
      new ErrorResponse(
        "Autoryzacja nie udała się - błędne hasło i/lub email.",
        401
      )
    );
  }

  //Check if password entered === password stored in DB (un-hashed)
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(
      new ErrorResponse(
        "Autoryzacja nie udała się - błędne hasło i/lub email.",
        401
      )
    );
  }

  //Create token
  const token = user.getSignedJwtToken();

  res.status(200).json({ succes: true, token });
});
