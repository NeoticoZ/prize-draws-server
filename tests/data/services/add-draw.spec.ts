import { throwError } from "@/tests/domain/mocks";
import { AddDrawService } from "@/data/services";
import { AddDrawRepositoryMock } from "@/tests/data/mocks";

export type SutTypes = {
  sut: AddDrawService;
  addDrawRepository: AddDrawRepositoryMock;
};

const makeSut = (): SutTypes => {
  const addDrawRepository = new AddDrawRepositoryMock();
  const sut = new AddDrawService(addDrawRepository);
  return {
    sut,
    addDrawRepository,
  };
};

describe("AddDraw", () => {
  const name = "any_prize_name";
  const description = "any_prize_description";
  const userId = "any_user_id";
  const prizeImg = "any_prize_image";

  it("should call AddDrawRepository with correct values", async () => {
    const { sut, addDrawRepository } = makeSut();

    await sut.execute({ name, description, userId, prizeImg });

    expect(addDrawRepository.name).toBe(name);
    expect(addDrawRepository.description).toBe(description);
    expect(addDrawRepository.userId).toBe(userId);
    expect(addDrawRepository.prizeImg).toBe(prizeImg);
    expect(addDrawRepository.callsCount).toBe(1);
  });

  it("should throw if AddDrawRepository throws", async () => {
    const { sut, addDrawRepository } = makeSut();

    jest.spyOn(addDrawRepository, "add").mockImplementationOnce(throwError);
    const promise = sut.execute({ name, description, userId, prizeImg });

    await expect(promise).rejects.toThrowError();
  });
});
