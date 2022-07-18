import { throwError } from "@/tests/domain/mocks";

class AddParticipation {
  constructor(
    private readonly addParticipationRepository: AddParticipationRepository,
    private readonly checkIfIsParticipingRepository: CheckIfIsParticipingRepository
  ) {}

  public async execute({
    drawId,
    userId,
  }: AddParticipationRepository.Params): Promise<void> {
    const isParticipating = await this.checkIfIsParticipingRepository.check({
      userId,
      drawId,
    });

    if (!isParticipating) {
      await this.addParticipationRepository.add({
        drawId,
        userId,
      });
    }
  }
}

interface AddParticipationRepository {
  add: ({ drawId, userId }: AddParticipationRepository.Params) => Promise<void>;
}

namespace AddParticipationRepository {
  export type Params = {
    drawId: string;
    userId: string;
  };
}

class AddParticipationRepositoryMock implements AddParticipationRepository {
  drawId: string;
  userId: string;
  callsCount = 0;

  async add({
    drawId,
    userId,
  }: AddParticipationRepository.Params): Promise<void> {
    this.drawId = drawId;
    this.userId = userId;
    this.callsCount++;
  }
}

interface CheckIfIsParticipingRepository {
  check: ({
    userId,
    drawId,
  }: CheckIfIsParticipingRepository.Params) => Promise<CheckIfIsParticipingRepository.Output>;
}

namespace CheckIfIsParticipingRepository {
  export type Params = {
    userId: string;
    drawId: string;
  };

  export type Output = boolean;
}

class CheckIfIsParticipingRepositoryMock
  implements CheckIfIsParticipingRepository
{
  userId: string;
  drawId: string;
  callsCount = 0;
  output = false;

  async check({
    userId,
    drawId,
  }: CheckIfIsParticipingRepository.Params): Promise<CheckIfIsParticipingRepository.Output> {
    this.userId = userId;
    this.drawId = drawId;
    this.callsCount++;
    return this.output;
  }
}

type SutTypes = {
  sut: AddParticipation;
  addParticipationRepositoryMock: AddParticipationRepositoryMock;
  checkIfIsParticipingRepositoryMock: CheckIfIsParticipingRepositoryMock;
};

const makeSut = (): SutTypes => {
  const addParticipationRepositoryMock = new AddParticipationRepositoryMock();
  const checkIfIsParticipingRepositoryMock =
    new CheckIfIsParticipingRepositoryMock();
  const sut = new AddParticipation(
    addParticipationRepositoryMock,
    checkIfIsParticipingRepositoryMock
  );
  return {
    sut,
    addParticipationRepositoryMock,
    checkIfIsParticipingRepositoryMock,
  };
};

describe("AddParticipation", () => {
  const drawId = "1";
  const userId = "1";

  it("it should call AddParticipationRepository with correct values", async () => {
    const { sut, addParticipationRepositoryMock } = makeSut();

    await sut.execute({ drawId, userId });

    expect(addParticipationRepositoryMock.drawId).toBe(drawId);
    expect(addParticipationRepositoryMock.userId).toBe(userId);
    expect(addParticipationRepositoryMock.callsCount).toBe(1);
  });

  it("it should throw if AddParticipationRepository throws", async () => {
    const { sut, addParticipationRepositoryMock } = makeSut();

    jest
      .spyOn(addParticipationRepositoryMock, "add")
      .mockImplementationOnce(throwError);
    const promise = sut.execute({ drawId, userId });

    await expect(promise).rejects.toThrow();
  });

  it("should call CheckIfIsParticipingRepository with correct values", async () => {
    const { sut, checkIfIsParticipingRepositoryMock } = makeSut();

    await sut.execute({ drawId, userId });

    expect(checkIfIsParticipingRepositoryMock.userId).toBe(userId);
    expect(checkIfIsParticipingRepositoryMock.drawId).toBe(drawId);
    expect(checkIfIsParticipingRepositoryMock.callsCount).toBe(1);
  });

  it("should throw if CheckIfIsParticipingRepository throws", async () => {
    const { sut, checkIfIsParticipingRepositoryMock } = makeSut();

    jest
      .spyOn(checkIfIsParticipingRepositoryMock, "check")
      .mockImplementationOnce(throwError);
    const promise = sut.execute({ drawId, userId });

    await expect(promise).rejects.toThrow();
  });
});
