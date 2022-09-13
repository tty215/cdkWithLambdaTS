import * as cdk from 'aws-cdk-lib';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Duration, App } from 'aws-cdk-lib';
import { AttributeType, Table } from 'aws-cdk-lib/aws-dynamodb';
import { getConfig, Config, Environments } from './env/config';

export class SampleStack extends cdk.Stack {
  constructor(scope: App, serviceName: string, env: Environments) {
    super(scope, serviceName);

    // 引数から環境変数を取得する
    const config = getConfig(env) as Config;

    new NodejsFunction(this, 'UserCreate', {
      entry: `${process.cwd()}/src/handler/user/create.ts`,
      timeout: Duration.seconds(config.Lambda.timeout),
      memorySize: config.Lambda.memorySize,
      logRetention: config.Lambda.logRetention,
      environment: {
        ENV: env,
        USER_TABLE_NAME: config.DynamoDB.UserTableName,
      },
      bundling: {
        sourceMap: true,
      },
    });

    new NodejsFunction(this, 'UserList', {
      entry: `${process.cwd()}/src/handler/user/list.ts`,
      timeout: Duration.seconds(config.Lambda.timeout),
      memorySize: config.Lambda.memorySize,
      environment: {
        ENV: env,
        USER_TABLE_NAME: config.DynamoDB.UserTableName,
      },
      bundling: {
        sourceMap: true,
      },
    });

    new Table(this, 'Table-User', {
      tableName: config.DynamoDB.UserTableName,
      partitionKey: {
        name: 'id',
        type: AttributeType.STRING,
      },
      removalPolicy: config.DynamoDB.removalPolicy,
      billingMode: config.DynamoDB.billingMode,
      readCapacity: config.DynamoDB.readCapacity ?? undefined,
      writeCapacity: config.DynamoDB.writeCapacity ?? undefined,
    });
  }
}
