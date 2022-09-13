import * as aws from 'aws-sdk';
import * as xray from 'aws-xray-sdk';
import * as dynamoose from 'dynamoose';

export const dbInitialize = () => {
  if (process.env.ENV === 'local') {
    console.log('set local settings');

    dynamoose.aws.sdk.config.update({
      region: 'local',
      accessKeyId: 'local',
      secretAccessKey: 'local',
    });

    dynamoose.aws.ddb.local('http://host.docker.internal:8000');
  } else {
    dynamoose.aws.sdk = xray.captureAWS(aws);
  }
};
