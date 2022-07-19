import { Draw } from "@/domain/models";

export interface LoadDraws {
  load(): Promise<Draw[]>;
}

export namespace LoadDraws {
  export type Output = Draw[];
}
