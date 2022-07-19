import {
  AddParticipationRepository,
  CheckIfIsParticipingRepository,
} from "@/data/contracts";

export class AddParticipationService {
  constructor(
    private readonly addParticipationRepository: AddParticipationRepository,
    private readonly checkIfIsParticipingRepository: CheckIfIsParticipingRepository
  ) {}

  public async execute({
    drawId,
    userId,
  }: AddParticipationRepository.Params): Promise<void> {
    const isParticipating = await this.checkIfIsParticipingRepository.check({
      userId,
      drawId,
    });

    if (!isParticipating) {
      await this.addParticipationRepository.add({
        drawId,
        userId,
      });
    }
  }
}
