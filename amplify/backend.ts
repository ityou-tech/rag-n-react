import { defineBackend } from '@aws-amplify/backend';
// import * as iam from "aws-cdk-lib/aws-iam";
import { auth } from './auth/resource';
import { data } from './data/resource';

defineBackend({
  auth,
  data,
});
