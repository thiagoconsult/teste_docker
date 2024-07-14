import { IProduct } from "@/entities/models/product.interface";

export interface IProductRepository {
  create(product: IProduct): Promise<IProduct>;
  getAll(page: number, limit: number): Promise<IProduct[]>;
}
