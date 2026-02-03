import * as process from 'process';

export interface PrismaConfig {
  schema?: string;
  migrations?: {
    path: string;
  };
  engine?: string;
  datasource?: {
    url: string;
  };
}

export function defineConfig(config: PrismaConfig): PrismaConfig {
  return config;
}

export function env(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Environment variable ${key} is not defined`);
  }
  return value;
}