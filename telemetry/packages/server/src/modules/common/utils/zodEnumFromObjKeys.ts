import { z } from 'zod';

export function zodEnumFromObjKeys<K extends string>(
  obj: Record<K, any>,
): z.ZodEnum<[K, ...K[]]> {
  const [firstKey, ...otherKeys] = Object.keys(obj) as K[];
  return z.enum([firstKey, ...otherKeys]);
}
