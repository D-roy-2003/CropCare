import mongoose, { Schema, Document } from 'mongoose'

export interface IProfile extends Document {
  userId: mongoose.Types.ObjectId;
  fullName: string;
  phone: string;
  countryCode: string;
  city: string;
  email: string;
  username: string;
  profileImage?: string;
  createdAt: Date;
}

const ProfileSchema = new Schema<IProfile>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  countryCode: { type: String, required: true },
  city: { type: String, required: true },
  email: { type: String, required: true },
  username: { type: String, required: true },
  profileImage: { type: String },
  createdAt: { type: Date, default: Date.now }
})

export default mongoose.models.Profile || mongoose.model<IProfile>('Profile', ProfileSchema) 