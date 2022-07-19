import { throwError } from "@/tests/domain/mocks";
import { LoadAccountByTokenService } from "@/data/services";
import {
  DecrypterStub,
  LoadAccountByTokenRepositoryStub,
} from "@/tests/data/mocks";

type SutTypes = {
  sut: LoadAccountByTokenService;
  loadAccountByTokenRepositoryStub: LoadAccountByTokenRepositoryStub;
  decrypterStub: DecrypterStub;
};

const makeSut = (): SutTypes => {
  const loadAccountByTokenRepositoryStub =
    new LoadAccountByTokenRepositoryStub();
  const decrypterStub = new DecrypterStub();
  const sut = new LoadAccountByTokenService(
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
