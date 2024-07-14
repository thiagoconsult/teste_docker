import { IProduct } from "@/entities/models/product.interface";
import { IProductRepository } from "../product.repository.interface";
import { database } from "@/lib/pg/db";

export class ProductRepository implements IProductRepository {
  async create({ name, price }: IProduct): Promise<IProduct> {
    const result = await database.clientInstance?.query(
      `
      INSERT INTO product (name, price)
      VALUES ($1, $2) RETURNING *
      `,
      [name, price]
    );
    return result?.rows[0];
  }

  async getAll(page: number, limit: number): Promise<IProduct[]> {
    const offset = (page - 1) * limit;
    const result = await database.clientInstance?.query(
      `
    SELECT * FROM product
    LIMIT $1 OFFSET $2
    `,
      [limit, offset]
    );
    return result?.rows || [];
  }
}
