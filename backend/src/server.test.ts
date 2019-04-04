import * as Hapi from "hapi"
import mockingoose from "mockingoose"
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
    expect(response.statusCode).toEqual(200)
  })

  it("should validate", async () => {
    const response = await validate({ id: 0 }, {})
    expect(response.isValid).toBeTruthy()
  })

  afterAll(async () => {
    await server.stop()
  })
})
