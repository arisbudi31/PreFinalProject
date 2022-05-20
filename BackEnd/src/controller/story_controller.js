const database = require("../config").promise()
const jwt = require("jsonwebtoken")
const moment = require("moment")
const createError = require("../helper/create_error")
const createResponse = require("../helper/create_response")
const httpStatus = require("../helper/http_status_code")
const path = require("path")
const fs = require("fs")
const { storySchema } = require("../helper/validation_schema")
const dir = "./public/stories"

module.exports.postStory = async (req, res) => {

  const tokenHeader = req.headers.authorization
  const token = tokenHeader.split(" ")[1]

  try {
    const { content } = req.body

    const { error } = storySchema.validate(req.body)

    if (error) {
      const responseStatus = new createResponse(
        httpStatus.BAD_REQUEST,
        'Error', false, 1, 1, error.details[0].message
      )

      res.status(responseStatus.status).send(responseStatus)
      throw new createError(httpStatus.BAD_REQUEST, error.details[0].message)
    }

    const uidToken = jwt.verify(token, process.env.SECRET_KEY).uid

    const CHECK_USER = `SELECT * FROM users WHERE uid = ?`

    const [USER] = await database.execute(CHECK_USER, [uidToken])

    if (!USER.length) {
      const responseStatus = new createResponse(
        httpStatus.BAD_REQUEST,
        'Error', false, 1, 1, 'User tidak ditemukan'
      )

      res.status(responseStatus.status).send(responseStatus)
      throw new createError(httpStatus.BAD_REQUEST, 'User tidak ditemukan')
    }

    const createdAt = moment().format("DD MM YYYY in hh:mm:ss a")

    const INSERT_STORY = `INSERT INTO stories(content, created_at, id_user) VALUES (${database.escape(content)}, ${database.escape(createdAt)}, ${database.escape(USER[0].id)})`

    const [USERE] = await database.execute(INSERT_STORY)

    const responseStatus = new createResponse(
      httpStatus.CREATED,
      'add new story', true, 1, 1, USERE
    )

    res.header('authorization', `Bearer ${token}`).send(responseStatus)

  } catch (error) {
    console.log("error: ", error)
  }
}

module.exports.getStory = async (req, res) => {
  const tokenHeader = req.headers.authorization
  const token = tokenHeader.split(" ")[1]

  try {

    const uidToken = jwt.verify(token, process.env.SECRET_KEY).uid

    const CHECK_USER = `SELECT * FROM users WHERE uid = ?`

    const [USER] = await database.execute(CHECK_USER, [uidToken])

    if (!USER.length) {
      const responseStatus = new createResponse(
        httpStatus.BAD_REQUEST,
        'Error', false, 1, 1, 'User tidak ditemukan'
      )

      res.status(responseStatus.status).send(responseStatus)
      throw new createError(httpStatus.BAD_REQUEST, 'User tidak ditemukan')
    }

    const GET_USER_STORY = `SELECT * FROM stories WHERE id_user = ?;`
    const [STORY] = await database.execute(GET_USER_STORY, [USER[0].id])

    const responseStatus = new createResponse(
      httpStatus.OK,
      'success', true, 1, 1, STORY
    )

    res.status(responseStatus.status).send(responseStatus)

  } catch (error) {
    console.log("err: ", error)
  }
}

module.exports.getStoryByIdPost = async (req, res) => {
  const tokenHeader = req.headers.authorization
  const token = tokenHeader.split(" ")[1]
  const idPost = req.params.idPost

  try {

    const uidToken = jwt.verify(token, process.env.SECRET_KEY).uid

    const CHECK_USER = `SELECT * FROM users WHERE uid = ?`

    const [USER] = await database.execute(CHECK_USER, [uidToken])

    if (!USER.length) {
      const responseStatus = new createResponse(
        httpStatus.BAD_REQUEST,
        'Error', false, 1, 1, 'User tidak ditemukan'
      )

      res.status(responseStatus.status).send(responseStatus)
      throw new createError(httpStatus.BAD_REQUEST, 'User tidak ditemukan')
    }

    console.log(idPost)

    const GET_USER_STORY_BY_ID = `SELECT * FROM stories WHERE id_user = ? AND id = ?;`
    const [STORY] = await database.execute(GET_USER_STORY_BY_ID, [USER[0].id, idPost])

    const responseStatus = new createResponse(
      httpStatus.OK,
      'success', true, 1, 1, STORY
    )

    res.status(responseStatus.status).send(responseStatus)

  } catch (error) {
    console.log("err: ", error)
  }
}

