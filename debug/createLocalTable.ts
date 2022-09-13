import { readFileSync } from 'fs';
import { load } from 'js-yaml';
import { execSync } from 'child_process';
import { unlinkSync, writeFileSync } from 'fs';
const path = require('path');

const data = readFileSync(path.join(__dirname, './template.yaml'), 'utf8');
const template = JSON.parse(JSON.stringify(load(data) as any));

const createTableCommand = (schema: any) => {
  const tmpFilePath = path.join(
    __dirname,
    `./schema.${schema.TableName.toLowerCase()}.json`
  );
  try {
    writeFileSync(tmpFilePath, JSON.stringify(schema, null, 2));
  } catch (e) {
    console.error(e);
    process.exit(1);
  }

  console.info('-------------------------------------');
  console.info(`create table: ${schema.TableName}...`);
  try {
    execSync(
      `AWS_SECRET_ACCESS_KEY=local AWS_ACCESS_KEY_ID=local AWS_DEFAULT_REGION=local aws dynamodb create-table --cli-input-json file://${tmpFilePath} --endpoint-url http://localhost:8000`
    );
    console.info(`${schema.TableName} created.`);
  } catch (e) {
    if ((e as any).message.includes('ResourceInUseException')) {
      console.info(`${schema.TableName} is already created.`);
    } else {
      console.error(e);
      process.exit(1);
    }
  } finally {
    unlinkSync(tmpFilePath);
  }

  console.info('-------------------------------------');
};

const main = () => {
  // テーブルリソースだけを抽出
  const tables = Object.values(template.Resources)
    .filter((resource: any) => resource.Type === 'AWS::DynamoDB::Table')
    .map((resource: any) => resource.Properties);

  // 引数がある場合は特定のテーブルだけ作成する
  if (process.argv[2]) {
    const target = tables.filter(
      (table: any) => table.TableName === process.argv[2]
    );

    if (target.length === 0) {
      console.error('target table is not found.');
      process.exit(1);
    }

    createTableCommand(target[0]);
  }
  // 引数がない場合は全てのテーブルを作成する
  else {
    tables.forEach((table: any) => createTableCommand(table));
  }
};

main();
process.exit(0);
