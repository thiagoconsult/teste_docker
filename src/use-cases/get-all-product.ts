import { IProduct } from "@/entities/models/product.interface";
import { IProductRepository } from "@/repositories/product.repository.interface";

export class GetAllProductUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async handler(page: number, limit: number): Promise<IProduct[]> {
    return this.productRepository.getAll(page, limit);
  }
}
