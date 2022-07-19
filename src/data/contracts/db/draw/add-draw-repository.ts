export interface AddDrawRepository {
  add: (input: AddDrawRepository.Params) => Promise<void>;
}

export namespace AddDrawRepository {
  export type Params = {
    name: string;
    description: string;
    userId: string;
    prizeImg: string;
  };
}
