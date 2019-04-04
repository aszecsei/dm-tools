import * as Hapi from "hapi"
import mockingoose from "mockingoose"

import * as registration from "./registration"
import { User } from "../schema/index"

describe("Registration", () => {
  let server: Hapi.Server

  beforeAll(async () => {
    process.env.JWTSECRET = "secret"
    server = new Hapi.Server()
    server.route(registration.RegistrationRoute)
    await server.start()
  })

  beforeEach(async () => {
    mockingoose.resetAll()
    jest.clearAllMocks()
  })

  afterAll(async () => {
    await server.stop()
  })

  it("should have a handler", () => {
    expect(registration.RegistrationRoute.handler).toBeDefined()
  })

  it("should validate emails", async () => {
    const injectOptions = {
      method: "POST",
      url: "/register",
      payload: {
        email: "username",
        password: "thisisatestpassword",
      },
    }
    const response = await server.inject(injectOptions)
    expect(response.statusCode).toEqual(400)
  })

  it("should validate passwords", async () => {
    const injectOptions = {
      method: "POST",
      url: "/register",
      payload: {
        email: "user@domain.com",
        password: "short",
      },
    }
    const response = await server.inject(injectOptions)
    expect(response.statusCode).toEqual(400)
  })

  it("should accept valid emails and passwords", async () => {
    const _doc = {
      _id: "507f191e810c19729de860ea",
      email: "user@domain.com",
    }
    mockingoose(User).toReturn(_doc, "save")

    const injectOptions = {
      method: "POST",
      url: "/register",
      payload: {
        email: "user@domain.com",
        password: "thisisatestpassword",
      },
    }
    const response = await server.inject(injectOptions)
    expect(response.statusCode).toEqual(201)
  })
})
