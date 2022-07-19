import { Draw } from "@/domain/models";

export interface AddDraw {
  add(draw: AddDraw.Params): Promise<void>;
}

export namespace AddDraw {
  export type Params = Omit<Draw, "id">;
}
