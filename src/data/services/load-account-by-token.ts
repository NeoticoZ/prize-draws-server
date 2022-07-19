import { Decrypter, LoadAccountByTokenRepository } from "@/data/contracts";

export class LoadAccountByTokenService {
  constructor(
    private loadAccountByTokenRepository: LoadAccountByTokenRepository,
    private decrypter: Decrypter
  ) {}

  async load(
    accessToken: string,
    role?: string
  ): Promise<LoadAccountByTokenRepository.Output> {
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
