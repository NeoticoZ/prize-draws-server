import { throwError } from "@/tests/domain/mocks";

class LoadAccountByToken {
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

interface LoadAccountByTokenRepository {
  loadByToken({
    token,
    role,
  }: LoadAccountByTokenRepository.Params): Promise<LoadAccountByTokenRepository.Output>;
}

namespace LoadAccountByTokenRepository {
  export type Params = {
    token: string;
    role?: string;
  };

  export type Output = {
    id: string;
  };
}

class LoadAccountByTokenRepositoryStub implements LoadAccountByTokenRepository {
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

interface Decrypter {
  decrypt: (ciphertext: string) => Promise<string>;
}

class DecrypterStub implements Decrypter {
  ciphertext: string;
  callsCount = 0;
  output = "any_plaintext";

  async decrypt(ciphertext: string): Promise<string> {
    this.callsCount++;
    this.ciphertext = ciphertext;
    return this.output;
  }
}

type SutTypes = {
  sut: LoadAccountByToken;
  loadAccountByTokenRepositoryStub: LoadAccountByTokenRepositoryStub;
  decrypterStub: DecrypterStub;
};

const makeSut = (): SutTypes => {
  const loadAccountByTokenRepositoryStub =
    new LoadAccountByTokenRepositoryStub();
  const decrypterStub = new DecrypterStub();
  const sut = new LoadAccountByToken(
    loadAccountByTokenRepositoryStub,
    decrypterStub
  );
  return {
    sut,
    loadAccountByTokenRepositoryStub,
    decrypterStub,
  };
};

describe("LoadAccountByToken", () => {
  const accessToken = "any_token";
  const role = "any_role";

  it("should call Decrypter with correct ciphertext", async () => {
    const { sut, decrypterStub } = makeSut();

    await sut.load(accessToken, role);

    expect(decrypterStub.ciphertext).toBe(accessToken);
    expect(decrypterStub.callsCount).toBe(1);
  });

  it("should return null if Decrypter throws", async () => {
    const { sut, decrypterStub } = makeSut();

    jest.spyOn(decrypterStub, "decrypt").mockImplementationOnce(throwError);
    const promise = sut.load(accessToken, role);

    await expect(promise).resolves.toBeNull();
  });

  it("should call LoadAccountByTokenRepository with correct values", async () => {
    const { sut, loadAccountByTokenRepositoryStub, decrypterStub } = makeSut();

    await sut.load(accessToken, role);

    expect(loadAccountByTokenRepositoryStub.token).toBe(decrypterStub.output);
    expect(loadAccountByTokenRepositoryStub.role).toBe(role);
    expect(loadAccountByTokenRepositoryStub.callsCount).toBe(1);
  });

  it("should return null if LoadAccountByTokenRepository returns null", async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut();

    loadAccountByTokenRepositoryStub.output = null;
    const promise = sut.load(accessToken, role);

    await expect(promise).resolves.toBeNull();
  });

  it("should return null if LoadAccountByTokenRepository throws", async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut();

    jest
      .spyOn(loadAccountByTokenRepositoryStub, "loadByToken")
      .mockImplementationOnce(throwError);
    const promise = sut.load(accessToken, role);

    await expect(promise).rejects.toThrow();
  });

  it("should return account on success", async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut();

    const account = await sut.load(accessToken, role);

    expect(account).toEqual(loadAccountByTokenRepositoryStub.output);
  });
});
