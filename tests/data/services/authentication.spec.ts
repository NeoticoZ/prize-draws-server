import { throwError } from "@/tests/domain/mocks";

interface Authentication {
  auth: (
    authenticationParams: Authentication.Params
  ) => Promise<Authentication.Output>;
}

namespace Authentication {
  export type Params = {
    email: string;
    password: string;
  };

  export type Output = {
    accessToken: string;
    name: string;
  };
}

class AuthenticationService implements Authentication {
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

// LoadAccountByEmailRepository
interface LoadAccountByEmailRepository {
  loadByEmail(email: string): Promise<LoadAccountByEmailRepository.Output>;
}

namespace LoadAccountByEmailRepository {
  export type Output = User;
}

type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
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

// HashComparer
interface HashComparer {
  compare(plainText: string, digest: string): Promise<boolean>;
}

class HashComparerStub implements HashComparer {
  plainText: string;
  digest: string;
  output = true;

  async compare(plainText: string, digest: string): Promise<boolean> {
    this.plainText = plainText;
    this.digest = digest;
    return this.output;
  }
}

// Encrypter
interface Encrypter {
  encrypt(plaintext: string): Promise<string>;
}

class EncrypterStub implements Encrypter {
  plaintext: string;
  output = "any_token";

  async encrypt(plaintext: string): Promise<string> {
    this.plaintext = plaintext;
    return this.output;
  }
}

// UpdateAccessTokenRepository
interface UpdateAccessTokenRepository {
  updateAccessToken(userId: string, accessToken: string): Promise<void>;
}

class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
  userId: string;
  accessToken: string;

  async updateAccessToken(userId: string, accessToken: string): Promise<void> {
    this.userId = userId;
    this.accessToken = accessToken;
  }
}

type SutTypes = {
  sut: AuthenticationService;
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepositoryStub;
  hashComparerStub: HashComparerStub;
  encrypterStub: EncrypterStub;
  updateAccessTokenRepositoryStub: UpdateAccessTokenRepositoryStub;
};

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub =
    new LoadAccountByEmailRepositoryStub();
  const hashComparerStub = new HashComparerStub();
  const encrypterStub = new EncrypterStub();
  const updateAccessTokenRepositoryStub = new UpdateAccessTokenRepositoryStub();
  const sut = new AuthenticationService(
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    encrypterStub,
    updateAccessTokenRepositoryStub
  );
  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    encrypterStub,
    updateAccessTokenRepositoryStub,
  };
};

describe("Authentication", () => {
  const email = "any_email";
  const password = "any_password";

  it("should call LoadAccountByEmailRepository with correct values", async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();

    await sut.auth({ email, password });

    expect(loadAccountByEmailRepositoryStub.email).toBe(email);
  });

  it("should throw if LoadAccountByEmailRepository throws", async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();

    jest
      .spyOn(loadAccountByEmailRepositoryStub, "loadByEmail")
      .mockImplementationOnce(throwError);
    const promise = sut.auth({ email, password });

    await expect(promise).rejects.toThrow();
  });

  it("should return null if LoadAccountByEmailRepository returns null", async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();

    loadAccountByEmailRepositoryStub.output = null;
    const isValid = await sut.auth({ email, password });

    expect(isValid).toBe(null);
  });

  it("should call HashComparer with correct values", async () => {
    const { sut, hashComparerStub, loadAccountByEmailRepositoryStub } =
      makeSut();

    await sut.auth({ email, password });

    expect(hashComparerStub.plainText).toBe(password);
    expect(hashComparerStub.digest).toBe(
      loadAccountByEmailRepositoryStub.output.password
    );
  });

  it("should throw if HashComparer throws", async () => {
    const { sut, hashComparerStub } = makeSut();

    jest.spyOn(hashComparerStub, "compare").mockImplementationOnce(throwError);
    const promise = sut.auth({ email, password });

    await expect(promise).rejects.toThrow();
  });

  it("should return null if HashComparer returns false", async () => {
    const { sut, hashComparerStub } = makeSut();

    hashComparerStub.output = false;
    const isValid = await sut.auth({ email, password });

    expect(isValid).toBe(null);
  });

  it("should call Encrypter with correct values", async () => {
    const { sut, encrypterStub, loadAccountByEmailRepositoryStub } = makeSut();

    await sut.auth({ email, password });

    expect(encrypterStub.plaintext).toBe(
      loadAccountByEmailRepositoryStub.output.id
    );
  });

  it("should throw if Encrypter throws", async () => {
    const { sut, encrypterStub } = makeSut();

    jest.spyOn(encrypterStub, "encrypt").mockImplementationOnce(throwError);
    const promise = sut.auth({ email, password });

    await expect(promise).rejects.toThrow();
  });

  it("should return an accessToken if Encrypter returns a token", async () => {
    const { sut, encrypterStub } = makeSut();

    encrypterStub.output = "any_token";
    const account = await sut.auth({ email, password });

    expect(account.accessToken).toBe(encrypterStub.output);
  });

  it("should call UpdateAccessTokenRepository with correct values", async () => {
    const {
      sut,
      loadAccountByEmailRepositoryStub,
      updateAccessTokenRepositoryStub,
      encrypterStub,
    } = makeSut();

    await sut.auth({ email, password });

    expect(updateAccessTokenRepositoryStub.userId).toBe(
      loadAccountByEmailRepositoryStub.output.id
    );
    expect(updateAccessTokenRepositoryStub.accessToken).toBe(
      encrypterStub.output
    );
  });

  it("should throw if UpdateAccessTokenRepository throws", async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut();

    jest
      .spyOn(updateAccessTokenRepositoryStub, "updateAccessToken")
      .mockImplementationOnce(throwError);
    const promise = sut.auth({ email, password });

    await expect(promise).rejects.toThrow();
  });
});
