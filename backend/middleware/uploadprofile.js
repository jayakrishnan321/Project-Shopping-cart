// middleware/uploadProfile.js
const multer = require("multer");
const path = require("path");

const profileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "profile/"); // For admin profile images
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const uploadProfile = multer({ storage: profileStorage });
module.exports = uploadProfile;
