import { generateJWTToken_email, generateJWTToken_username } from "../utils/generateJWTToken.js";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "../models/user.model.js";
import { UnRegisteredUser } from "../models/unRegisteredUser.model.js";
import dotenv from "dotenv";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

dotenv.config();

// ================= GOOGLE STRATEGY ================= //
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL, // FIXED
    },
    async (accessToken, refreshToken, profile, done) => {
      done(null, profile);
    }
  )
);

// ================= GOOGLE AUTH HANDLER ================= //
export const googleAuthHandler = passport.authenticate("google", {
  scope: ["profile", "email"],
});

// ================= GOOGLE AUTH CALLBACK ================= //
export const googleAuthCallback = passport.authenticate("google", {
  failureRedirect: "https://skill-barter-two.vercel.app/login", // FIXED
  session: false,
});

// ================= HANDLE GOOGLE LOGIN SUCCESS ================= //
export const handleGoogleLoginCallback = asyncHandler(async (req, res) => {
  console.log("\n******** Inside handleGoogleLoginCallback function ********");

  const email = req.user._json.email;
  const name = req.user._json.name;
  const picture = req.user._json.picture;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    const jwtToken = generateJWTToken_username(existingUser);
    const expiryDate = new Date(Date.now() + 1 * 60 * 60 * 1000);

    res.cookie("accessToken", jwtToken, {
      httpOnly: true,
      expires: expiryDate,
      secure: true, // Important for production HTTPS
    });

    return res.redirect("https://skill-barter-two.vercel.app/discover"); // FIXED
  }

  let unregisteredUser = await UnRegisteredUser.findOne({ email });

  if (!unregisteredUser) {
    console.log("Creating new Unregistered User");
    unregisteredUser = await UnRegisteredUser.create({
      name,
      email,
      picture,
    });
  }

  const jwtToken = generateJWTToken_email(unregisteredUser);
  const expiryDate = new Date(Date.now() + 0.5 * 60 * 60 * 1000);

  res.cookie("accessTokenRegistration", jwtToken, {
    httpOnly: true,
    expires: expiryDate,
    secure: true,
  });

  return res.redirect("https://skill-barter-two.vercel.app/register"); // FIXED
});

// ================= USER LOGOUT ================= //
export const handleLogout = asyncHandler(async (req, res) => {
  console.log("\n******** Inside handleLogout function ********");
  res.clearCookie("accessToken");
  res.clearCookie("accessTokenRegistration");
  return res.status(200).json(new ApiResponse(200, null, "User logged out successfully"));
});
