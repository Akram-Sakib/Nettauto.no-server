import { model, Schema } from 'mongoose';
import { AUCTION_COLLECTION, AUCTION_STATUS } from './soldAuctions.constants';
import {
  ISoldAuction,
  SoldAuctionModel
} from './soldAuctions.interfaces';

const SoldAuctionSchema = new Schema<
  ISoldAuction,
  SoldAuctionModel
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

export const SoldAuction = model<
  ISoldAuction,
  SoldAuctionModel
>(AUCTION_COLLECTION, SoldAuctionSchema);
