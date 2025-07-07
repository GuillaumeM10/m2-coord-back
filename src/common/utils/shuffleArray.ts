import { randomBytes } from 'crypto';

function secureRandom(): number {
  const buf = randomBytes(4);
  return buf.readUInt32BE() / 0xffffffff;
}

export function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(secureRandom() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
