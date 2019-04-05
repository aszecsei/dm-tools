import Boom from "boom"
import * as Hapi from "hapi"
import * as HttpStatusCodes from "http-status-codes"
import * as Joi from "joi"
import * as JWT from "jsonwebtoken"

import { User } from "../schema"

interface IUserData {
  email: string
  password: string
}

const schema = {
  email: Joi.string()
    .email()
    .required(),
  password: Joi.string().required(),
}

export async function loginHandler(
  request: Hapi.Request,
  h: Hapi.ResponseToolkit
) {
  const userData = request.payload as IUserData
  const foundUser = await User.findOne({ email: userData.email })
  if (!foundUser) {
    throw Boom.unauthorized("Email address or password incorrect")
  }
  if (!foundUser.isPasswordValid(userData.password)) {
    throw Boom.unauthorized("Email address or password incorrect")
  }
  if (!process.env.JWTSECRET) {
    throw Boom.badImplementation("Unable to sign JWT")
  }
  const session = { id: foundUser.id }
  const token = JWT.sign(session, process.env.JWTSECRET)
  return h
    .response({ text: "You have been authenticated" })
    .header("Authorization", token)
    .code(HttpStatusCodes.OK)
}

export const LoginRoute: Hapi.ServerRoute = {
  method: "POST",
  path: "/login",
  handler: loginHandler,
  options: {
    validate: {
      payload: schema,
    },
    auth: false,
  },
}
