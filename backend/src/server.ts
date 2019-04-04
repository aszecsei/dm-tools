import * as dotenv from "dotenv"
dotenv.config()

import * as Hapi from "hapi"
import * as JWTHapi from "hapi-auth-jwt2"
import mongoose = require("mongoose")

import * as routes from "./routes"
import { User } from "./schema"

export const Server = new Hapi.Server({
  host: "0.0.0.0",
  port: 3000,
})

export async function initServer() {
  await Server.register(JWTHapi)
  Server.auth.strategy("jwt", "jwt", {
    key: process.env.JWTSECRET,
    validate,
    verifyOptions: { algorithms: ["HS256"] },
  })
  Server.route(routes.getRoutes())
}

export async function validate(decoded: any, request: any) {
  const user = await User.findById(decoded.id)
  if (!user) {
    return { isValid: false }
  } else {
    return { isValid: true }
  }
}

process.on("unhandledRejection", err => {
  console.error(err)
  process.exit(1)
})

export async function init() {
  await initServer()
  await Server.initialize()
  return Server
}

export async function start() {
  await initServer()

  // Start mongoose
  mongoose.connect(
    process.env.COSMOSDB_CONNSTR + "?ssl=true&replicaSet=globaldb",
    {
      useNewUrlParser: true,
      auth: {
        user: process.env.COSMOSDB_USER,
        password: process.env.COSMOSDB_PASSWORD,
      },
    }
  )
  const db = mongoose.connection
  db.on("error", console.error.bind(console, "connection error:"))
  db.once("open", () => {
    console.log(`Connected to database`)
  })

  await Server.start()
  console.log(`Server running at: ${Server.info.uri}`)
  return Server
}
