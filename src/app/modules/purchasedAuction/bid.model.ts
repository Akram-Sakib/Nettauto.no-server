import { model, Schema } from 'mongoose';
import { BID_COLLECTION } from './bid.constants';
import {
  BidModel,
  IBid
} from './bid.interfaces';

const BidSchema = new Schema<
  IBid,
  BidModel
>(
  {
    buyer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    auction: { type: Schema.Types.ObjectId, ref: 'Auction', required: true },
    bidAmount: { type: Number, required: true },
    bidTime: { type: Date, required: true },
    isTopBid: { type: Boolean, required: true },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

export const Bid = model<
  IBid,
  BidModel
>(BID_COLLECTION, BidSchema);
