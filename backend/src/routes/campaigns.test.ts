import * as Hapi from "hapi"
import * as JWTHapi from "hapi-auth-jwt2"
import * as HttpStatusCodes from "http-status-codes"
import * as JWT from "jsonwebtoken"
import mockingoose from "mockingoose"

import { Campaign, User } from "../schema/index"
import * as campaigns from "./campaigns"

const secret = "DontShareSecrets"
const goodToken = JWT.sign({ id: 0 }, secret)
const badToken = JWT.sign({ id: 1 }, secret)

describe("Campaigns", () => {
  let server: Hapi.Server

  beforeAll(async () => {
    process.env.JWTSECRET = "secret"
    server = new Hapi.Server()
    await server.register(JWTHapi)
    server.auth.strategy("jwt", "jwt", {
      key: secret,
      validate: (decoded: any, request: any) => {
        if (decoded.id === 0) {
          return { isValid: true }
        } else {
          return { isValid: false }
        }
      },
      verifyOptions: { algorithms: ["HS256"] },
    })
    server.route(campaigns.GetCampaignsRoute)
    await server.initialize()
  })

  afterAll(async () => {
    await server.stop()
  })

  describe("Get all campaigns", () => {
    beforeEach(async () => {
      mockingoose.resetAll()
      jest.clearAllMocks()
    })

    it("should have a handler", () => {
      expect(campaigns.GetCampaignsRoute.handler).toBeDefined()
    })

    it("should fail without authentication", async () => {
      const injectOptions = {
        method: "GET",
        url: "/campaigns",
      }
      const response = await server.inject(injectOptions)
      expect(response.statusCode).toEqual(HttpStatusCodes.UNAUTHORIZED)
    })

    it("should fail with invalid token", async () => {
      const injectOptions = {
        method: "GET",
        url: "/campaigns",
        headers: { Authorization: badToken },
      }
      const response = await server.inject(injectOptions)
      expect(response.statusCode).toEqual(HttpStatusCodes.UNAUTHORIZED)
    })

    it("should get all campaigns", async () => {
      const usr = await User.create({
        email: "user@domain.com",
        password: User.generateHash("thisisatestpassword"),
      })
      const campaign1 = await Campaign.create({
        name: "My First Campaign",
        creator: usr,
      })
      const campaign2 = await Campaign.create({
        name: "My Second Campaign",
        creator: usr,
      })
      mockingoose(Campaign).toReturn([campaign1, campaign2], "find")
      const injectOptions = {
        method: "GET",
        url: "/campaigns",
        headers: { Authorization: goodToken },
      }
      const response = await server.inject(injectOptions)
      expect(response.statusCode).toEqual(HttpStatusCodes.OK)
      const responseJSON = JSON.parse(response.payload)
      expect(responseJSON[0].name).toEqual("My First Campaign")
      expect(responseJSON[1].name).toEqual("My Second Campaign")
    })
  })
})
