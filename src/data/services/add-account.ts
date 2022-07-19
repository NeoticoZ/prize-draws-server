import {
  AddAccountRepository,
  CheckAccountByEmailRepository,
  Hasher,
} from "@/data/contracts";
import { AddAccount } from "@/domain/usecases";

export class AddAccountService implements AddAccount {
  constructor(
    private readonly addAccountRepository: AddAccountRepository,
    private readonly checkAccountByEmailRepository: CheckAccountByEmailRepository,
    private readonly hasher: Hasher
  ) {}

  async add(user: AddAccount.Params): Promise<AddAccount.Output> {
    const alreadyExists = await this.checkAccountByEmailRepository.loadByEmail(
      user.email
    );
    let isValid = false;
    if (!alreadyExists) {
      const hashedPassword = await this.hasher.hash(user.password);
      isValid = await this.addAccountRepository.add({
        ...user,
        password: hashedPassword,
      });
    }
    return isValid;
  }
}
