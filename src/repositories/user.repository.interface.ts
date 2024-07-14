import { IUser } from "@/entities/models/user.interface";

export interface IUserRepository {
  create(user: IUser): Promise<IUser>;
  signin(username: string): Promise<IUser | undefined>;
}
