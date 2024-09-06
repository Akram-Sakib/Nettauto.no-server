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
    sellerDetails: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    buyerDetails: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    auction: { type: Schema.Types.ObjectId, ref: 'Auction', required: true },
    winningBid: { type: Schema.Types.ObjectId, ref: 'Bid', required: true },
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
