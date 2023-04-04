import { Schema, Types } from 'mongoose';

export const MatchSchema = new Schema({

  challenge: { type: Types.ObjectId },
  category: { type: Types.ObjectId },
  players: [{
    type: Types.ObjectId,
  }],
  def: { type: Types.ObjectId },
  result: [
    { set: { type: String } }
  ]

}, { timestamps: true, collection: 'matchs' })
