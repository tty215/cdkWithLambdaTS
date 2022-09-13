import * as yaml from 'js-yaml';
import * as fs from 'fs';
import { RemovalPolicy } from 'aws-cdk-lib';
import { BillingMode } from 'aws-cdk-lib/aws-dynamodb';
import { RetentionDays } from 'aws-cdk-lib/aws-logs';

/**
 * 環境名の定義
 */
export enum Environments {
  LOCAL = 'local',
  DEV = 'dev',
  PROD = 'prod',
}

/**
 * 各環境に紐づく環境変数のinterface
 */
export interface Config {
  DynamoDB: {
    removalPolicy: RemovalPolicy;
    billingMode: BillingMode;
    readCapacity: number | null;
    writeCapacity: number | null;
    UserTableName: string;
  };
  Lambda: {
    memorySize: number;
    timeout: number;
    logRetention: RetentionDays;
  };
}

export function getConfig(env: Environments): Config | undefined {
  const name = env === Environments.PROD ? env : Environments.DEV;
  let config;
  try {
    config = yaml.load(
      fs.readFileSync(`${process.cwd()}/lib/env/${name}.yaml`, {
        encoding: 'utf-8',
      })
    ) as Config;
  } finally {
    return config;
  }
}
