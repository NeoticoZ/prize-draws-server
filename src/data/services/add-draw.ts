import { AddDrawRepository } from "@/data/contracts";
import { AddDraw } from "@/domain/usecases";

export class AddDrawService implements AddDraw {
  constructor(private readonly addDrawRepository: AddDrawRepository) {}

  async add(draw: AddDraw.Params): Promise<void> {
    await this.addDrawRepository.add(draw);
  }
}
