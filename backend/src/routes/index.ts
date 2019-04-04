import * as Hapi from "hapi"

import { RegistrationRoute } from "./registration"
import { LoginRoute } from "./login"

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
