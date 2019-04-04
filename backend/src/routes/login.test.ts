import * as Hapi from "hapi"
import mockingoose from "mockingoose"

import * as login from "./login"
import { User } from "../schema/index"

describe("Login", () => {
  let server: Hapi.Server

  beforeAll(async () => {
    process.env.JWTSECRET = "secret"
    server = new Hapi.Server()
    server.route(login.LoginRoute)
    await server.start()
  })

  afterAll(async () => {
    await server.stop()
  })

  beforeEach(async () => {
    mockingoose.resetAll()
    jest.clearAllMocks()
  })

  it("should have a handler", () => {
    expect(login.LoginRoute.handler).toBeDefined()
  })

  it("should validate emails", async () => {
    const injectOptions = {
      method: "POST",
      url: "/login",
      payload: {
        email: "username",
        password: "thisisatestpassword",
      },
    }
    const response = await server.inject(injectOptions)
    expect(response.statusCode).toEqual(400)
  })

  it("should accept valid emails and passwords", async () => {
    const _doc = await User.create({
      email: "user@domain.com",
      password: User.generateHash("thisisatestpassword"),
    })
    mockingoose(User).toReturn(_doc, "findOne")

    const injectOptions = {
      method: "POST",
      url: "/login",
      payload: {
        email: "user@domain.com",
        password: "thisisatestpassword",
      },
    }
    const response = await server.inject(injectOptions)
    expect(response.statusCode).toEqual(200)
  })

  it("should not allow invalid emails", async () => {
    mockingoose(User).toReturn(null, "findOne")
    const injectOptions = {
      method: "POST",
      url: "/login",
      payload: {
        email: "user@domain.com",
        password: "thisisatestpassword",
      },
    }
    const response = await server.inject(injectOptions)
    expect(response.statusCode).toEqual(401)
  })

  it("should not accept invalid passwords", async () => {
    const _doc = await User.create({
      email: "user@domain.com",
      password: User.generateHash("thisisatestpassword"),
    })
    mockingoose(User).toReturn(_doc, "findOne")

    const injectOptions = {
      method: "POST",
      url: "/login",
      payload: {
        email: "user@domain.com",
        password: "thisisthewrongpassword",
      },
    }
    const response = await server.inject(injectOptions)
    expect(response.statusCode).toEqual(401)
  })
})
