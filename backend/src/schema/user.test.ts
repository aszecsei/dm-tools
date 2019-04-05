import mockingoose from "mockingoose"
import { User } from "./user"

describe("User Schema", () => {
  beforeEach(async () => {
    mockingoose.resetAll()
    jest.clearAllMocks()
  })

  it("should be able to verify correct passwords", async () => {
    const doc = await User.create({
      email: "user@domain.com",
      password: User.generateHash("thisisatestpassword"),
    })
    expect(doc.isPasswordValid("thisisatestpassword")).toBeTruthy()
  })

  it("should be able to identify incorrect passwords", async () => {
    const doc = await User.create({
      email: "user@domain.com",
      password: User.generateHash("thisisatestpassword"),
    })
    expect(doc.isPasswordValid("thisisanotherpassword")).toBeFalsy()
  })

  it("should remove the password when JSON-ifying user data", async () => {
    const doc = await User.create({
      email: "user@domain.com",
      password: User.generateHash("thisisatestpassword"),
    })
    const jsonString = JSON.stringify(doc)
    const jsonObject = JSON.parse(jsonString)
    expect(jsonObject.password).toBeUndefined()
  })
})
