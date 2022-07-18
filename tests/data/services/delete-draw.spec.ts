import { throwError } from "../../domain/mocks";

class DeleteDraw {
  constructor(
    private readonly deleteDrawRepository: DeleteDrawRepository,
    private readonly loadDrawByIdRepository: LoadDrawByIdRepository
  ) {}

  async execute({
    drawId,
    userId,
  }: DeleteDrawRepository.Params): Promise<void> {
    const draw = await this.loadDrawByIdRepository.loadById({ drawId });
    if (draw) {
      if (draw.userId !== userId) {
        throw new Error("Unauthorized");
      }
      await this.deleteDrawRepository.delete({ drawId, userId });
    }
  }
}

// Delete
interface DeleteDrawRepository {
  delete: (params: DeleteDrawRepository.Params) => Promise<void>;
}

namespace DeleteDrawRepository {
  export type Params = {
    drawId: string;
    userId: string;
  };
}

class DeleteDrawRepositoryMock implements DeleteDrawRepository {
  drawId: string;
  userId: string;
  callsCount = 0;

  async delete({ drawId, userId }: DeleteDrawRepository.Params): Promise<void> {
    this.drawId = drawId;
    this.userId = userId;
    this.callsCount++;
  }
}

// Load
interface LoadDrawByIdRepository {
  loadById: (
    drawId: LoadDrawByIdRepository.Params
  ) => Promise<LoadDrawByIdRepository.Output>;
}

namespace LoadDrawByIdRepository {
  export type Params = {
    drawId: string;
  };

  export type Output = GroupDraw | undefined;
}

export type GroupDraw = {
  id: string;
  name: string;
  description: string;
  userId: string;
  prizeImg: string;
};

class LoadDrawByIdRepositoryMock implements LoadDrawByIdRepository {
  drawId: string;
  callsCount = 0;
  output: GroupDraw = {
    id: "any_id",
    name: "any_name",
    description: "any_description",
    userId: "any_user_id",
    prizeImg: "any_prize_img",
  };

  async loadById({
    drawId,
  }: LoadDrawByIdRepository.Params): Promise<LoadDrawByIdRepository.Output> {
    this.drawId = drawId;
    this.callsCount++;
    return this.output;
  }
}

// Sut
type SutTypes = {
  sut: DeleteDraw;
  deleteDrawRepositoryMock: DeleteDrawRepositoryMock;
  loadDrawByIdRepositoryMock: LoadDrawByIdRepositoryMock;
};

const makeSut = (): SutTypes => {
  const deleteDrawRepositoryMock = new DeleteDrawRepositoryMock();
  const loadDrawByIdRepositoryMock = new LoadDrawByIdRepositoryMock();
  const sut = new DeleteDraw(
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

    await sut.execute({ drawId, userId });

    expect(deleteDrawRepositoryMock.drawId).toBe(drawId);
    expect(deleteDrawRepositoryMock.userId).toBe(userId);
    expect(deleteDrawRepositoryMock.callsCount).toBe(1);
  });

  it("should throw if DeleteDrawRepository throws", async () => {
    const { sut, deleteDrawRepositoryMock } = makeSut();

    jest
      .spyOn(deleteDrawRepositoryMock, "delete")
      .mockImplementationOnce(throwError);
    const promise = sut.execute({ drawId, userId });

    await expect(promise).rejects.toThrow();
  });

  it("should call LoadDrawByIdRepository with correct value", async () => {
    const { sut, loadDrawByIdRepositoryMock } = makeSut();

    await sut.execute({ drawId, userId });

    expect(loadDrawByIdRepositoryMock.drawId).toBe(drawId);
  });

  it("should throw if LoadDrawByIdRepository throws", async () => {
    const { sut, loadDrawByIdRepositoryMock } = makeSut();

    jest
      .spyOn(loadDrawByIdRepositoryMock, "loadById")
      .mockImplementationOnce(throwError);
    const promise = sut.execute({ drawId, userId });

    await expect(promise).rejects.toThrow();
  });

  it("should throw if userId is different", async () => {
    const { sut, loadDrawByIdRepositoryMock } = makeSut();

    loadDrawByIdRepositoryMock.output.userId = "other_user_id";
    const promise = sut.execute({ drawId, userId });

    await expect(promise).rejects.toThrow();
  });
});
