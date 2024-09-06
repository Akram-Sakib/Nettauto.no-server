import { Document, Model, Types } from 'mongoose';
import { IUser } from '../user/user.interface';

export type IDocuments = {
  originalname: string
  path: string;
}

export enum IAuctionStatus {
  NOT_APPROVED = "not_approved",
  LIVE_NOW = "live_now",
  AWAITING_APPROVAL = "awaiting_approval",
  BID_NOT_ACCEPTED = "bid_not_accepted",
  UNDER_REGISTRATION = "under_registration",
}

export type IAuction = {
  sellerDetails: Types.ObjectId | IUser
  carDetails: {
    carRegistrationNo: string;
    place: string
    description: string
    images: string[]
    brand: string
    model: string
    yearModel: number
    kilometer: number
    cylinderVolume: string
    effect: string
    color: string
    gearType: string
    operatingType: string
    minimumPrice: number
    fuel: string
    descriptionCondition: string
    equipment: string[]
    documents: IDocuments[]
  }
  auctionDetails: {
    startTime: Date,
    endTime: Date,
    minimumPrice: number,
    status: IAuctionStatus
    bids?: Types.ObjectId
    topBid?: Types.ObjectId
  },
  buyerDetails?: Types.ObjectId | IUser, // Buyer who won the auction (after bidding)
};

export type AuctionModel = Model<
  IAuction & Document,
  Record<string, unknown>
>;

export type IAuctionFilters = {
  searchTerm?: string;
  brand?: string
};