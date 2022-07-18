class CreateAccount {
  constructor(
    private readonly createAccountRepository: CreateAccountRepositoryMock,
    private readonly checkAccountByEmailRepository: CheckAccountByEmailRepository,
    private readonly hasher: Hasher
  ) {}

  async execute(
    user: CreateAccountRepository.Params
  ): Promise<CreateAccountRepository.Output> {
    const alreadyExists = await this.checkAccountByEmailRepository.loadByEmail(
      user.email
    );
    let isValid = false;
    if (!alreadyExists) {
      const hashedPassword = await this.hasher.hash(user.password);
      isValid = await this.createAccountRepository.create({
        ...user,
        password: hashedPassword,
      });
    }
    return isValid;
  }
}

// CreateAccountRepository
interface CreateAccountRepository {
  create(
    user: CreateAccountRepository.Params
  ): Promise<CreateAccountRepository.Output>;
}

namespace CreateAccountRepository {
  export type Params = Omit<User, "id">;
  export type Output = boolean;
}

type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

class CreateAccountRepositoryMock implements CreateAccountRepository {
  name: string;
  email: string;
  password: string;
  callsCount = 0;
  output: CreateAccountRepository.Output = true;

  async create(
    user: CreateAccountRepository.Params
  ): Promise<CreateAccountRepository.Output> {
    this.callsCount++;
    this.name = user.name;
    this.email = user.email;
    this.password = user.password;
    return this.output;
  }
}

// CheckAccountByEmailRepository
interface CheckAccountByEmailRepository {
  loadByEmail(email: string): Promise<CheckAccountByEmailRepository.Output>;
}

namespace CheckAccountByEmailRepository {
  export type Output = boolean;
}

class CheckAccountByEmailRepositoryMock
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

// Hasher
interface Hasher {
  hash: (plaintext: string) => Promise<string>;
}

class HasherMock implements Hasher {
  callsCount = 0;
  plaintext: string;
  output: string = "any_hash";

  async hash(plaintext: string): Promise<string> {
    this.callsCount++;
    this.plaintext = plaintext;
    return this.output;
  }
}

// Sut
export type SutTypes = {
  sut: CreateAccount;
  createAccountRepositoryMock: CreateAccountRepositoryMock;
  checkAccountByEmailRepository: CheckAccountByEmailRepositoryMock;
  hasher: HasherMock;
};

const makeSut = (): SutTypes => {
  const createAccountRepositoryMock = new CreateAccountRepositoryMock();
  const checkAccountByEmailRepository = new CheckAccountByEmailRepositoryMock();
  const hasher = new HasherMock();
  const sut = new CreateAccount(
    createAccountRepositoryMock,
    checkAccountByEmailRepository,
    hasher
  );
  return {
    sut,
    createAccountRepositoryMock,
    checkAccountByEmailRepository,
    hasher,
  };
};

describe("CreateAccount", () => {
  const name = "any_name";
  const email = "any_email";
  const password = "any_password";

  it("should call hasher with correct plaintext", async () => {
    const { sut, hasher } = makeSut();

    await sut.execute({ name, email, password });

    expect(hasher.plaintext).toBe(password);
    expect(hasher.callsCount).toBe(1);
  });

  it("should throw if hasher throws", async () => {
    const { sut, hasher } = makeSut();

    jest.spyOn(hasher, "hash").mockImplementationOnce(() => {
      throw new Error();
    });
    const promise = sut.execute({ name, email, password });

    await expect(promise).rejects.toThrow();
  });

  it("should call CreateAccountRepository with correct values", async () => {
    const { sut, createAccountRepositoryMock, hasher } = makeSut();

    await sut.execute({ name, email, password });

    expect(createAccountRepositoryMock.name).toBe(name);
    expect(createAccountRepositoryMock.email).toBe(email);
    expect(createAccountRepositoryMock.password).toBe(hasher.output);
    expect(createAccountRepositoryMock.callsCount).toBe(1);
  });

  it("should return false if CreateAccountRepository returns false", async () => {
    const { sut, createAccountRepositoryMock } = makeSut();

    createAccountRepositoryMock.output = false;
    const isValid = await sut.execute({ name, email, password });

    expect(isValid).toBe(false);
  });

  it("should return true on success", async () => {
    const { sut } = makeSut();

    const isValid = await sut.execute({ name, email, password });

    expect(isValid).toEqual(true);
  });

  it("should call checkAccountByEmailRepository with correct email", async () => {
    const { sut, checkAccountByEmailRepository } = makeSut();

    await sut.execute({ name, email, password });

    expect(checkAccountByEmailRepository.email).toBe(email);
    expect(checkAccountByEmailRepository.callsCount).toBe(1);
  });

  it("should return false if checkAccountByEmailRepository returns true", async () => {
    const { sut, checkAccountByEmailRepository } = makeSut();

    checkAccountByEmailRepository.output = true;
    const isValid = await sut.execute({ name, email, password });

    expect(isValid).toBe(false);
  });
});
