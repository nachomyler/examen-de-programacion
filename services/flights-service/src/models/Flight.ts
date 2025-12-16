import mongoose, { Schema, model, Document } from 'mongoose'

export interface IFlight extends Document {
  origin: string
  destination: string
  date: string
  time: string
  status: 'PROGRAMADO' | 'EMBARCANDO' | 'EN_VUELO' | 'ATERRIZADO' | 'CANCELADO'
  planeId: string
  userId?: string
  deletedAt?: Date
}

const FlightSchema = new Schema<IFlight>(
  {
    origin: {
      type: String,
      required: true
    },
    destination: {
      type: String,
      required: true
    },
    date: {
      type: String,
      required: true
    },
    time: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['PROGRAMADO', 'EMBARCANDO', 'EN_VUELO', 'ATERRIZADO', 'CANCELADO'],
      default: 'PROGRAMADO'
    },
    planeId: {
      type: String,
      required: true,
      ref: 'Plane'
    },
    userId: {
      type: String,
      ref: 'User'
    },
    deletedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true,
    toJSON: {
      transform: function(doc: any, ret: any) {
        ret.id = ret._id.toString()
        delete ret._id
        delete ret.__v
        if (ret.deletedAt) {
          ret.deletedAt = ret.deletedAt.toISOString()
        }
        return ret
      }
    }
  }
)

const Flight = model<IFlight>('Flight', FlightSchema)
export default Flight

