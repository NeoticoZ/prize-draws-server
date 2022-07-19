import { Participation } from "@/domain/models";

export interface LoadParticipationsByDrawIdRepository {
  loadAll: (
    drawId: string
  ) => Promise<LoadParticipationsByDrawIdRepository.Output>;
}

export namespace LoadParticipationsByDrawIdRepository {
  export type Output = Participation[];
}
