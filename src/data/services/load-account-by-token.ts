import { Decrypter, LoadAccountByTokenRepository } from "@/data/contracts";
import { LoadAccountByToken } from "@/domain/usecases";

export class LoadAccountByTokenService implements LoadAccountByToken {
  constructor(
    private loadAccountByTokenRepository: LoadAccountByTokenRepository,
    private decrypter: Decrypter
  ) {}

  async load(
    accessToken: string,
    role?: string
  ): Promise<LoadAccountByToken.Output> {
    let token = "";
    try {
      token = await this.decrypter.decrypt(accessToken);
    } catch (error) {
      return null;
    }

    if (token) {
      const account = await this.loadAccountByTokenRepository.loadByToken({
        token,
        role,
      });

      if (account) {
        return account;
      }
    }

    return null;
  }
}
