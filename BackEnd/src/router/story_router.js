const routers = require("express").Router()
const { story } = require("../controller")
const uploader = require("../helper/multer/multer_story")

routers.post("/stories", story.postStory)
routers.get("/stories", story.getStory)
routers.get("/stories/:idPost", story.getStoryByIdPost)
routers.patch("/stories/:idPost", story.editStory)
routers.delete("/stories/:idPost", story.deleteStory)

routers.patch("/stories/likes/:idPost", story.updateLike)
routers.post("/stories/image-post", uploader.single("image"), story.imagePost)

module.exports = routers