import type { PreSignUpTriggerHandler } from 'aws-lambda';
import { env } from '$amplify/env/pre-sign-up';

export const handler: PreSignUpTriggerHandler = async (event) => {
  const email = event.request.userAttributes['email'];

  if (!email.endsWith(env.ALLOW_DOMAIN)) {
    throw new Error('Invalid email domain, contact maintainer to be added');
  }

  return event;
};