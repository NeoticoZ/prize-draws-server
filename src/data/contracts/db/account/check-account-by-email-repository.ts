export interface CheckAccountByEmailRepository {
  loadByEmail(email: string): Promise<CheckAccountByEmailRepository.Output>;
}

export namespace CheckAccountByEmailRepository {
  export type Output = boolean;
}
