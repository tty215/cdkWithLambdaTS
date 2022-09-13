import * as lambda from 'aws-lambda';
import { ListUserLogic } from '../../logic/user/list';

export async function handler(
  event: lambda.AppSyncResolverEvent<{}>,
  context: lambda.Context,
  callback: lambda.Callback
): Promise<void> {
  // DynamoDBにデータを保存する
  let res;
  try {
    res = await ListUserLogic.listItems();
  } catch (error) {
    console.error(error);
    callback(error as Error);
    return;
  }

  console.log(res);
  callback(null, res);
}
