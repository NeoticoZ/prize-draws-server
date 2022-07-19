import { AddDraw } from "@/domain/usecases";

export interface AddDrawRepository {
  add: (input: AddDrawRepository.Params) => Promise<void>;
}

export namespace AddDrawRepository {
  export type Params = AddDraw.Params;
}
