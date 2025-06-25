import { generateClient } from 'aws-amplify/api';
import { createAIHooks } from '@aws-amplify/ui-react-ai';
import type { Schema } from '../amplify/data/resource';

/* 2️⃣ create typed data-client instance with userPool auth for conversations */
export const client = generateClient<Schema>({ authMode: "userPool" });

/* 3️⃣ create AI hooks for conversation management */
export const { useAIConversation } = createAIHooks(client);
