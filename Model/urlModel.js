import mongoose from 'mongoose';

const UrlSchema = new mongoose.Schema({
  urlId: {
    type: String,
    required: true,
  },
  origUrl: {
    type: String,
    required: true,
  },
  clicks: {
    type: Number,
    required: true,
    default: 0,
  },
  date: {
    type: String,
    default: Date.now,
  },
  created_by: {
    type: String,
    required: true
  }
});

export const urlModel = mongoose.model('Url', UrlSchema);
