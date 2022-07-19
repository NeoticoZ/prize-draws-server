import { Participation } from "@/domain/models";

export interface LoadParticipations {
  load(drawId: string): Promise<LoadParticipations.Output>;
}

export namespace LoadParticipations {
  export type Output = Participation[];
}
