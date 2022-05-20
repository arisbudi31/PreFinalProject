const routers = require("express").Router()
const { user } = require("../controller")
const uploader = require("../helper/multer/multer_config")

routers.get("/users", user.getUser)
routers.post("/users", user.login)
routers.post("/users/register", user.register)
routers.patch("/users/verification", user.verifyUser)
routers.post("/users/verification/resend", user.resendEmail)
routers.post("/users/upload", uploader.single("image"), user.uploadImage)
routers.put("/users/edit", user.editUser)

module.exports = routers