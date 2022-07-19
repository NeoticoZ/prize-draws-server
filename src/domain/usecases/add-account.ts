import { User } from "@/domain/models";

export interface AddAccount {
  add(user: AddAccount.Params): Promise<AddAccount.Output>;
}

export namespace AddAccount {
  export type Params = Omit<User, "id">;

  export type Output = boolean;
}
