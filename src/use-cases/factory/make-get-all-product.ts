import { ProductRepository } from "@/repositories/pg/product.repository";
import { GetAllProductUseCase } from "../get-all-product";

export function makeGetAllProductUseCase() {
  const productRepository = new ProductRepository();
  const getAllProductUseCase = new GetAllProductUseCase(productRepository);
  return getAllProductUseCase;
}
