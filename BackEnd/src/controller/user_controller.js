const uuid = require("uuid")
const database = require("../config").promise()
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const transporter = require("../helper/transporter")
const createError = require("../helper/create_error")
const createResponse = require("../helper/create_response")
const httpStatus = require("../helper/http_status_code")
const { registerSchema, loginSchema, editSchema } = require("../helper/validation_schema")
const path = require("path")
const fs = require("fs")
const dir = "./public/profile"

module.exports.register = async (req, res) => {
  const { username, email, password, re_password } = req.body

  try {

    const { error } = registerSchema.validate(req.body)

    if (error) {
      const responseStatus = new createResponse(
        httpStatus.BAD_REQUEST,
        'Error Password', false, 1, 1, error.details[0].message
      )

      res.status(responseStatus.status).send(responseStatus)
      throw new createError(httpStatus.BAD_REQUEST, error.details[0].message)
    }

    if (password !== re_password) {
      const responseStatus = new createResponse(
        httpStatus.BAD_REQUEST,
        'Error Password', false, 1, 1, 'password doesn\'t match'
      )

      res.status(responseStatus.status).send(responseStatus)
      // throw new createError(httpStatus.BAD_REQUEST, "password doesn't match")
    }

    const uid = uuid.v4()
    // console.log('uid', uid)

    const salt = await bcrypt.genSalt(10)
    // console.log('salt', salt)

    const hashpassword = await bcrypt.hash(password, salt)
    // console.log('plain : ', password)
    // console.log('hash: ', hashpassword)

    const token = jwt.sign({ uid: uid }, process.env.SECRET_KEY)

    const mail = {
      from: '"Admin" <arisjoharie@gmail.com>',
      to: `${email}`,
      subject: 'Account Verification',
      html: `
                <p>please verify your account using this link.</p>
                <a href='http://localhost:3000/verification/${token}'>Verify your account</a>
            `
    }

    await transporter.sendMail(mail)

    const CHECK_USER = `SELECT * FROM users WHERE username = ? OR email = ?;`

    const [USER] = await database.execute(CHECK_USER, [username, email])
    if (USER.length) {
      const responseStatus = new createResponse(
        httpStatus.BAD_REQUEST,
        'username and email not unique', false, 1, 1, 'username and email must be unique.'
      )

      res.status(responseStatus.status).send(responseStatus)
      throw new createError(httpStatus.BAD_REQUEST, 'username and email must be unique.')
    } else {
      const INSERT_USER = `
            INSERT INTO users(uid, username, email, password)
            VALUES(${database.escape(uid)}, ${database.escape(username)}, ${database.escape(email)}, ${database.escape(hashpassword)});
        `
      await database.execute(INSERT_USER)

      const responseStatus = new createResponse(
        httpStatus.CREATED,
        'add new user', true, 1, 1, 'user has been added and please verify your account.'
      )

      res.header('authorization', `Bearer ${token}`).send(responseStatus)
    }
  }
  catch (error) {
    console.log('error : ', error)

    const isTrusted = error instanceof createError

    if (!isTrusted) {
      error = new createError(httpStatus.INTERNAL_SERVICE_ERROR, error.sqlMessage)
      console.log(error)
    }
    res.status(error.status).send(error)
  }

}

module.exports.getUser = async (req, res) => {

  try {
    const tokenHeader = req.headers.authorization
    const token = tokenHeader.split(" ")[1]

    const uidToken = jwt.verify(token, process.env.SECRET_KEY).uid

    const EXIST_USER = `SELECT * FROM users WHERE uid = ?;`

    const [USER] = await database.execute(EXIST_USER, [uidToken])
    if (!USER.length) {
      throw new createError(httpStatus.BAD_REQUEST, 'user not registered.')
    }

    delete USER[0].password
    USER[0].uid = token

    const respons = new createResponse(httpStatus.OK, 'Login Success', true, 1, 1, USER[0])
    res.status(respons.status).send(respons)
    // console.log(USER[0])
  }
  catch (error) {
    console.log('error: ', error)
  }
}

module.exports.verifyUser = async (req, res) => {

  const tokenHeader = req.headers.authorization
  const token = tokenHeader.split(" ")[1]

  try {

    const uidToken = jwt.verify(token, process.env.SECRET_KEY).uid
    // console.log(uidToken)

    const EXIST_USER = `SELECT * FROM users WHERE uid = ?;`

    const [USER] = await database.execute(EXIST_USER, [uidToken])

    if (!USER.length) {
      throw new createError(httpStatus.BAD_REQUEST, 'user not registered.')
    }

    const UPDT_STATUS = `UPDATE users SET status = 'verified' WHERE uid = ?;`

    await database.execute(UPDT_STATUS, [uidToken])

    const response = new createResponse(httpStatus.OK, 'verified success', true, 1, 1, "Your Account Has Verified")
    res.status(response.status).send(response)

  } catch (error) {
    console.log('error: ', error)
  }
}

