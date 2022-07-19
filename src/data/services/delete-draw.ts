import { DeleteDrawRepository, LoadDrawByIdRepository } from "@/data/contracts";

export class DeleteDrawService {
  constructor(
    private readonly deleteDrawRepository: DeleteDrawRepository,
    private readonly loadDrawByIdRepository: LoadDrawByIdRepository
  ) {}

  async execute({
    drawId,
    userId,
  }: DeleteDrawRepository.Params): Promise<void> {
    const draw = await this.loadDrawByIdRepository.loadById({ drawId });
    if (draw) {
      if (draw.userId !== userId) {
        throw new Error("Unauthorized");
      }
      await this.deleteDrawRepository.delete({ drawId, userId });
    }
  }
}
