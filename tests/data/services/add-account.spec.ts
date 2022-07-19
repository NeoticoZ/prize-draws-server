import { AddAccountService } from "@/data/services";
import {
  AddAccountRepositoryMock,
  CheckAccountByEmailRepositoryMock,
  HasherMock,
} from "@/tests/data/mocks";
import { throwError } from "@/tests/domain/mocks";

type SutTypes = {
  sut: AddAccountService;
  addAccountRepositoryMock: AddAccountRepositoryMock;
  checkAccountByEmailRepository: CheckAccountByEmailRepositoryMock;
  hasher: HasherMock;
};

const makeSut = (): SutTypes => {
  const addAccountRepositoryMock = new AddAccountRepositoryMock();
  const checkAccountByEmailRepository = new CheckAccountByEmailRepositoryMock();
  const hasher = new HasherMock();
  const sut = new AddAccountService(
    addAccountRepositoryMock,
    checkAccountByEmailRepository,
    hasher
  );
  return {
    sut,
    addAccountRepositoryMock,
    checkAccountByEmailRepository,
    hasher,
  };
};

describe("AddAccount", () => {
  const name = "any_name";
  const email = "any_email";
  const password = "any_password";

  it("should call hasher with correct plaintext", async () => {
    const { sut, hasher } = makeSut();

    await sut.add({ name, email, password });

    expect(hasher.plaintext).toBe(password);
    expect(hasher.callsCount).toBe(1);
  });

  it("should throw if hasher throws", async () => {
    const { sut, hasher } = makeSut();

    jest.spyOn(hasher, "hash").mockImplementationOnce(throwError);
    const promise = sut.add({ name, email, password });

    await expect(promise).rejects.toThrow();
  });

  it("should call addAccountRepository with correct values", async () => {
    const { sut, addAccountRepositoryMock, hasher } = makeSut();

    await sut.add({ name, email, password });

    expect(addAccountRepositoryMock.name).toBe(name);
    expect(addAccountRepositoryMock.email).toBe(email);
    expect(addAccountRepositoryMock.password).toBe(hasher.output);
    expect(addAccountRepositoryMock.callsCount).toBe(1);
  });

  it("should return false if addAccountRepository returns false", async () => {
    const { sut, addAccountRepositoryMock } = makeSut();

    addAccountRepositoryMock.output = false;
    const isValid = await sut.add({ name, email, password });

    expect(isValid).toBe(false);
  });

  it("should return true on success", async () => {
    const { sut } = makeSut();

    const isValid = await sut.add({ name, email, password });

    expect(isValid).toEqual(true);
  });

  it("should call checkAccountByEmailRepository with correct email", async () => {
    const { sut, checkAccountByEmailRepository } = makeSut();

    await sut.add({ name, email, password });

    expect(checkAccountByEmailRepository.email).toBe(email);
    expect(checkAccountByEmailRepository.callsCount).toBe(1);
  });

  it("should return false if checkAccountByEmailRepository returns true", async () => {
    const { sut, checkAccountByEmailRepository } = makeSut();

    checkAccountByEmailRepository.output = true;
    const isValid = await sut.add({ name, email, password });

    expect(isValid).toBe(false);
  });
});
