import * as Hapi from "hapi"
import * as HttpStatusCodes from "http-status-codes"
import mockingoose from "mockingoose"
import { User } from "./schema"
import { init, validate } from "./server"

describe("Server", () => {
  let server: Hapi.Server

  beforeAll(async () => {
    server = await init()
  })

  beforeEach(async () => {
    mockingoose.resetAll()
    jest.clearAllMocks()
  })

  it("should validate if server is running", async () => {
    const response = await server.inject({
      method: "GET",
      url: "/",
    })
    expect(response.statusCode).toEqual(HttpStatusCodes.OK)
  })

  it("should validate authentication", async () => {
    const doc = {
      _id: "507f191e810c19729de860ea",
      email: "user@domain.com",
    }
    mockingoose(User).toReturn(doc, "findOne")
    const response = await validate({ id: "507f191e810c19729de860ea" }, {})
    expect(response.isValid).toBeTruthy()
  })

  it("should invalidate authentication", async () => {
    mockingoose(User).toReturn(null, "findOne")
    const response = await validate({ id: "507f191e810c19729de860ea" }, {})
    expect(response.isValid).toBeFalsy()
  })

  afterAll(async () => {
    await server.stop()
  })
})
