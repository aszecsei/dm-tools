import mockingoose from "mockingoose"
import { Campaign } from "./campaign"
import { User } from "./user"

describe("Campaign Schema", () => {
  beforeEach(async () => {
    mockingoose.resetAll()
    jest.clearAllMocks()
  })

  it("should be able to create a campaign", async () => {
    const user = await User.create({
      email: "user@doman.com",
      password: User.generateHash("testpass"),
    })
    const campaign = await Campaign.create({
      name: "My Campaign",
      creator: user,
    })

    expect(campaign.name).toEqual("My Campaign")
    expect(campaign.creator).toEqual(user)
  })
})
