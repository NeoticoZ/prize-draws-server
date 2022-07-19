import { throwError } from "@/tests/domain/mocks";
import { AddParticipationService } from "@/data/services";
import {
  AddParticipationRepositoryMock,
  CheckIfIsParticipingRepositoryMock,
} from "@/tests/data/mocks";

type SutTypes = {
  sut: AddParticipationService;
  addParticipationRepositoryMock: AddParticipationRepositoryMock;
  checkIfIsParticipingRepositoryMock: CheckIfIsParticipingRepositoryMock;
};

const makeSut = (): SutTypes => {
  const addParticipationRepositoryMock = new AddParticipationRepositoryMock();
  const checkIfIsParticipingRepositoryMock =
    new CheckIfIsParticipingRepositoryMock();
  const sut = new AddParticipationService(
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

    await sut.add({ drawId, userId });

    expect(addParticipationRepositoryMock.drawId).toBe(drawId);
    expect(addParticipationRepositoryMock.userId).toBe(userId);
    expect(addParticipationRepositoryMock.callsCount).toBe(1);
  });

  it("it should throw if AddParticipationRepository throws", async () => {
    const { sut, addParticipationRepositoryMock } = makeSut();

    jest
      .spyOn(addParticipationRepositoryMock, "add")
      .mockImplementationOnce(throwError);
    const promise = sut.add({ drawId, userId });

    await expect(promise).rejects.toThrow();
  });

  it("should call CheckIfIsParticipingRepository with correct values", async () => {
    const { sut, checkIfIsParticipingRepositoryMock } = makeSut();

    await sut.add({ drawId, userId });

    expect(checkIfIsParticipingRepositoryMock.userId).toBe(userId);
    expect(checkIfIsParticipingRepositoryMock.drawId).toBe(drawId);
    expect(checkIfIsParticipingRepositoryMock.callsCount).toBe(1);
  });

  it("should throw if CheckIfIsParticipingRepository throws", async () => {
    const { sut, checkIfIsParticipingRepositoryMock } = makeSut();

    jest
      .spyOn(checkIfIsParticipingRepositoryMock, "check")
      .mockImplementationOnce(throwError);
    const promise = sut.add({ drawId, userId });

    await expect(promise).rejects.toThrow();
  });
});
