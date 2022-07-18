import { throwError } from "@/tests/domain/mocks";
import { AuthenticationService } from "@/data/services";
import {
  EncrypterStub,
  HashComparerStub,
  LoadAccountByEmailRepositoryStub,
  UpdateAccessTokenRepositoryStub,
} from "@/tests/data/mocks";

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
