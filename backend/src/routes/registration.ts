import Boom from "boom"
import * as Hapi from "hapi"
import * as Joi from "joi"
import * as JWT from "jsonwebtoken"

import { User } from "../schema"

const MIN_PASSWORD_LENGTH = 8
interface IUserData {
  email: string
  password: string
}

const schema = {
  email: Joi.string()
    .email()
    .required(),
  password: Joi.string()
    .min(MIN_PASSWORD_LENGTH)
    .required(),
}

export async function registrationHandler(
  request: Hapi.Request,
  h: Hapi.ResponseToolkit
) {
  if (!process.env.JWTSECRET) {
    throw Boom.badImplementation("Unable to sign JWT")
  }
  const userData = request.payload as IUserData
  try {
    const newUser = await User.create({
      email: userData.email,
      password: User.generateHash(userData.password),
    })
    const session = { id: newUser.id }
    const token = JWT.sign(session, process.env.JWTSECRET)
    return h
      .response({ text: "You have been registered" })
      .header("Authorization", token)
      .code(201)
  } catch (err) {
    if (err.code === 11000) {
      return h
        .response({ error: "This email address is already registered." })
        .code(200)
    }
  }
}

export const RegistrationRoute: Hapi.ServerRoute = {
  method: "POST",
  path: "/register",
  handler: registrationHandler,
  options: {
    validate: {
      payload: schema,
    },
    auth: false,
  },
}
