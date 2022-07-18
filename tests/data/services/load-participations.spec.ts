import { throwError } from "@/tests/domain/mocks";

class LoadParticipations {
  constructor(
    private readonly loadParticipationsByDrawIdRepository: LoadParticipationsByDrawIdRepository
  ) {}

  async execute(
    drawId: string
  ): Promise<LoadParticipationsByDrawIdRepository.Output> {
    return this.loadParticipationsByDrawIdRepository.loadAll(drawId);
  }
}

interface LoadParticipationsByDrawIdRepository {
  loadAll: (
    drawId: string
  ) => Promise<LoadParticipationsByDrawIdRepository.Output>;
}

namespace LoadParticipationsByDrawIdRepository {
  export type Output = Participation[];
}

type Participation = {
  drawId: string;
  userId: string;
};

class LoadParticipationsByDrawIdRepositoryMock
  implements LoadParticipationsByDrawIdRepository
{
  drawId: string;
  callsCount = 0;
  output: LoadParticipationsByDrawIdRepository.Output = [
    {
      drawId: "any_draw_id",
      userId: "any_user_id",
    },
  ];

  async loadAll(
    drawId: string
  ): Promise<LoadParticipationsByDrawIdRepository.Output> {
    this.callsCount++;
    this.drawId = drawId;
    return this.output;
  }
}

type SutTypes = {
  sut: LoadParticipations;
  loadParticipationsByDrawIdRepositoryMock: LoadParticipationsByDrawIdRepositoryMock;
};

const makeSut = (): SutTypes => {
  const loadParticipationsByDrawIdRepositoryMock =
    new LoadParticipationsByDrawIdRepositoryMock();
  const sut = new LoadParticipations(loadParticipationsByDrawIdRepositoryMock);
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
