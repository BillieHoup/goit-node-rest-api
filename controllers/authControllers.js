import "dotenv/config";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Jimp from "jimp";
import gravatar from "gravatar";
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import controllerWrapper from "../helpers/controllerWrapper.js";
import HttpError from "../helpers/HttpError.js";
import User from "../models/users.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const avatarsPath = path.join(__dirname, "../", "public", "avatars");

export const register = controllerWrapper(async (req, res, next) => {
  const { email, password } = req.body;
  const emailInLowerCase = email.toLowerCase();

  const user = await User.findOne({ email: emailInLowerCase });

  if (user) {
    throw HttpError(409, "Email in use");
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email, { s: "250", r: "pg", d: "mm" }, true);

  const newUser = await User.create({
    email: emailInLowerCase,
    password: passwordHash,
    avatarURL,
  });

  res.status(201).json({
    user: {
      email,
      subscription: newUser.subscription,
      avatarURL,
    },
  });
});

export const login = controllerWrapper(async (req, res, next) => {
  const { email, password } = req.body;
  const { JWT_SECRET } = process.env;
  const emailInLowerCase = email.toLowerCase();

  const user = await User.findOne({ email: emailInLowerCase });

  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw HttpError(401, "Email or password is wrong");
  }

  const token = jwt.sign({ id: user._id }, JWT_SECRET, {
    expiresIn: 60 * 60,
  });

  await User.findByIdAndUpdate(user._id, { token });
  res.status(200).json({
    token,
    user: {
      email,
      subscription: user.subscription,
    },
  });
});

export const getCurrent = controllerWrapper(async (req, res, next) => {
  const { email, subscription } = req.user;

  res.json({ email, subscription });
});

export const logout = controllerWrapper(async (req, res) => {
  const { id } = req.user;

  await User.findByIdAndUpdate(id, { token: "" });
  res.status(204).end();
});

export const updateSubscription = controllerWrapper(async (req, res, next) => {
  const { id } = req.user;
  const { subscription } = req.body;

  const updatedUser = await User.findByIdAndUpdate(
    id,
    { subscription },
    { new: true }
  );

  if (!updatedUser) {
    throw HttpError(404);
  }

  res
    .status(200)
    .json({ email: updatedUser.email, subscription: updatedUser.subscription });
});

export const updateAvatar = controllerWrapper(async (req, res) => {
  if (!req.user) {
    throw HttpError(401, "Not authorized");
  }

  if (!req.file) {
    throw HttpError(400, "File not provided");
  }

  const { _id } = req.user;
  const { path: tempUpload, originalname } = req.file;
  const fileName = `${_id}_${originalname}`;
  const resultUpload = path.join(avatarsPath, fileName);

  await fs.rename(tempUpload, resultUpload);

  const image = await Jimp.read(resultUpload);
  await image.resize(250, 250).writeAsync(resultUpload);

  const avatarURL = `/avatars/${fileName}`;
  await User.findByIdAndUpdate(_id, { avatarURL });

  res.json({ avatarURL });
});
