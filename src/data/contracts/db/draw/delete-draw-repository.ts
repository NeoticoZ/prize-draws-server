import { DeleteDraw } from "@/domain/usecases";

export interface DeleteDrawRepository {
  delete: (params: DeleteDrawRepository.Params) => Promise<void>;
}

export namespace DeleteDrawRepository {
  export type Params = DeleteDraw.Params;
}
