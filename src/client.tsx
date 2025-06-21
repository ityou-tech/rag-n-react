import outputs from '../amplify_outputs.json';
import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/api';
import type { Schema } from '../amplify/data/resource';

/* 1️⃣ configure Amplify with the generated outputs */
Amplify.configure(outputs);

/* 2️⃣ create typed data-client instance with userPool auth for conversations */
export const client = generateClient<Schema>({ authMode: "userPool" });
