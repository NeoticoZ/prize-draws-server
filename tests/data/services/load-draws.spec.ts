import { throwError } from "@/tests/domain/mocks";
import { LoadDrawsService } from "@/data/services";
import { LoadDrawsRepositoryMock } from "@/tests/data/mocks";

type SutTypes = {
  sut: LoadDrawsService;
  loadDrawsRepositoryMock: LoadDrawsRepositoryMock;
};

const makeSut = (): SutTypes => {
  const loadDrawsRepositoryMock = new LoadDrawsRepositoryMock();
  const sut = new LoadDrawsService(loadDrawsRepositoryMock);
  return {
    sut,
    loadDrawsRepositoryMock,
  };
};

describe("LoadDraws", () => {
  it("should load all draws", async () => {
    const { sut, loadDrawsRepositoryMock } = makeSut();

    const promise = await sut.load();

    expect(promise).toEqual(loadDrawsRepositoryMock.output);
  });

  it("should call LoadDrawsRepository", async () => {
    const { sut, loadDrawsRepositoryMock } = makeSut();

    await sut.load();

    expect(loadDrawsRepositoryMock.callsCount).toBe(1);
  });

  it("should throw if LoadDrawsRepository throws", async () => {
    const { sut, loadDrawsRepositoryMock } = makeSut();

    jest
      .spyOn(loadDrawsRepositoryMock, "loadAll")
      .mockImplementationOnce(throwError);
    const promise = sut.load();

    await expect(promise).rejects.toThrow();
  });
});
