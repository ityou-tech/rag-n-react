// recourse.ts
import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

/* -------------------------------------------------------------------------- */
/*                              cross-region model                             */
/* -------------------------------------------------------------------------- */

export const model = "amazon.nova-micro-v1:0";
export const crossRegionModel = `eu.${model}`;

// NOTE ──────────────────────────────────────────────────────────────────────
// For cross-region Bedrock access you still need the inline-policy snippet shown below.
// The below IAM statement is an example for EU regions, adjust the region and account ID as needed.
// This is required to allow the `ChatDefaultConversationHandler` role to invoke the model
// Change the 'amplify-ragnreact-<yourname>-ChatDefaultConversationHa-<someid>>' role inline policy to include the following statement:
// {
//     "Version": "2012-10-17",
//     "Statement": [
//         {
//             "Effect": "Allow",
//             "Action": [
//                 "bedrock:InvokeModel",
//                 "bedrock:InvokeModelWithResponseStream"
//             ],
//             "Resource": [
//                 "arn:aws:bedrock:eu-central-1:123456789123:inference-profile/eu.amazon.nova-micro-v1:0"
//             ]
//         },
//         {
//             "Effect": "Allow",
//             "Action": [
//                 "bedrock:InvokeModel",
//                 "bedrock:InvokeModelWithResponseStream"
//             ],
//             "Resource": [
//                 "arn:aws:bedrock:eu-north-1::foundation-model/amazon.nova-micro-v1:0",
//                 "arn:aws:bedrock:eu-west-1::foundation-model/amazon.nova-micro-v1:0",  
//                 "arn:aws:bedrock:eu-west-3::foundation-model/amazon.nova-micro-v1:0",  
//                 "arn:aws:bedrock:eu-central-1::foundation-model/amazon.nova-micro-v1:0"
//             ],
//             "Condition": {
//                 "StringLike": {
//                     "bedrock:InferenceProfileArn": "arn:aws:bedrock:eu-central-1:123456789123:inference-profile/eu.amazon.nova-micro-v1:0"
//                 }
//             }
//         }
//     ]
// }
//
/* -------------------------------------------------------------------------- */
/*                                custom types                                */
/* -------------------------------------------------------------------------- */

const PlatformUsageType = a.customType({
  etlEnabled: a.boolean(),
  dwhEnabled: a.boolean(),
  biEnabled: a.boolean(),
  activatedAt: a.datetime(),
});

/* -------------------------------------------------------------------------- */
/*                                   schema                                   */
/* -------------------------------------------------------------------------- */

const schema = a.schema({
  /* ----------------------------- data models ----------------------------- */
  CustomerTeam: a
    .model({
      teamId: a.string().required(),
      teamName: a.string().required(),
      companyName: a.string().required(),
      industry: a.string(),               // e.g. "technology", "finance"
      teamSize: a.integer(),
      teamLeadName: a.string().required(),
      teamLeadEmail: a.email().required(),
      teamLeadPhone: a.string(),
      onboardingCompleted: a.boolean().default(false),
      features: PlatformUsageType,
      subscriptionPlan: a.string(),       // "bronze", "silver", "gold"
      subscriptionStatus: a.string(),     // "active", "trial", "cancelled"
      contractValue: a.float(),
      renewalDate: a.date(),
    })
    .identifier(["teamId"])
    .authorization((allow) => [allow.owner()]),

  /* ---------------------------- chat function ---------------------------- */
  chat: a
    .conversation({
      aiModel: { resourcePath: crossRegionModel },
      inferenceConfiguration: { maxTokens: 256 },

      /* -------- improved system prompt ----------------------------------- */
      systemPrompt: `
You are **Rag-n-React**, the conversational assistant for our DataCloud platform. Your mission is to help internal users answer questions
about customer teams and platform usage.

• **Think first**: decide whether fresh data is needed.  
  - If a question references a specific team, subscription, contract, onboarding
    state, or renewal date **and** the answer is not already in the chat,
    invoke \`CustomerTeamQuery\` with the minimal filters (prefer \`teamId\`
    or \`teamLeadEmail\`).  
  - Otherwise, answer from what you already know.

• When you call \`CustomerTeamQuery\`, briefly cite the key filter used
  (e.g. “queried by \`teamId=ACME-1234\`”).

• If the request is ambiguous or lacks identifiers, ask one concise follow-up
  question _before_ querying.

• Reply in **Markdown**:  
  - Use a level-1 heading if the reply > 4 sentences.  
  - Bullets for lists, tables (≤ 6 cols) for structured data.  
  - **Bold** critical numbers & dates.

• Tone: professional, concise, friendly.  
• Aim for 3-6 sentences unless deep technical detail is asked.  
• **Never** reveal or guess sensitive PII beyond user-supplied data or
  tool results.  
• Decline politely if asked for out-of-scope content (e.g. legal advice).

Remember: **Think → (optional) Tool → Respond**. Provide complete, clear,
and safe answers only.
      `.trim(),

      /* ----------------------- available tools --------------------------- */
      tools: [
        a.ai.dataTool({
          name: "CustomerTeamQuery",
          description: "Searches for Customer Team records",
          model: a.ref("CustomerTeam"),
          modelOperation: "list",
        }),
      ],
    })
    .authorization((allow) => allow.owner()),
});

export type Schema = ClientSchema<typeof schema>;

/* -------------------------------------------------------------------------- */
/*                        Amplify data configuration                           */
/* -------------------------------------------------------------------------- */

export const data = defineData({
  schema,
  authorizationModes: { defaultAuthorizationMode: "userPool" },
});
