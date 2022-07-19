import { LoadParticipationsByDrawIdRepository } from "@/data/contracts";

export class LoadParticipationsService {
  constructor(
    private readonly loadParticipationsByDrawIdRepository: LoadParticipationsByDrawIdRepository
  ) {}

  async execute(
    drawId: string
  ): Promise<LoadParticipationsByDrawIdRepository.Output> {
    return this.loadParticipationsByDrawIdRepository.loadAll(drawId);
  }
}
