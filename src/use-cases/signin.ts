import { IUser } from "@/entities/models/user.interface";
import { IUserRepository } from "@/repositories/user.repository.interface";

export class SigninUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async handler(username: string): Promise<IUser | null> {
    return this.userRepository.signin(username);
  }
}
