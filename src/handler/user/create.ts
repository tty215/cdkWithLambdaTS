import * as lambda from 'aws-lambda';
import { CreateUserLogic } from '../../logic/user/create';

export async function handler(
  event: lambda.AppSyncResolverEvent<{
    input: {
      name: string;
    };
  }>,
  context: lambda.Context,
  callback: lambda.Callback
): Promise<void> {
  console.log(event);
  const logic = CreateUserLogic.instance();

  let res;
  try {
    res = await logic.createItem(event.arguments.input);
  } catch (error) {
    console.error(error);
    callback(error as Error);
    return;
  }

  console.log(res);
  callback(null, res);
}
