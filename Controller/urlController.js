import { nanoid } from 'nanoid';
import { urlModel as Url, urlModel } from '../Model/urlModel.js';
import { validateUrl } from "../utils/utils.js"
import asyncHandler from "express-async-handler";


export const urlController = asyncHandler(async (req, res) => {
  const { origUrl } = req.body;
  const { email } = req.user;
  const base = req.get("origin");
  // const base = req.headers.origin;

  const urlId = nanoid();
  if (validateUrl(origUrl)) {
    try {
      let url = await Url.findOne({ origUrl });
      if (url) {
        res.json({
          message: "alerdy added"
        });
      } else {
        const shortUrl = `${base}/${urlId}`;

        url = await Url.create({
          origUrl,
          urlId,
          date: new Date(),
          created_by: email
        });

        // await url.save();
        res.json({
          message: "successfully Trimmed"
        });
      }
    } catch (err) {
      res.status(500).json('Server Error');
    }
  } else {
    res.status(400).json('Invalid Original Url');
  }
});