import { UserModel } from '../../db/user';

export class ListUserLogic {
  public static async listItems(): Promise<unknown> {
    return UserModel.scan().exec();
  }
}
