import { userModel as user } from "../Model/userModel.js";
import { urlModel as Url } from '../Model/urlModel.js';
import asyncHandler from "express-async-handler";
import { generateToken } from "../configure/jwToken.js";
import { validatemongodbId } from "../utils/validatemongodbId.js";
import { generaterrefreshToken } from "../configure/refreshToken.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import uniqid from "uniqid";
import { sendEmail } from "./emailController.js";

//  create user
export const createUser = asyncHandler(async (req, res) => {
  const email = req.body.email;
  const finduser = await user.find({ email: email });
  if (finduser.length == 0) {
    const newuser = await user.create(req.body);
    res.json({
      message: "successfully created",
    });
  } else {
    res.json({
      message: "user alerady exists",
    });
  }
});

//  login user
export const loginUserCtrl = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  // check if user exists or not
  const findUser = await user.findOne({ email });
  if (findUser != null) {
    if (findUser && (await findUser.isPasswordMatched(password))) {
      const refreshToken = await generaterrefreshToken(findUser?._id);
      const updateuser = await user.findByIdAndUpdate(
        findUser.id,
        {
          refreshToken: refreshToken,
        },
        { new: true }
      );
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        maxAge: 72 * 60 * 60 * 1000,
      });
      res.json({
        message: "successfully logged",
        token: refreshToken,
      });
    } else {
      res.json({
        message: "invalid crediential",
      });
    }
  } else {
    res.json({
      message: "no user found",
    });
  }
});

export const handlerefreshToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
  const refreshToken = cookie.refreshToken;
  const users = await user.findOne({ refreshToken });
  // res.json(uses);
  if (!users) throw new Error(" No Refresh token present in db or not matched");
  jwt.verify(refreshToken, process.env.jwt_secret, (err, decoded) => {
    if (err || users.id !== decoded.id) {
      throw new Error("There is something wrong with refresh token");
    }
    const accessToken = generateToken(users?._id);
    res.json({ accessToken });
  });
});

// logout function
export const logOut = asyncHandler(async (req, res) => {
  const refreshToken = req.headers.token;
  const users = await user.findOne({ refreshToken });
  await user.findOneAndUpdate({ refreshToke: refreshToken }, {
    refreshToken: "",
  });
  res.json({
    message: "successfully log-out",
  });
});

export const updatepassword = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { password } = req.body;
  validatemongodbId(_id);
  const user = await user.findById(_id);
  if (password) {
    user.password = password;
    const updatePassword = await user.save();
    res.json(updatePassword);
  } else {
    res.json(user);
  }
});

export const forgetPasswordtoken = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user_details = await user.findOne({ email });

  if (!user_details) {
    res.json({
      message: "you are not a registered user",
    });
  }
  try {
    const token = await user_details.createpasswordResetToken();
    await user_details.save();
    const appUrl = req.get("origin");
    const resetURL = `<a href="${appUrl}/reset-password/${token}">click here</a>`;
    const data = {
      to: email,
      subject: "Dress Color Sugesstion App - Reset Password Link",
      html: `Please ${resetURL} to create new password.`,
    };
    sendEmail(data);
    res.json({
      message: "mail sent",
    });
  } catch (err) {
    throw new Error(err);
  }
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { password, token } = req.body;
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const user_details = await user.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user_details) {
    res.json({
      message: "Token expired",
    });
  } else {
    user_details.password = password;
    user_details.passwordResetToken = undefined;
    user_details.passwordResetExpires = undefined;
    await user_details.save();
    res.json({
      message: "successfully updated",
    });
  }
});

export const validateToken = asyncHandler(async (req, res) => {
  try {
    res.json({
      token: "verified",
    });
  } catch (err) {
    throw new Error(err);
  }
});

export const savedCount = asyncHandler(async (req, res) => {
  const { email } = req.user;
  try {
    const finduser = await Url.find({ created_by: email });
    const count = finduser.length;
    res.json({
      addedUrl: count ? count : 0,
    });
  } catch (err) {
    throw new Error(err);
  }
});

export const getsavedUrl = asyncHandler(async (req, res) => {
  const { email } = req.user;
  try {
    const urlList = await Url.find({
      created_by: email
    });
    res.json({
      data: urlList,
    });
  } catch (err) {
    throw new Error(err);
  }
});
