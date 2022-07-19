import { Participation } from "@/domain/models";

export interface DeleteDraw {
  delete(params: DeleteDraw.Params): Promise<void>;
}

export namespace DeleteDraw {
  export type Params = Participation;
}
