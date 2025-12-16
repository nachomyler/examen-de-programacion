import mongoose, { Schema, model, Document } from 'mongoose'

export interface ICrewMember extends Document {
  name: string
  role: 'PILOTO' | 'COPILOTO' | 'AUXILIAR'
  flightId: string
}

const CrewMemberSchema = new Schema<ICrewMember>(
  {
    name: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ['PILOTO', 'COPILOTO', 'AUXILIAR'],
      required: true
    },
    flightId: {
      type: String,
      required: true,
      ref: 'Flight'
    }
  },
  {
    timestamps: true,
    toJSON: {
      transform: function(doc: any, ret: any) {
        ret.id = ret._id.toString()
        delete ret._id
        delete ret.__v
        return ret
      }
    }
  }
)

const CrewMember = model<ICrewMember>('CrewMember', CrewMemberSchema)
export default CrewMember

