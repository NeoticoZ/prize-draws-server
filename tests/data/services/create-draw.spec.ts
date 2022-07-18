import { throwError } from "@/tests/domain/mocks";

class CreateDraw {
  constructor(private readonly createDrawRepository: CreateDrawRepository) {}

  async execute(draw: CreateDrawRepository.Params): Promise<void> {
    await this.createDrawRepository.create(draw);
  }
}

interface CreateDrawRepository {
  create: (
    input: CreateDrawRepository.Params
  ) => Promise<CreateDrawRepository.Output>;
}

namespace CreateDrawRepository {
  export type Params = {
    name: string;
    description: string;
    userId: string;
    prizeImg: string;
  };

  export type Output = GroupDraw | undefined;
}

type GroupDraw = {
  draws: Draw[];
};

type Draw = {
  id: string;
  name: string;
  description: string;
  userId: string;
  prizeImg: string;
};

export type SutTypes = {
  sut: CreateDraw;
  createDrawRepository: CreateDrawRepositoryMock;
};

const makeSut = (): SutTypes => {
  const createDrawRepository = new CreateDrawRepositoryMock();
  const sut = new CreateDraw(createDrawRepository);
  return {
    sut,
    createDrawRepository,
  };
};

class CreateDrawRepositoryMock implements CreateDrawRepository {
  name: string;
  description: string;
  userId: string;
  prizeImg: string;
  callsCount = 0;
  output: GroupDraw = {
    draws: [
      {
        id: "any_id",
        name: "any_name",
        description: "any_description",
        userId: "any_user_id",
        prizeImg: "any_prize_img",
      },
    ],
  };

  async create({
    name,
    description,
    prizeImg,
    userId,
  }: CreateDrawRepository.Params): Promise<CreateDrawRepository.Output> {
    this.name = name;
    this.description = description;
    this.userId = userId;
    this.prizeImg = prizeImg;
    this.callsCount++;
    return this.output;
  }
}

describe("CreateDraw", () => {
  const name = "any_prize_name";
  const description = "any_prize_description";
  const userId = "any_user_id";
  const prizeImg = "any_prize_image";

  it("should call CreateDrawRepository with correct values", async () => {
    const { sut, createDrawRepository } = makeSut();

    await sut.execute({ name, description, userId, prizeImg });

    expect(createDrawRepository.name).toBe(name);
    expect(createDrawRepository.description).toBe(description);
    expect(createDrawRepository.userId).toBe(userId);
    expect(createDrawRepository.prizeImg).toBe(prizeImg);
    expect(createDrawRepository.callsCount).toBe(1);
  });

  it("should throw if CreateDrawRepository throws", async () => {
    const { sut, createDrawRepository } = makeSut();

    jest
      .spyOn(createDrawRepository, "create")
      .mockImplementationOnce(throwError);
    const promise = sut.execute({ name, description, userId, prizeImg });

    await expect(promise).rejects.toThrowError();
  });
});
