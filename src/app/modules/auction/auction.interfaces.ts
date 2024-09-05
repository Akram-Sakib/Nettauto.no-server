import { Document, Model } from 'mongoose';

export type IDocuments = {
  originalname: string
  path: string;
}

export enum IStatus {
  NOT_APPROVED = "Ikke godkjent",
  LIVE_NOW = "live now",
  AWAITING_APPROVAL = "Venter på godkjenning",
  BID_NOT_ACCEPTED = "Bud ikke aksepetert",
  UNDER_REGISTRATION = "Under registrering",
}

export type IAuction = {
  carRegistrationNo: string;
  place: string
  description: string
  images: string[]
  brand: string
  model: string
  yearModel: string
  kilometer: string
  cylinderVolume: string
  effect: string
  color: string
  gearType: string
  operatingType: string
  minimumPrice: string
  fuel: string
  descriptionCondition: string
  equipment: string[]
  documents: IDocuments[]
  auctionTime: string
  status: IStatus
};

export type AuctionModel = Model<
  IAuction & Document,
  Record<string, unknown>
>;

export type IAuctionFilters = {
  searchTerm?: string;
  brand?: string
};