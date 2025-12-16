import mongoose, { Schema, model, Document } from 'mongoose'

export interface IUser extends Document {
  email: string
  password: string
  name: string
  role: 'ADMIN' | 'OPERADOR' | 'USUARIO'
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ['ADMIN', 'OPERADOR', 'USUARIO'],
      default: 'USUARIO'
    }
  },
  {
    timestamps: true,
    toJSON: {
      transform: function(doc: any, ret: any) {
        ret.id = ret._id.toString()
        delete ret._id
        delete ret.__v
        delete ret.password
        return ret
      }
    }
  }
)

const User = model<IUser>('User', UserSchema)
export default User

