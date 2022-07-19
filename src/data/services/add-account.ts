import {
  AddAccountRepository,
  CheckAccountByEmailRepository,
  Hasher,
} from "@/data/contracts";

export class AddAccountService {
  constructor(
    private readonly addAccountRepository: AddAccountRepository,
    private readonly checkAccountByEmailRepository: CheckAccountByEmailRepository,
    private readonly hasher: Hasher
  ) {}

  async execute(
    user: AddAccountRepository.Params
  ): Promise<AddAccountRepository.Output> {
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
