import { Draw } from "@/domain/models";

export interface LoadDrawByIdRepository {
  loadById: (
    drawId: LoadDrawByIdRepository.Params
  ) => Promise<LoadDrawByIdRepository.Output>;
}

export namespace LoadDrawByIdRepository {
  export type Params = {
    drawId: string;
  };

  export type Output = Draw;
}
