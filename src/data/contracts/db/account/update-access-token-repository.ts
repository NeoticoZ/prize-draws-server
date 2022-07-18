export interface UpdateAccessTokenRepository {
  updateAccessToken(userId: string, accessToken: string): Promise<void>;
}
