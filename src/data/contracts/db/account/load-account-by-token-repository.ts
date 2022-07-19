export interface LoadAccountByTokenRepository {
  loadByToken({
    token,
    role,
  }: LoadAccountByTokenRepository.Params): Promise<LoadAccountByTokenRepository.Output>;
}

export namespace LoadAccountByTokenRepository {
  export type Params = {
    token: string;
    role?: string;
  };

  export type Output = {
    id: string;
  };
}
