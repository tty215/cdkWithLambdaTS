import dayjs = require('dayjs');
import utc = require('dayjs/plugin/utc');
import timezone = require('dayjs/plugin/timezone');
import 'dayjs/locale/ja';
import { v4 as uuidv4 } from 'uuid';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale('ja');

/**
 * DynamoDBに保存するデフォルトの値を取得する
 *
 * ※ Dynamooseのdefaultが値を返さないので手動で追加する
 * https://github.com/dynamoose/dynamoose/issues/905
 */
export class DefaultValue {
  public static id(prefix?: string): string {
    return `${prefix ? prefix + '-' : ''}${uuidv4()}`;
  }

  public static timestamp(): number {
    return dayjs().valueOf();
  }
}
