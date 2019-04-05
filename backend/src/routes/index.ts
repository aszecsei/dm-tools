import * as Hapi from "hapi"

import { LoginRoute } from "./login"
import { RegistrationRoute } from "./registration"

export function getRoutes(): Hapi.ServerRoute[] {
  return [
    {
      method: "GET",
      path: "/",
      options: { auth: false },
      handler: async request => {
        return "Hello, world"
      },
    },
    RegistrationRoute,
    LoginRoute,
  ]
}
