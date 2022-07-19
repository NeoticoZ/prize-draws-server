import {
  AddParticipationRepository,
  CheckIfIsParticipingRepository,
} from "@/data/contracts";
import { AddParticipation } from "@/domain/usecases";

export class AddParticipationService implements AddParticipation {
  constructor(
    private readonly addParticipationRepository: AddParticipationRepository,
    private readonly checkIfIsParticipingRepository: CheckIfIsParticipingRepository
  ) {}

  public async add({ drawId, userId }: AddParticipation.Params): Promise<void> {
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
