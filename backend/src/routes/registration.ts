import * as Hapi from "hapi"
import * as Joi from "joi"
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

export const RegistrationRoute: Hapi.ServerRoute = {
  method: "POST",
  path: "/register",
  handler: async request => {
    const userData = request.payload as IUserData
    const newUser = await User.create({
      email: userData.email,
      password: User.generateHash(userData.password),
    })
    return newUser
  },
  options: {
    validate: {
      payload: schema,
    },
  },
}
