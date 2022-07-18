import { Authentication } from "@/domain/usecases";
import {
  Encrypter,
  HashComparer,
  LoadAccountByEmailRepository,
  UpdateAccessTokenRepository,
} from "@/data/contracts";

export class AuthenticationService implements Authentication {
  constructor(
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly encrypter: Encrypter,
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository
  ) {}

  async auth({
    email,
    password,
  }: Authentication.Params): Promise<Authentication.Output> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(email);

    if (account) {
      const isValid = await this.hashComparer.compare(
        password,
        account.password
      );

      if (isValid) {
        const accessToken = await this.encrypter.encrypt(account.id);
        await this.updateAccessTokenRepository.updateAccessToken(
          account.id,
          accessToken
        );

        return {
          accessToken,
          name: account.name,
        };
      }
    }

    return null;
  }
}
