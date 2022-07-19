import { AddDrawRepository } from "@/data/contracts";

export class AddDrawService {
  constructor(private readonly addDrawRepository: AddDrawRepository) {}

  async execute(draw: AddDrawRepository.Params): Promise<void> {
    await this.addDrawRepository.add(draw);
  }
}
