const multer = require("multer");
const storage = multer.memoryStorage(); // Use memoryStorage to avoid saving on disk

const upload = multer({
  storage: storage,
  limits: { files: 5 }, // Maximum of 5 images
}).array("images", 5); // Expecting up to 5 images with field name "images"

module.exports = upload;
