import { Encrypter } from '@/data/protocols/encrypter';
import bcrypt from 'bcrypt';

export class BCryptAdapter implements Encrypter {
  private readonly saltRounds: number;
  constructor(saltRounds: number) {
    this.saltRounds = saltRounds;
  }
  async encrypt(value: string): Promise<string> {
    const hashedValue = await bcrypt.hash(value, this.saltRounds);
    console.log(hashedValue);
    return hashedValue;
  }
}
