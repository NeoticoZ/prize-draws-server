import { LoadDraws } from "@/domain/usecases";

export interface LoadDrawsRepository {
  loadAll(): Promise<LoadDraws.Output>;
}

export namespace LoadDrawsRepository {
  export type Output = LoadDraws.Output;
}
