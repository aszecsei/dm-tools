import * as bcrypt from "bcrypt"
import * as mongoose from "mongoose"

const SALT_WORK_FACTOR = 10

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, index: { unique: true } },
  password: { type: String, required: true },
})

UserSchema.methods.isPasswordValid = function(candidatePassword: string) {
  return bcrypt.compareSync(candidatePassword, this.password)
}

UserSchema.statics.generateHash = (password: string) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(SALT_WORK_FACTOR))
}

// Omit passwords when returning user data
UserSchema.set("toJSON", {
  transform(doc: any, ret: any) {
    delete ret.password
    return ret
  },
})

export interface IUserDocument extends mongoose.Document {
  email: string
  isPasswordValid: (candidatePassword: string) => boolean
}

export interface IUserModel extends mongoose.Model<IUserDocument> {
  generateHash: (password: string) => string
}

export const User = mongoose.model<IUserDocument, IUserModel>(
  "User",
  UserSchema
)