module.exports.editStory = async (req, res) => {
  const tokenHeader = req.headers.authorization
  const token = tokenHeader.split(" ")[1]
  const idPost = req.params.idPost

  try {
    const { content } = req.body

    const { error } = storySchema.validate(req.body)

    if (error) {
      const responseStatus = new createResponse(
        httpStatus.BAD_REQUEST,
        'Error', false, 1, 1, error.details[0].message
      )

      res.status(responseStatus.status).send(responseStatus)
      throw new createError(httpStatus.BAD_REQUEST, error.details[0].message)
    }

    const uidToken = jwt.verify(token, process.env.SECRET_KEY).uid

    const CHECK_USER = `SELECT * FROM users WHERE uid = ?`

    const [USER] = await database.execute(CHECK_USER, [uidToken])

    if (!USER.length) {
      const responseStatus = new createResponse(
        httpStatus.BAD_REQUEST,
        'Error', false, 1, 1, 'User tidak ditemukan'
      )

      res.status(responseStatus.status).send(responseStatus)
      throw new createError(httpStatus.BAD_REQUEST, 'User tidak ditemukan')
    }

    const UPDATE_CONTENT = `UPDATE stories SET content = ? WHERE id_user = ? AND id = ?;`
    await database.execute(UPDATE_CONTENT, [content, USER[0].id, idPost])

    const responseStatus = new createResponse(
      httpStatus.OK,
      'update story', true, 1, 1, 'Story has been updated'
    )

    res.header('authorization', `Bearer ${token}`).send(responseStatus)

  } catch (error) {
    console.log("err: ", error)
  }
}

module.exports.deleteStory = async (req, res) => {
  const tokenHeader = req.headers.authorization
  const token = tokenHeader.split(" ")[1]
  const idPost = req.params.idPost

  try {

    const uidToken = jwt.verify(token, process.env.SECRET_KEY).uid

    const CHECK_USER = `SELECT * FROM users WHERE uid = ?`

    const [USER] = await database.execute(CHECK_USER, [uidToken])

    if (!USER.length) {
      const responseStatus = new createResponse(
        httpStatus.BAD_REQUEST,
        'Error', false, 1, 1, 'User tidak ditemukan'
      )

      res.status(responseStatus.status).send(responseStatus)
      throw new createError(httpStatus.BAD_REQUEST, 'User tidak ditemukan')
    }

    const DELETE_POST = `DELETE FROM stories WHERE id_user = ? AND id = ?;`
    await database.execute(DELETE_POST, [USER[0].id, idPost])

    const responseStatus = new createResponse(
      httpStatus.OK,
      'delete story', true, 1, 1, 'Story has been deleted'
    )

    res.header(responseStatus.status).send(responseStatus)

  } catch (error) {
    console.log("err ", error)
  }
}

module.exports.updateLike = async (req, res) => {
  const tokenHeader = req.headers.authorization
  const token = tokenHeader.split(" ")[1]
  const idPost = req.params.idPost

  try {
    const { likes, is_like } = req.body

    const uidToken = jwt.verify(token, process.env.SECRET_KEY).uid

    const CHECK_USER = `SELECT * FROM users WHERE uid = ?`

    const [USER] = await database.execute(CHECK_USER, [uidToken])

    if (!USER.length) {
      const responseStatus = new createResponse(
        httpStatus.BAD_REQUEST,
        'Error', false, 1, 1, 'User tidak ditemukan'
      )

      res.status(responseStatus.status).send(responseStatus)
      throw new createError(httpStatus.BAD_REQUEST, 'User tidak ditemukan')
    }

    const UPDATE_LIKE = `UPDATE stories SET likes = ?, is_like = ? WHERE id_user = ? AND id = ?;`
    await database.execute(UPDATE_LIKE, [likes, is_like, USER[0].id, idPost])

    const responseStatus = new createResponse(
      httpStatus.OK,
      'update like', true, 1, 1, 'Story has been like'
    )

    res.header(responseStatus.status).send(responseStatus)

  } catch (error) {
    console.log("err", error)
  }
}

module.exports.imagePost = async (req, res) => {

  const tokenHeader = req.headers.authorization
  const token = tokenHeader.split(" ")[1]

  try {

    const idPost = req.body.id

    if (!req.file) {
      throw new createError(httpStatus.BAD_REQUEST, "Bad request, file not found")
    }

    const baseUrlImage = `${req.protocol}://${req.get("host")}/stories/${req.file.filename}`
    // console.log(baseUrlImage)

    const uidToken = jwt.verify(token, process.env.SECRET_KEY).uid

    const CHECK_USER = `SELECT * FROM users WHERE uid = ?`

    const [USER] = await database.execute(CHECK_USER, [uidToken])

    if (!USER.length) {
      const responseStatus = new createResponse(
        httpStatus.BAD_REQUEST,
        'Error', false, 1, 1, 'User tidak ditemukan'
      )

      res.status(responseStatus.status).send(responseStatus)
      throw new createError(httpStatus.BAD_REQUEST, 'User tidak ditemukan')
    }

    const UPLOAD_IMAGE = `UPDATE stories SET image = '${baseUrlImage}' WHERE id_user = ? AND id = ?`

    await database.execute(UPLOAD_IMAGE, [USER[0].id, idPost])

    const responseStatus = new createResponse(
      httpStatus.CREATED,
      'Success', true, 1, 1, baseUrlImage
    )

    res.status(responseStatus.status).send(responseStatus)

  } catch (error) {
    console.log("error : ", error)
    fs.unlinkSync(path.join(dir + req.file))
  }
}