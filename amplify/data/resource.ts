import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

// Custom type: platform feature enablement
const PlatformUsageType = a.customType({
  etlEnabled: a.boolean(),
  dwhEnabled: a.boolean(),
  biEnabled: a.boolean(),
  activatedAt: a.datetime()
});

// Schema definition
const schema = a.schema({
  Message: a
    .model({
      content: a.string(),
      role: a.string(), // 'user' or 'assistant'
      timestamp: a.datetime(),
    })
    .authorization((allow) => [allow.owner()]),

  CustomerTeam: a
    .model({
      teamId: a.string().required(),
      teamName: a.string().required(),
      companyName: a.string().required(),
      industry: a.string(), // e.g. 'technology', 'finance'
      teamSize: a.integer(),
      teamLeadName: a.string().required(),
      teamLeadEmail: a.email().required(),
      teamLeadPhone: a.string(),
      onboardingCompleted: a.boolean().default(false),
      features: PlatformUsageType,
      subscriptionPlan: a.string(), // e.g. 'bronze', 'silver', 'gold'
      subscriptionStatus: a.string(), // 'active', 'trial', 'cancelled'
      contractValue: a.float(),
      renewalDate: a.date(),
    })
    .identifier(["teamId"])
    .authorization((allow) => [allow.owner()])
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema: schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
  },
});
