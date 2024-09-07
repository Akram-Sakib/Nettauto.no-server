import { Document, Model, Types } from 'mongoose';
import { IUser } from '../user/user.interface';
import { IAuction } from '../auction/auction.interfaces';
import { IBid } from '../bid/bid.interfaces';



export type ISoldAuction = {
  sellerDetails: Types.ObjectId | IUser
  buyerDetails: Types.ObjectId | IUser
  auction: Types.ObjectId | IAuction
  winningBid: Types.ObjectId | IBid
};

export type SoldAuctionModel = Model<
  ISoldAuction & Document,
  Record<string, unknown>
>;

export type ISoldAuctionFilters = {
  searchTerm?: string;
  brand?: string
};