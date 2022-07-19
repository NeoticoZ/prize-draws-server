import { AddParticipation } from "@/domain/usecases";

export interface AddParticipationRepository {
  add: ({ drawId, userId }: AddParticipationRepository.Params) => Promise<void>;
}

export namespace AddParticipationRepository {
  export type Params = AddParticipation.Params;
}
