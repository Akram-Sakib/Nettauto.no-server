import { Document, Model, Types } from 'mongoose';

export type IDocuments = {
  title: string;
  pdf: string
}

export type ICar = {
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
  equipment: string
  // documents: IDocuments[]
  auctionTime: string
};

export type CarModel = Model<
  ICar & Document,
  Record<string, unknown>
>;

export type ICarFilters = {
  searchTerm?: string;
  brand?: string
};