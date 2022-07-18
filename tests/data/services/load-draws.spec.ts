import { throwError } from "@/tests/domain/mocks";

class LoadDraws {
  constructor(private readonly loadDrawsRepository: LoadDrawsRepository) {}

  async execute(): Promise<LoadDrawsRepository.Output> {
    return await this.loadDrawsRepository.loadAll();
  }
}

type GroupDraw = {
  id: string;
  name: string;
  description: string;
  userId: string;
  prizeImg: string;
};

interface LoadDrawsRepository {
  loadAll(): Promise<LoadDrawsRepository.Output>;
}

namespace LoadDrawsRepository {
  export type Output = GroupDraw[] | undefined;
}

class LoadDrawsRepositoryMock implements LoadDrawsRepository {
  callsCount = 0;
  output: LoadDrawsRepository.Output = [
    {
      id: "any_id",
      name: "any_name",
      description: "any_description",
      userId: "any_user_id",
      prizeImg: "any_prize_img",
    },
  ];

  async loadAll(): Promise<LoadDrawsRepository.Output> {
    this.callsCount++;
    return this.output;
  }
}

export type SutTypes = {
  sut: LoadDraws;
  loadDrawsRepositoryMock: LoadDrawsRepositoryMock;
};

const makeSut = (): SutTypes => {
  const loadDrawsRepositoryMock = new LoadDrawsRepositoryMock();
  const sut = new LoadDraws(loadDrawsRepositoryMock);
  return {
    sut,
    loadDrawsRepositoryMock,
  };
};

describe("LoadDraws", () => {
  it("should load all draws", async () => {
    const { sut, loadDrawsRepositoryMock } = makeSut();

    const promise = await sut.execute();

    expect(promise).toEqual(loadDrawsRepositoryMock.output);
  });

  it("should call LoadDrawsRepository", async () => {
    const { sut, loadDrawsRepositoryMock } = makeSut();

    await sut.execute();

    expect(loadDrawsRepositoryMock.callsCount).toBe(1);
  });

  it("should throw if LoadDrawsRepository throws", async () => {
    const { sut, loadDrawsRepositoryMock } = makeSut();

    jest
      .spyOn(loadDrawsRepositoryMock, "loadAll")
      .mockImplementationOnce(throwError);
    const promise = sut.execute();

    await expect(promise).rejects.toThrow();
  });
});
