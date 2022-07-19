export interface DeleteDrawRepository {
  delete: (params: DeleteDrawRepository.Params) => Promise<void>;
}

export namespace DeleteDrawRepository {
  export type Params = {
    drawId: string;
    userId: string;
  };
}
