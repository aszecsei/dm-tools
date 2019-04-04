import * as Hapi from "hapi"
import mockingoose from "mockingoose"
import { init, validate } from "./server"
import { User } from "./schema"

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
    expect(response.statusCode).toEqual(200)
  })

  it("should validate authentication", async () => {
    const _doc = {
      _id: "507f191e810c19729de860ea",
      email: "user@domain.com",
    }
    mockingoose(User).toReturn(_doc, "findOne")
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
