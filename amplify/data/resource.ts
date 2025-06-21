import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

/* ---------- cross-region inference -------------------------------------------------- */

export const model = 'amazon.nova-micro-v1:0';
export const crossRegionModel = `eu.${model}`;

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
