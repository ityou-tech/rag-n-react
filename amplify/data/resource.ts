import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

/* -------------------------------------------------------------------------- */
/*                              cross-region model                             */
/* -------------------------------------------------------------------------- */

export const model = "amazon.nova-micro-v1:0";
export const crossRegionModel = `eu.${model}`;

// NOTE ──────────────────────────────────────────────────────────────────────
// For cross-region Bedrock access you still need to edit the inline-policy.
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
    })
    .identifier(["teamId"])
    .authorization(allow => [allow.authenticated()]),

  /* ---------------------------- custom queries --------------------------- */

  getTeamCount: a
    .query()
    .returns(a.integer())
    .authorization(allow => [allow.authenticated()])
    .handler(
      a.handler.custom({
        dataSource: a.ref("CustomerTeam"),
        entry: "./scanTeam.js"
      })
    ),

  /* ---------------------------- chat function ---------------------------- */
  chat: a
    .conversation({
      aiModel: { resourcePath: crossRegionModel },
      inferenceConfiguration: { maxTokens: 1024 },

      /* -------- improved system prompt ----------------------------------- */
      systemPrompt:
        "You are Rag-n-React, the DataCloud platform assistant. " +
        "For listing teams, use CustomerTeamQuery without filters. " +
        "For specific teams, use CustomerTeamQuery with filters. " +
        "When summarizing a customer team, respond with a **TeamInfoCard**. " +
        "Provide clear, concise answers in Markdown format. " +
        "If there are any errors with tools, include the full error details in your response to help with debugging.",

      /* ----------------------- available tools --------------------------- */
      tools: [
        a.ai.dataTool({
          name: "CustomerTeamQuery",
          description: "Query customer teams with optional filters. Returns team details including: " +
            "teamId, teamName, companyName, industry, teamSize, team lead info (name/email/phone), " +
            "onboardingCompleted status, features (etl/dwh/bi enabled), subscription plan/status. " +
            "**Use without filters** to list all teams. " +
            "**Use with filters** to find specific teams by any field (e.g., filter by companyName, industry, subscriptionStatus). " +
            "For simple team counts, use GetTeamCount instead. " +
            "Supports pagination for large result sets.",
          model: a.ref("CustomerTeam"),
          modelOperation: "list",
        }),
        a.ai.dataTool({
          name: "GetTeamCount",
          description: `Returns the **current** number of unique customer teams. ` +
            `**Always call this tool** whenever the user asks—directly or indirectly—` +
            `for the team count (e.g. 'how many teams?', 'team total', 'unique teams'), ` +
            `even if you think you already answered or remember a recent value. ` +
            `The count can change at any time, so do **NOT** rely on memory; ` +
            `re-run the query to ensure accuracy.` +
            "Supports pagination for large result sets.",
          query: a.ref("getTeamCount"),
        }),
      ],
    })
    .authorization((allow) => allow.owner()),
});

// ---
export type Schema = ClientSchema<typeof schema>;

/* -------------------------------------------------------------------------- */
/*                        Amplify data configuration                           */
/* -------------------------------------------------------------------------- */

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
  },
  // logging: true,
});
