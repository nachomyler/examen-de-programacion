import mongoose, { Schema, model, Document } from 'mongoose'

export interface IPlane extends Document {
  code: string
  modelName: string
  capacity: number
  status: 'DISPONIBLE' | 'EN_VUELO' | 'EN_MANTENIMIENTO'
}

const PlaneSchema = new Schema<IPlane>(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true
    },
    modelName: {
      type: String,
      required: true
    },
    capacity: {
      type: Number,
      required: true,
      min: 1
    },
    status: {
      type: String,
      enum: ['DISPONIBLE', 'EN_VUELO', 'EN_MANTENIMIENTO'],
      default: 'DISPONIBLE'
    }
  },
  {
    timestamps: true,
    toJSON: {
      transform: function(doc: any, ret: any) {
        ret.model = ret.modelName
        delete ret.modelName
        ret.id = ret._id
        delete ret._id
        delete ret.__v
        return ret
      }
    }
  }
)

const Plane = model<IPlane>('Plane', PlaneSchema)
export default Plane
