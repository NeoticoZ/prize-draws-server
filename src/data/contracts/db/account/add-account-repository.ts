import { User } from "@/domain/models";

export interface AddAccountRepository {
  add(user: AddAccountRepository.Params): Promise<AddAccountRepository.Output>;
}

export namespace AddAccountRepository {
  export type Params = Omit<User, "id">;
  export type Output = boolean;
}
