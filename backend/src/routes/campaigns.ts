import Boom from "boom"
import * as Hapi from "hapi"
import { Campaign, User } from "../schema"

export async function getAllCampaigns(
  request: Hapi.Request,
  h: Hapi.ResponseToolkit
) {
  const currentUser = await User.findById((request.auth.credentials as any).id)
  // Get all campaigns created by the current user
  const campaigns = await Campaign.find({ creator: currentUser })
  return h.response(campaigns)
}

export const GetCampaignsRoute: Hapi.ServerRoute = {
  method: "GET",
  path: "/campaigns",
  handler: getAllCampaigns,
  options: { auth: "jwt" },
}
