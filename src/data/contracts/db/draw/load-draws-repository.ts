import { Draw } from "@/domain/models";

export interface LoadDrawsRepository {
  loadAll(): Promise<LoadDrawsRepository.Output>;
}

export namespace LoadDrawsRepository {
  export type Output = Draw[] | undefined;
}
