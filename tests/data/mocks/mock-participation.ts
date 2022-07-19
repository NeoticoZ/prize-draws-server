import {
  AddParticipationRepository,
  CheckIfIsParticipingRepository,
} from "@/data/contracts";

export class AddParticipationRepositoryMock
  implements AddParticipationRepository
{
  drawId: string;
  userId: string;
  callsCount = 0;

  async add({
    drawId,
    userId,
  }: AddParticipationRepository.Params): Promise<void> {
    this.drawId = drawId;
    this.userId = userId;
    this.callsCount++;
  }
}

export class CheckIfIsParticipingRepositoryMock
  implements CheckIfIsParticipingRepository
{
  userId: string;
  drawId: string;
  callsCount = 0;
  output = false;

  async check({
    userId,
    drawId,
  }: CheckIfIsParticipingRepository.Params): Promise<CheckIfIsParticipingRepository.Output> {
    this.userId = userId;
    this.drawId = drawId;
    this.callsCount++;
    return this.output;
  }
}
