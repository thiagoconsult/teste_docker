import { IProduct } from "./models/product.interface";

export class Product implements IProduct {
  id?: string | undefined;
  name: string;
  price: number;
}
