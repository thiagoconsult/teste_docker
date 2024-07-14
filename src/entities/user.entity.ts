import { IUser } from "./models/user.interface";

export class User implements IUser {
  id?: number | undefined;
  username: string;
  password: string;
}
