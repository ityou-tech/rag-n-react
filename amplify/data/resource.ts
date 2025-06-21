import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

/* ---------- cross-region inference -------------------------------------------------- */

export const model = 'amazon.nova-micro-v1:0';
export const crossRegionModel = `eu.${model}`;

// TODO: eventually fix IAM permissions for the cross-region model with code-first
// The following needs to be added manually in the 'amplify-ragnreact-<yourname>-ChatDefaultConversationHa-<someid>>' role inline policy:
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

/* ---------- schema -------------------------------------------------------- */

const schema = a.schema({
  chat: a
    .conversation({
      aiModel: {
        resourcePath: crossRegionModel,
      },
      systemPrompt: "You are a helpful assistant. Always give complete answers.",
    })
    .authorization((allow) => allow.owner()),

  generateRecipe: a
    .generation({
      aiModel: {
        resourcePath: crossRegionModel,
      },
      systemPrompt: "You are a helpful assistant that generates recipes.",
    })
    .arguments({
      description: a.string(),
    })
    .returns(
      a.customType({
        name: a.string(),
        ingredients: a.string().array(),
        instructions: a.string(),
      }),
    )
    .authorization((allow) => allow.authenticated()),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema: schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
  },
});
