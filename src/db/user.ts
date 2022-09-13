import * as dynamoose from 'dynamoose';
import idValidator from '../util/idValidator';

const schema = new dynamoose.Schema(
  {
    id: {
      type: String,
      hashKey: true,
      validate: idValidator.UUIDValidate,
    },
    name: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Number,
      required: true,
    },
    updatedAt: {
      type: Number,
      required: true,
    },
  },
  {
    saveUnknown: false,
  }
);

/**
 * DynamoDBに保存されているデータタイプ
 */
export type UserType = {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
};

export const UserModel = dynamoose.model(
  process.env.USER_TABLE_NAME as string,
  schema,
  {
    create: false,
    waitForActive: {
      enabled: false,
    },
  }
);
