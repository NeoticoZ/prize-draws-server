export interface AddParticipationRepository {
  add: ({ drawId, userId }: AddParticipationRepository.Params) => Promise<void>;
}

export namespace AddParticipationRepository {
  export type Params = {
    drawId: string;
    userId: string;
  };
}
