import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { faker } from "@faker-js/faker";

// ✅ Replace with your actual region and deployed table name
const REGION = "eu-central-1";
const TABLE_NAME = "CustomerTeam-<your-env>-NONE"; // Use actual name, e.g. CustomerTeam-dev

const client = new DynamoDBClient({ region: REGION });

function createFakeCustomerTeam() {
  const now = new Date().toISOString();
  const futureDate = faker.date.future({ years: 1 }).toISOString();

  return {
    teamId: { S: faker.string.uuid() },
    teamName: { S: faker.company.name() },
    companyName: { S: faker.company.name() },
    industry: { S: faker.helpers.arrayElement(["technology", "finance", "healthcare", "education", "retail"]) },
    teamSize: { N: faker.number.int({ min: 5, max: 250 }).toString() },
    teamLeadName: { S: faker.person.fullName() },
    teamLeadEmail: { S: faker.internet.email() },
    teamLeadPhone: { S: faker.phone.number() },
    onboardingCompleted: { BOOL: faker.datatype.boolean() },
    features: {
      M: {
        etlEnabled: { BOOL: faker.datatype.boolean() },
        dwhEnabled: { BOOL: faker.datatype.boolean() },
        biEnabled: { BOOL: faker.datatype.boolean() },
        activatedAt: { S: faker.date.past({ years: 1 }).toISOString() }
      }
    },
    subscriptionPlan: { S: faker.helpers.arrayElement(["bronze", "silver", "gold"]) },
    subscriptionStatus: { S: faker.helpers.arrayElement(["active", "trial", "cancelled"]) },
    contractValue: { N: faker.number.float({ min: 500, max: 20000, precision: 0.01 }).toString() },
    renewalDate: { S: futureDate }
  };
}

async function seed(count = 100) {
  for (let i = 0; i < count; i++) {
    const item = createFakeCustomerTeam();
    const command = new PutItemCommand({ TableName: TABLE_NAME, Item: item });

    try {
      await client.send(command);
      console.log(`✅ Inserted teamId: ${item.teamId.S}`);
    } catch (err) {
      console.error("❌ Error inserting item:", err);
    }
  }
}

seed();
// To run this script, use the command:
// node dev_scripts/populateCustomerTeams.js
// Ensure you have the AWS SDK and Faker.js installed in your project
// npm install @aws-sdk/client-dynamodb @faker-js/faker
// Make sure your AWS credentials are configured properly.