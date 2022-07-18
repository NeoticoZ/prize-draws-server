import { Encrypter, HashComparer } from "@/data/contracts";

export class HashComparerStub implements HashComparer {
  plainText: string;
  digest: string;
  output = true;

  async compare(plainText: string, digest: string): Promise<boolean> {
    this.plainText = plainText;
    this.digest = digest;
    return this.output;
  }
}

export class EncrypterStub implements Encrypter {
  plaintext: string;
  output = "any_token";

  async encrypt(plaintext: string): Promise<string> {
    this.plaintext = plaintext;
    return this.output;
  }
}
