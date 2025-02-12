import { User } from "src/user/entity/user.entity";

export interface SessionInterface {
  id: string;
  user: User;
  hash: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}