import { DynamoDBClient, PutItemCommand, ScanCommand, DeleteItemCommand } from "@aws-sdk/client-dynamodb";
import { faker } from "@faker-js/faker";

// Configuration - Try to auto-detect table name from Amplify outputs
const REGION = process.env.AWS_REGION || "eu-central-1";
let TABLE_NAME = process.env.CUSTOMER_TEAM_TABLE_NAME;

if (!TABLE_NAME) {
  console.error("❌ Could not determine table name automatically.");
  console.error("💡 Please set the CUSTOMER_TEAM_TABLE_NAME environment variable.");
  console.error("📋 Example: export CUSTOMER_TEAM_TABLE_NAME=CustomerTeam-ct2fqxniubax7jwnx6aegbpq2i-NONE");
  console.error("🔍 To find your table name, check AWS Console > DynamoDB > Tables");
  process.exit(1);
}

const client = new DynamoDBClient({ region: REGION });

// Function to create a fake customer team item
function createFakeCustomerTeam() {
    // Generate the full name first
    const teamLeadName = faker.person.fullName();
    
    // Extract first and last name for email generation
    const nameParts = teamLeadName.split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts[nameParts.length - 1]; // Handle middle names
    
    const now = new Date().toISOString();
    
    return {
    teamId: { S: faker.string.uuid() },
    teamName: { S: faker.company.name() },
    companyName: { S: faker.company.name() },
    industry: { S: faker.helpers.arrayElement(["technology", "finance", "healthcare", "education", "retail"]) },
    teamSize: { N: faker.number.int({ min: 2, max: 15 }).toString() },
    teamLeadName: { S: teamLeadName },
    teamLeadEmail: { S: faker.internet.email({ firstName, lastName }) },
    teamLeadPhone: { S: faker.phone.number() },
    onboardingCompleted: { BOOL: faker.datatype.boolean() },
    features: {
      M: {
        etlEnabled: { BOOL: faker.datatype.boolean() },
        dwhEnabled: { BOOL: faker.datatype.boolean() },
        biEnabled: { BOOL: faker.datatype.boolean() },
      }
    },
    subscriptionPlan: { S: faker.helpers.arrayElement(["bronze", "silver", "gold"]) },
    subscriptionStatus: { S: faker.helpers.arrayElement(["active", "trial", "cancelled"]) },
    contractValue: { N: faker.number.float({ min: 500, max: 20000, precision: 0.01 }).toString() },
    createdAt: { S: now },
    updatedAt: { S: now },
  };
}

async function clearExistingData() {
  console.log("🗑️ Clearing existing data...");
  try {
    const scanCommand = new ScanCommand({ TableName: TABLE_NAME });
    const result = await client.send(scanCommand);
    
    if (result.Items && result.Items.length > 0) {
      console.log(`Found ${result.Items.length} existing records. Deleting...`);
      
      let deleteCount = 0;
      let errorCount = 0;
      
      for (const item of result.Items) {
        try {
          const deleteCommand = new DeleteItemCommand({
            TableName: TABLE_NAME,
            Key: {
              teamId: item.teamId
            }
          });
          
          await client.send(deleteCommand);
          deleteCount++;
          console.log(`🗑️ Deleted record ${deleteCount}/${result.Items.length}`);
          
          // Add small delay to avoid throttling
          if (deleteCount % 10 === 0) {
            await new Promise(resolve => setTimeout(resolve, 100));
          }
        } catch (deleteErr) {
          errorCount++;
          console.error(`❌ Error deleting record:`, deleteErr.message);
        }
      }
      
      console.log(`✅ Successfully deleted: ${deleteCount} records`);
      if (errorCount > 0) {
        console.log(`❌ Failed to delete: ${errorCount} records`);
      }
    } else {
      console.log("No existing records found.");
    }
  } catch (err) {
    console.error("❌ Error scanning table:", err.message);
    throw err;
  }
}

async function seed(count = 100, clearFirst = false) {
  console.log(`🚀 Starting data generation for table: ${TABLE_NAME}`);
  console.log(`📍 Region: ${REGION}`);
  console.log(`📊 Records to create: ${count}`);
  
  if (clearFirst) {
    await clearExistingData();
  }
  
  let successCount = 0;
  let errorCount = 0;
  
  for (let i = 0; i < count; i++) {
    try {
      const item = createFakeCustomerTeam();
      const command = new PutItemCommand({ TableName: TABLE_NAME, Item: item });
      
      await client.send(command);
      successCount++;
      console.log(`✅ [${i + 1}/${count}] Inserted teamId: ${item.teamId.S}`);
      
      // Add small delay to avoid throttling
      if (i % 10 === 9) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    } catch (err) {
      errorCount++;
      console.error(`❌ [${i + 1}/${count}] Error inserting item:`, err.message);
      
      // If too many errors, stop execution
      if (errorCount > 10) {
        console.error("❌ Too many errors, stopping execution");
        break;
      }
    }
  }
  
  console.log("\n📈 Summary:");
  console.log(`✅ Successfully inserted: ${successCount} records`);
  console.log(`❌ Failed insertions: ${errorCount} records`);
  console.log(`📊 Total processed: ${successCount + errorCount}/${count}`);
}

// Main execution
const args = process.argv.slice(2);
const count = args.length > 0 ? parseInt(args[0]) || 100 : 100;
const clearFirst = args.includes('--clear');

seed(count, clearFirst).catch(err => {
  console.error("💥 Script execution failed:", err.message);
  process.exit(1);
});

// Usage instructions:
// CUSTOMER_TEAM_TABLE_NAME=<your-table-name> node dev_scripts/populateCustomerTeams.js [count] [--clear]
// Examples:
//   CUSTOMER_TEAM_TABLE_NAME=CustomerTeam-ct2fqxniubax7jwnx6aegbpq2i-NONE node dev_scripts/populateCustomerTeams.js           # Creates 100 records
//   CUSTOMER_TEAM_TABLE_NAME=CustomerTeam-ct2fqxniubax7jwnx6aegbpq2i-NONE node dev_scripts/populateCustomerTeams.js 50        # Creates 50 records
//   CUSTOMER_TEAM_TABLE_NAME=CustomerTeam-ct2fqxniubax7jwnx6aegbpq2i-NONE node dev_scripts/populateCustomerTeams.js 100 --clear # Clears first, then creates 100
//
// Prerequisites:
// npm install @aws-sdk/client-dynamodb @faker-js/faker
// Ensure AWS credentials are configured (aws configure or environment variables)
// Set CUSTOMER_TEAM_TABLE_NAME environment variable with your actual DynamoDB table name