import * as Hapi from "hapi"
import * as HttpStatusCodes from "http-status-codes"
import mockingoose from "mockingoose"

import { User } from "../schema/index"
import * as registration from "./registration"

describe("Registration", () => {
  let server: Hapi.Server

  beforeAll(async () => {
    server = new Hapi.Server()
    server.route(registration.RegistrationRoute)
    await server.initialize()
  })

  beforeEach(async () => {
    process.env.JWTSECRET = "secret"
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
    expect(response.statusCode).toEqual(HttpStatusCodes.BAD_REQUEST)
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
    expect(response.statusCode).toEqual(HttpStatusCodes.BAD_REQUEST)
  })

  it("should accept valid emails and passwords", async () => {
    const doc = {
      _id: "507f191e810c19729de860ea",
      email: "user@domain.com",
    }
    mockingoose(User).toReturn(doc, "save")

    const injectOptions = {
      method: "POST",
      url: "/register",
      payload: {
        email: "user@domain.com",
        password: "thisisatestpassword",
      },
    }
    const response = await server.inject(injectOptions)
    expect(response.statusCode).toEqual(HttpStatusCodes.CREATED)
  })

  it("should give 500 error if JWT secret is not defined", async () => {
    delete process.env.JWTSECRET
    const consoleError = jest.fn()
    global.console.error = consoleError

    const injectOptions = {
      method: "POST",
      url: "/register",
      payload: {
        email: "user@domain.com",
        password: "thisisatestpassword",
      },
    }
    const response = await server.inject(injectOptions)
    expect(response.statusCode).toEqual(HttpStatusCodes.INTERNAL_SERVER_ERROR)
    expect(console.error).toHaveBeenCalled()

    consoleError.mockRestore()
  })

  it("should respond with a text-based error if a duplicate is created", async () => {
    const err = new Error("duplicate key error")
    mockingoose(User).toReturn(err, "save")

    const injectOptions = {
      method: "POST",
      url: "/register",
      payload: {
        email: "user@domain.com",
        password: "thisisatestpassword",
      },
    }
    const response = await server.inject(injectOptions)
    expect(response.statusCode).toEqual(HttpStatusCodes.OK)
    expect(JSON.parse(response.payload)).toEqual({
      error: "This email address is already registered.",
    })
  })

  it("should respond with a 500 error if any other error is encountered", async () => {
    const err = new Error("something else")
    mockingoose(User).toReturn(err, "save")

    const injectOptions = {
      method: "POST",
      url: "/register",
      payload: {
        email: "user@domain.com",
        password: "thisisatestpassword",
      },
    }
    const response = await server.inject(injectOptions)
    expect(response.statusCode).toEqual(HttpStatusCodes.INTERNAL_SERVER_ERROR)
  })
})
