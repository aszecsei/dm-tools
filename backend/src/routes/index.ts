import * as Hapi from "hapi"

import { User } from "../schema"

import { RegistrationRoute } from "./registration"

export function getRoutes(): Hapi.ServerRoute[] {
  return [
    {
      method: "GET",
      path: "/",
      options: { auth: false },
      handler: async request => {
        return await User.find()
      },
    },
    RegistrationRoute,
  ]
}
