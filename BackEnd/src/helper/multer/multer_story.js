const multer = require("multer")

const storage = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, "./public/stories")
  },
  filename: (req, res, cb) => {
    cb(null, `image_story-` + Date.now() + '.jpg')
  }
})

module.exports = multer({ storage: storage, limits: 100000 })