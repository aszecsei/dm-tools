import * as mongoose from "mongoose"
import { IUserModel } from "./user"

const CampaignSchema = new mongoose.Schema({
  name: { type: String, required: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
})

export interface ICampaignDocument extends mongoose.Document {
  name: string
  creator: IUserModel
}

export interface ICampaignModel extends mongoose.Model<ICampaignDocument> {
  generateHash: (password: string) => string
}

export const Campaign = mongoose.model<ICampaignDocument, ICampaignModel>(
  "Campaign",
  CampaignSchema
)
