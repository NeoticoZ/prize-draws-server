import {
  AddAccountRepository,
  CheckAccountByEmailRepository,
  LoadAccountByEmailRepository,
  LoadAccountByTokenRepository,
  UpdateAccessTokenRepository,
} from "@/data/contracts";

export class LoadAccountByEmailRepositoryStub
  implements LoadAccountByEmailRepository
{
  email: string;
  output: LoadAccountByEmailRepository.Output = {
    id: "any_id",
    name: "any_name",
    email: "any_email",
    password: "any_password",
  };

  async loadByEmail(
    email: string
  ): Promise<LoadAccountByEmailRepository.Output> {
    this.email = email;
    return this.output;
  }
}

export class UpdateAccessTokenRepositoryStub
  implements UpdateAccessTokenRepository
{
  userId: string;
  accessToken: string;

  async updateAccessToken(userId: string, accessToken: string): Promise<void> {
    this.userId = userId;
    this.accessToken = accessToken;
  }
}

export class AddAccountRepositoryMock implements AddAccountRepository {
  name: string;
  email: string;
  password: string;
  callsCount = 0;
  output: AddAccountRepository.Output = true;

  async add(
    user: AddAccountRepository.Params
  ): Promise<AddAccountRepository.Output> {
    this.callsCount++;
    this.name = user.name;
    this.email = user.email;
    this.password = user.password;
    return this.output;
  }
}

export class CheckAccountByEmailRepositoryMock
  implements CheckAccountByEmailRepository
{
  email: string;
  callsCount = 0;
  output: CheckAccountByEmailRepository.Output = false;

  async loadByEmail(
    email: string
  ): Promise<CheckAccountByEmailRepository.Output> {
    this.callsCount++;
    this.email = email;
    return this.output;
  }
}

export class LoadAccountByTokenRepositoryStub
  implements LoadAccountByTokenRepository
{
  token: string;
  role?: string;
  callsCount = 0;
  output = { id: "any_id" };

  async loadByToken({
    token,
    role,
  }: LoadAccountByTokenRepository.Params): Promise<LoadAccountByTokenRepository.Output> {
    this.callsCount++;
    this.token = token;
    this.role = role;
    return this.output;
  }
}
