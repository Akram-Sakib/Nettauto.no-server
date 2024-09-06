import { Document, Model, Types } from 'mongoose';
import { IUser } from '../user/user.interface';
import { IAuction } from '../auction/auction.interfaces';

export enum ISoldAuctionStatus {
  NOT_APPROVED = "not_approved",
  LIVE_NOW = "live_now",
  AWAITING_APPROVAL = "awaiting_approval",
  BID_NOT_ACCEPTED = "bid_not_accepted",
  UNDER_REGISTRATION = "under_registration",
}

export type ISoldAuction = {
  sellerDetails: Types.ObjectId | IUser
  buyerDetails: Types.ObjectId | IUser
  auction: Types.ObjectId | IAuction
  winningBid: Types.ObjectId | IBidw
};

export type SoldAuctionModel = Model<
  ISoldAuction & Document,
  Record<string, unknown>
>;

export type ISoldAuctionFilters = {
  searchTerm?: string;
  brand?: string
};