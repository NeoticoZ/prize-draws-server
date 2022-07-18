import { User } from "@/domain/models";

export interface LoadAccountByEmailRepository {
  loadByEmail(email: string): Promise<LoadAccountByEmailRepository.Output>;
}

export namespace LoadAccountByEmailRepository {
  export type Output = User;
}
