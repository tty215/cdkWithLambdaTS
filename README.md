# Welcome to your CDK TypeScript project

- CDK で Lambda+TypeScript を構築するテンプレ
- VSCode でのデバッグを想定

## デバッグ準備

```bash
# 1.docker network 生成
$ docker network create cdk-sample

# 2.docker上にDynamoDB Localをホスト（debugディレクトリ上で実行）
$ docker-compose up -d

# 3.CDK Templateを生成
$ cdk synth --no-staging > ./debug/template.yaml

# 4.DynamoDB Localに定義したテーブルを生成
$ npx ts-node ./debug/createLocalTable.ts
```

## デバッグ方法

```bash
# 1.docker実行（起動中の場合はスキップ）
$ docker-compose up -d

# 2.CDK Templateを生成（Lambda更新時は都度）
$ cdk synth --no-staging > ./debug/template.yaml

# 3.SAM Local CLIで実行（デバッグポートを指定して待機状態になる）
$ npm run invoke:createUser

# 4.VSCodeからデバッグ実行
```
