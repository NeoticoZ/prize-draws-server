import { throwError } from "@/tests/domain/mocks";
import { LoadParticipationsService } from "@/data/services";
import { LoadParticipationsByDrawIdRepositoryMock } from "@/tests/data/mocks";

type SutTypes = {
  sut: LoadParticipationsService;
  loadParticipationsByDrawIdRepositoryMock: LoadParticipationsByDrawIdRepositoryMock;
};

const makeSut = (): SutTypes => {
  const loadParticipationsByDrawIdRepositoryMock =
    new LoadParticipationsByDrawIdRepositoryMock();
  const sut = new LoadParticipationsService(
    loadParticipationsByDrawIdRepositoryMock
  );
  return {
    sut,
    loadParticipationsByDrawIdRepositoryMock,
  };
};

describe("LoadParticipations", () => {
  const drawId = "any_draw_id";

  it("should call LoadParticipationsByDrawIdRepository with correct values", async () => {
    const { sut, loadParticipationsByDrawIdRepositoryMock } = makeSut();

    await sut.execute(drawId);

    expect(loadParticipationsByDrawIdRepositoryMock.drawId).toBe(drawId);
    expect(loadParticipationsByDrawIdRepositoryMock.callsCount).toBe(1);
  });

  it("should throw if LoadParticipationsByDrawIdRepository throws", async () => {
    const { sut, loadParticipationsByDrawIdRepositoryMock } = makeSut();

    jest
      .spyOn(loadParticipationsByDrawIdRepositoryMock, "loadAll")
      .mockImplementationOnce(throwError);
    const promise = sut.execute(drawId);

    await expect(promise).rejects.toThrow();
  });

  it("should load all participations", async () => {
    const { sut, loadParticipationsByDrawIdRepositoryMock } = makeSut();

    const promise = await sut.execute(drawId);

    expect(promise).toEqual(loadParticipationsByDrawIdRepositoryMock.output);
  });
});
