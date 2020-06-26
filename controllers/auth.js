const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const sendEmail = require("../utils/sendEmail");
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

  sendTokenResponse(user, 200, res);
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

  sendTokenResponse(user, 200, res);
});

// @desc    Get current logged in user
// @route   POST /api/v1/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    succes: true,
    data: user,
  });
});

// @desc    Forgot password
// @route   POST /api/v1/auth/forgotpassword
// @access  Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ErrorResponse("Błędny email", 404));
  }

  //Get reset token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  //Create rest url
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/resetPassword/${resetToken}`;

  const message = `Aby zresetować hasło należy użyć załączony link ${resetUrl} //wymagany jest PUT request// `;

  try {
    await sendEmail({
      email: user.email,
      subject: "Link do zresetowania hasła",
      message,
    });
    res.status(200).json({
      succes: true,
      msg: "Wysłano e-mail z linkiem do resetu hasła",
    });
  } catch (err) {}
  console.err(err);
  (user.getResetPasswordToken = undefined),
    (user.resetPasswordExpire = undefined);

  await user.save({ validateBeforeSave: false });
  return next(
    new ErrorResponse("Wystąpił problem z wysłaniem linku do resetu hasła", 500)
  );
});

//Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  //Create token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 86400 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }
  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({ success: true, token });
};
