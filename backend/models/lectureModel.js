import mongoose from "mongoose";

const lectureSchema = new mongoose.Schema({
  lectureTitle: {
    type: String,
    required: true
  },
  videoUrl: {
    type: String
  },
  videoType: {
    type: String,
    enum: ['upload', 'youtube'],
    default: 'upload'
  },
  youtubeUrl: {
    type: String
  },
  youtubeVideoId: {
    type: String
  },
  youtubeChannelName: {
    type: String
  },
  isPreviewFree: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

const Lecture = mongoose.model("Lecture", lectureSchema);

export default Lecture;