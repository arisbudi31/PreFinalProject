const multer = require("multer")

const storage = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, "./public/profile")
  },
  filename: (req, res, cb) => {
    cb(null, `image-` + Date.now() + '.jpg')
  }
})

module.exports = multer({ storage: storage, limits: 100000 })