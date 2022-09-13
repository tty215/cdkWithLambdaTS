#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { SampleStack } from '../lib/sampleStack';
import { createLaunch } from '../lib/setting';
import { Environments, getConfig } from '../lib/env/config';

const app = new cdk.App();

// Contextから対象の環境(local|dev|prod)を取得
const env: Environments = app.node.tryGetContext('env') as Environments;
const config = getConfig(env);

// envが定義されていない、もしくは不正な値だった場合エラーで落とす
if (!env || !config) {
  throw new Error('Invalid target environment.');
}

const stack = new SampleStack(app, 'SampleStack', env);

// .vscode/launch.jsonを更新する
createLaunch(stack);
