import { LoadAccountByToken } from "@/domain/usecases";

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

  export type Output = LoadAccountByToken.Output;
}
