import { AddAccount } from "@/domain/usecases";

export interface AddAccountRepository {
  add(user: AddAccountRepository.Params): Promise<AddAccountRepository.Output>;
}

export namespace AddAccountRepository {
  export type Params = AddAccount.Params;

  export type Output = AddAccount.Output;
}
