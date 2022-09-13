import { UserModel } from '../../db/user';
import { DefaultValue } from '../../util/defaultValue';
import { dbInitialize } from '../../db/init';

export class CreateUserLogic {
  private static base: CreateUserLogic;
  private constructor() {
    dbInitialize();
  }
  static instance() {
    if (!CreateUserLogic.base) {
      CreateUserLogic.base = new CreateUserLogic();
    }
    return CreateUserLogic.base;
  }

  public async createItem(input: { name: string }): Promise<unknown> {
    const timestamp = DefaultValue.timestamp();
    const item = {
      id: DefaultValue.id(),
      createdAt: timestamp,
      updatedAt: timestamp,
      ...input,
    };
    const res = await UserModel.create(item);
    console.log(JSON.stringify(res));
    return res;
  }
}
