import { throwError } from "@/tests/domain/mocks";
import { DeleteDrawService } from "@/data/services";
import {
  DeleteDrawRepositoryMock,
  LoadDrawByIdRepositoryMock,
} from "@/tests/data/mocks";

type SutTypes = {
  sut: DeleteDrawService;
  deleteDrawRepositoryMock: DeleteDrawRepositoryMock;
  loadDrawByIdRepositoryMock: LoadDrawByIdRepositoryMock;
};

const makeSut = (): SutTypes => {
  const deleteDrawRepositoryMock = new DeleteDrawRepositoryMock();
  const loadDrawByIdRepositoryMock = new LoadDrawByIdRepositoryMock();
  const sut = new DeleteDrawService(
    deleteDrawRepositoryMock,
    loadDrawByIdRepositoryMock
  );
  return {
    sut,
    deleteDrawRepositoryMock,
    loadDrawByIdRepositoryMock,
  };
};

describe("DeleteDraw", () => {
  const drawId = "any_id";
  const userId = "any_user_id";

  it("should call DeleteDrawRepository with correct values", async () => {
    const { sut, deleteDrawRepositoryMock } = makeSut();

    await sut.delete({ drawId, userId });

    expect(deleteDrawRepositoryMock.drawId).toBe(drawId);
    expect(deleteDrawRepositoryMock.userId).toBe(userId);
    expect(deleteDrawRepositoryMock.callsCount).toBe(1);
  });

  it("should throw if DeleteDrawRepository throws", async () => {
    const { sut, deleteDrawRepositoryMock } = makeSut();

    jest
      .spyOn(deleteDrawRepositoryMock, "delete")
      .mockImplementationOnce(throwError);
    const promise = sut.delete({ drawId, userId });

    await expect(promise).rejects.toThrow();
  });

  it("should call LoadDrawByIdRepository with correct value", async () => {
    const { sut, loadDrawByIdRepositoryMock } = makeSut();

    await sut.delete({ drawId, userId });

    expect(loadDrawByIdRepositoryMock.drawId).toBe(drawId);
  });

  it("should throw if LoadDrawByIdRepository throws", async () => {
    const { sut, loadDrawByIdRepositoryMock } = makeSut();

    jest
      .spyOn(loadDrawByIdRepositoryMock, "loadById")
      .mockImplementationOnce(throwError);
    const promise = sut.delete({ drawId, userId });

    await expect(promise).rejects.toThrow();
  });

  it("should throw if userId is different", async () => {
    const { sut, loadDrawByIdRepositoryMock } = makeSut();

    loadDrawByIdRepositoryMock.output.userId = "other_user_id";
    const promise = sut.delete({ drawId, userId });

    await expect(promise).rejects.toThrow();
  });
});
