import {
  LoadAccountByEmailRepository,
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
