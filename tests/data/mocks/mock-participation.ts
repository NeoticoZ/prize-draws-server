import {
  AddParticipationRepository,
  CheckIfIsParticipingRepository,
  LoadParticipationsByDrawIdRepository,
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

export class LoadParticipationsByDrawIdRepositoryMock
  implements LoadParticipationsByDrawIdRepository
{
  drawId: string;
  callsCount = 0;
  output: LoadParticipationsByDrawIdRepository.Output = [
    {
      drawId: "any_draw_id",
      userId: "any_user_id",
    },
  ];

  async loadAll(
    drawId: string
  ): Promise<LoadParticipationsByDrawIdRepository.Output> {
    this.callsCount++;
    this.drawId = drawId;
    return this.output;
  }
}
