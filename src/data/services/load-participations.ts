import { LoadParticipationsByDrawIdRepository } from "@/data/contracts";
import { LoadParticipations } from "@/domain/usecases";

export class LoadParticipationsService implements LoadParticipations {
  constructor(
    private readonly loadParticipationsByDrawIdRepository: LoadParticipationsByDrawIdRepository
  ) {}

  async load(drawId: string): Promise<LoadParticipations.Output> {
    return this.loadParticipationsByDrawIdRepository.loadAll(drawId);
  }
}
