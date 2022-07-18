export interface Authentication {
  auth: (
    authenticationParams: Authentication.Params
  ) => Promise<Authentication.Output>;
}

export namespace Authentication {
  export type Params = {
    email: string;
    password: string;
  };

  export type Output = {
    accessToken: string;
    name: string;
  };
}
