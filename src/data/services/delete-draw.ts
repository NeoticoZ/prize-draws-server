import { DeleteDrawRepository, LoadDrawByIdRepository } from "@/data/contracts";
import { DeleteDraw } from "@/domain/usecases";

export class DeleteDrawService implements DeleteDraw {
  constructor(
    private readonly deleteDrawRepository: DeleteDrawRepository,
    private readonly loadDrawByIdRepository: LoadDrawByIdRepository
  ) {}

  async delete({ drawId, userId }: DeleteDraw.Params): Promise<void> {
    const draw = await this.loadDrawByIdRepository.loadById({ drawId });
    if (draw) {
      if (draw.userId !== userId) {
        throw new Error("Unauthorized");
      }
      await this.deleteDrawRepository.delete({ drawId, userId });
    }
  }
}
