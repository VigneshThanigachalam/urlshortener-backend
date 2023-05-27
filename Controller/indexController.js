import { urlModel as Url } from '../Model/urlModel.js';


export const indexController = async (req, res) => {
  try {
    const { urlId } = req.params;
    const url = await Url.findOne({ urlId: urlId });
    if (url) {
      await Url.updateOne(
        {
          urlId: req.params.urlId,
        },
        { $inc: { clicks: 1 } }
      );
      return res.redirect(url.origUrl);
    } else res.status(404).json('Not found');
  } catch (err) {
    res.status(500).json('Server Error');
  }
}