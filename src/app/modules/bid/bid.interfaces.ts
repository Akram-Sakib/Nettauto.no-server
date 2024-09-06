import { Document, Model, Types } from 'mongoose';
import { IAuction } from '../auction/auction.interfaces';
import { IUser } from '../user/user.interface';

export enum IBidStatus {
  NOT_APPROVED = "not_approved",
  LIVE_NOW = "live_now",
  AWAITING_APPROVAL = "awaiting_approval",
  BID_NOT_ACCEPTED = "bid_not_accepted",
  UNDER_REGISTRATION = "under_registration",
}

export type IBid = {
  sellerDetails: Types.ObjectId | IUser
  buyerDetails: Types.ObjectId | IUser
  auction: Types.ObjectId | IAuction
  winningBid: Types.ObjectId | IBid
};

export type BidModel = Model<
  IBid & Document,
  Record<string, unknown>
>;

export type IBidFilters = {
  searchTerm?: string;
  brand?: string
};