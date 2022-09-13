import * as fs from 'fs';
import * as path from 'path';
import { SampleStack } from '../sampleStack';

const assetPlaceHolder = 'ASSET_PATH';
const configuration = {
  type: 'node',
  request: 'attach',
  name: '',
  port: 5858,
  address: 'localhost',
  localRoot: '${workspaceFolder}/cdk.out/' + assetPlaceHolder,
  remoteRoot: '/var/task',
};
type Config = typeof configuration;

export const createLaunch = async (stack: SampleStack) => {
  let buf;
  try {
    buf = fs.readFileSync(
      path.join(process.cwd(), 'cdk.out', stack.templateFile)
    );
  } catch (e) {
    // 初回実行時はファイルがないのでスルーする
    if (e.code === 'ENOENT') {
      return;
    } else {
      throw e;
    }
  }

  const template = JSON.parse(buf.toString());
  const resources = template.Resources;
  const confs: Config[] = [];

  for (const prop in resources) {
    if (
      resources[prop].Type !== 'AWS::Lambda::Function' ||
      prop.includes('LogRetention')
    ) {
      continue;
    }

    const fnName = resources[prop].Metadata['aws:cdk:path'].split('/')[1];
    const assetPath = resources[prop].Metadata['aws:asset:path']
      .split('/')
      .pop();

    confs.push({
      ...configuration,
      name: `invoke:${fnName}`,
      localRoot: configuration.localRoot.replace(assetPlaceHolder, assetPath),
    });
  }

  const launch = {
    version: '0.2.0',
    configurations: confs,
  };
  fs.writeFileSync(
    path.resolve(process.cwd(), '.vscode', 'launch.json'),
    JSON.stringify(launch, null, 2)
  );
};
