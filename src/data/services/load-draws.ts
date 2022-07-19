import { LoadDrawsRepository } from "@/data/contracts";

export class LoadDrawsService {
  constructor(private readonly loadDrawsRepository: LoadDrawsRepository) {}

  async execute(): Promise<LoadDrawsRepository.Output> {
    return await this.loadDrawsRepository.loadAll();
  }
}
