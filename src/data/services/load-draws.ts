import { LoadDrawsRepository } from "@/data/contracts";
import { LoadDraws } from "@/domain/usecases";

export class LoadDrawsService implements LoadDraws {
  constructor(private readonly loadDrawsRepository: LoadDrawsRepository) {}

  async load(): Promise<LoadDraws.Output> {
    return await this.loadDrawsRepository.loadAll();
  }
}
