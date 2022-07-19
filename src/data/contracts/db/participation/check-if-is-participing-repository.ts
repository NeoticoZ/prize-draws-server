export interface CheckIfIsParticipingRepository {
  check: ({
    userId,
    drawId,
  }: CheckIfIsParticipingRepository.Params) => Promise<CheckIfIsParticipingRepository.Output>;
}

export namespace CheckIfIsParticipingRepository {
  export type Params = {
    userId: string;
    drawId: string;
  };

  export type Output = boolean;
}
