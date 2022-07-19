import { LoadDrawsRepository } from "@/data/contracts";

export class LoadDrawsRepositoryMock implements LoadDrawsRepository {
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
