import { Model, Types } from 'mongoose';
import { IAuction } from '../auction/auction.interfaces';
import { IUser } from '../user/user.interface';

export type IBid = {
  buyer: Types.ObjectId | IUser
  auction: Types.ObjectId | IAuction
  bidAmount: number
  bidTime: Date
  isTopBid: boolean
  bidNumber: number
};

export type BidModel = Model<
  IBid,
  Record<string, unknown>
>;

export type IBidFilters = {
  searchTerm?: string;
  bidAmount?: string
};