import { Role } from "src/enums/role.enum"

export interface UserInterface {
  id: string
  password: string
  name: string
  email: string
  role: Role
}