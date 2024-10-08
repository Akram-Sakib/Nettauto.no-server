import { model, Schema } from 'mongoose';
import { AUCTION_COLLECTION, AUCTION_STATUS } from './auction.constants';
import {
  AuctionModel,
  IAuction,
  IAuctionStatus,
  IDocuments
} from './auction.interfaces';

const DocumentSchema = new Schema<IDocuments>({
  originalname: { type: String, required: true },
  path: { type: String, required: true },
});

const AuctionSchema = new Schema<
  IAuction,
  AuctionModel
>(
  {
    sellerDetails: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    carDetails: {
      carRegistrationNo: {
        type: String,
        required: true,
        unique: true,
      },
      place: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      images: {
        type: [String],
        required: true,
        default: [],
      },
      brand: {
        type: String,
        required: true,
      },
      model: {
        type: String,
        required: true,
      },
      yearModel: {
        type: String,
        required: true,
      },
      kilometer: {
        type: String,
        required: true,
      },
      cylinderVolume: {
        type: String,
        required: true,
      },
      effect: {
        type: String,
        required: true,
      },
      color: {
        type: String,
        required: true,
      },
      gearType: {
        type: String,
        required: true,
      },
      operatingType: {
        type: String,
        required: true,
      },
      fuel: {
        type: String,
        required: true,
      },
      descriptionCondition: {
        type: String,
        required: true,
      },
      equipment: {
        type: [String],
        required: true,
      },
      documents: { type: [DocumentSchema], required: true },
    },
    auctionDetails: {
      minimumPrice: {
        type: Number,
        required: true,
      },
      startTime: { type: Date, required: true },
      endTime: { type: Date, required: true },
      status: { type: String, enum: AUCTION_STATUS, required: true, default: IAuctionStatus.AWAITING_APPROVAL }, // 
      bids: [{ type: Schema.Types.ObjectId, ref: 'bids' }], // Reference to bids
    },
    buyerDetails: { type: Schema.Types.ObjectId, ref: 'user' }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

export const Auction = model<
  IAuction,
  AuctionModel
>(AUCTION_COLLECTION, AuctionSchema);
