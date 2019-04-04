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
})