module.exports.login = async (req, res) => {
  const { login, password } = req.body

  try {
    const { error } = loginSchema.validate(req.body)

    if (error) {
      const responseStatus = new createResponse(
        httpStatus.BAD_REQUEST,
        'Error', false, 1, 1, error.details[0].message
      )

      res.status(responseStatus.status).send(responseStatus)
      throw new createError(httpStatus.BAD_REQUEST, error.details[0].message)
    }

    const CHECK_USER = `SELECT * FROM users WHERE username = ? OR email = ?;`
    const [USER] = await database.execute(CHECK_USER, [login, login])
    if (!USER.length) {
      const responseStatus = new createResponse(
        httpStatus.BAD_REQUEST,
        'Error', false, 1, 1, 'username atau email salah.'
      )

      res.status(responseStatus.status).send(responseStatus)
      throw new createError(httpStatus.BAD_REQUEST, 'username atau email salah.')
    }

    // console.log(USER)

    const valid = await bcrypt.compare(password, USER[0].password)
    console.log('is valid : ', valid)
    if (!valid) {
      const responseStatus = new createResponse(
        httpStatus.BAD_REQUEST,
        'Error', false, 1, 1, 'password salah.'
      )

      res.status(responseStatus.status).send(responseStatus)

      throw new createError(httpStatus.BAD_REQUEST, 'password salah.')
    }

    const uid = USER[0].uid

    const token = jwt.sign({ uid: uid }, process.env.SECRET_KEY)

    const responseStatus = new createResponse(
      httpStatus.OK,
      'Login success', true, 1, 1, 'Login Succesfully'
    )

    res.header('authorization', `Bearer ${token}`).send(responseStatus)

  } catch (error) {
    console.log('error: ', error)
  }
}

module.exports.editUser = async (req, res) => {
  const tokenHeader = req.headers.authorization
  const token = tokenHeader.split(" ")[1]

  try {
    const { username, fullname, bio, image } = req.body
    const uidToken = jwt.verify(token, process.env.SECRET_KEY).uid

    const { error } = editSchema.validate(req.body)
    if (error) {
      const responseStatus = new createResponse(
        httpStatus.BAD_REQUEST,
        'Error', false, 1, 1, error.details[0].message
      )

      res.status(responseStatus.status).send(responseStatus)
      throw new createError(httpStatus.BAD_REQUEST, error.details[0].message)
    }

    const CHECK_USER = `SELECT * FROM users WHERE username = ? AND uid NOT IN (?);`
    const [USER] = await database.execute(CHECK_USER, [username, uidToken])
    if (USER.length) {
      const responseStatus = new createResponse(
        httpStatus.BAD_REQUEST,
        'Error', false, 1, 1, 'username harus uniq.'
      )

      res.status(responseStatus.status).send(responseStatus)
      throw new createError(httpStatus.BAD_REQUEST, 'username harus uniq.')
    }

    // console.log(token)
    // console.log(username)

    const EXIST_USER = `SELECT * FROM users WHERE uid = ?;`
    const [USER_EDIT] = await database.execute(EXIST_USER, [uidToken])
    if (!USER_EDIT.length) {
      throw new createError(httpStatus.BAD_REQUEST, 'user not found.')
    } else {
      const UPDATE_USER = `UPDATE users SET fullname = ?, username = ?, bio=? WHERE uid = ?;`

      await database.execute(UPDATE_USER, [fullname, username, bio, uidToken])

      const UPDT_USER = `SELECT * FROM users WHERE uid = ?;`
      const [USER_UPDATED] = await database.execute(UPDT_USER, [uidToken])

      delete USER_UPDATED[0].password
      const responseStatus = new createResponse(
        httpStatus.OK,
        'Data berhasil di update', true, 1, 1, USER_UPDATED[0]
      )

      res.status(responseStatus.status).send(responseStatus)
    }

    // console.log("ok")

  } catch (error) {
    console.log("error: ", error)
  }
}

module.exports.resendEmail = async (req, res) => {
  const tokenHeader = req.headers.authorization
  const token = tokenHeader.split(" ")[1]

  try {
    const { email } = req.body

    const mail = {
      from: '"Admin" <arisjoharie@gmail.com>',
      to: `${email}`,
      subject: 'Account Verification',
      html: `
                <p>please verify your account using this link.</p>
                <a href='http://localhost:3000/verification/${token}'>Verify your account</a>
            `
    }

    await transporter.sendMail(mail)

    const responseStatus = new createResponse(
      httpStatus.OK,
      'Success', true, 1, 1, 'Email verification has been resend to your email address'
    )

    res.header('authorization', `Bearer ${token}`).send(responseStatus)

  } catch (error) {
    const responseStatus = new createResponse(
      httpStatus.BAD_REQUEST,
      'Error', false, 1, 1, 'Terjadi kesalahan.'
    )

    res.status(responseStatus.status).send(responseStatus)
    console.log("error : ", error)
  }
}

module.exports.uploadImage = async (req, res) => {

  const tokenHeader = req.headers.authorization
  const token = tokenHeader.split(" ")[1]

  try {

    if (!req.file) {
      throw new createError(httpStatus.BAD_REQUEST, "Bad request, file not found")
    }

    const baseUrlImage = `${req.protocol}://${req.get("host")}/profile/${req.file.filename}`
    // console.log(baseUrlImage)

    const uidToken = jwt.verify(token, process.env.SECRET_KEY).uid

    const UPLOAD_IMAGE = `UPDATE users SET image = '${baseUrlImage}' WHERE uid = ?`

    await database.execute(UPLOAD_IMAGE, [uidToken])

    const responseStatus = new createResponse(
      httpStatus.OK,
      'Success', true, 1, 1, baseUrlImage
    )

    res.status(responseStatus.status).send(responseStatus)

  } catch (error) {
    console.log("error : ", error)
    fs.unlinkSync(path.join(dir + req.file))
  }
}