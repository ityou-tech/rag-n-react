# 🛠️ Development Scripts

This directory contains utility scripts for development, testing, and data management for the rags-n-react project.

## 📁 Contents

- [`populateCustomerTeams.js`](populateCustomerTeams.js) — Seeds DynamoDB with fake customer team data

## 🚀 Prerequisites

Before running any scripts, ensure you have:

- Node.js v18+ installed
- AWS CLI configured with appropriate credentials
- Required npm packages installed:

```bash
npm install @aws-sdk/client-dynamodb @faker-js/faker
```

## 🏗️ AWS Setup

1. **Deploy your Amplify environment** first:
   ```bash
   npx ampx sandbox --outputs-format json
   ```

2. **Find your DynamoDB table name** in the AWS Console under DynamoDB > Tables
   - Look for a table named like: `CustomerTeam-<random-id>-NONE`
   - Example: `CustomerTeam-ct2fqxniubax7jwnx6aegbpq2i-NONE`

3. **Set the environment variable** with your actual table name

## 📊 populateCustomerTeams.js

Seeds your DynamoDB CustomerTeam table with realistic fake data for development and testing.

### Key Features

- **Matching Names & Emails**: Team lead names and email addresses are properly matched (e.g., "John Smith" → "john.smith@example.com")
- **Clear Functionality**: `--clear` flag removes existing records before adding new ones
- **Environment Variable Configuration**: Uses `CUSTOMER_TEAM_TABLE_NAME` for table name

### Data Schema

The script generates customer teams with the following structure:

```javascript
{
  teamId: "uuid",
  teamName: "Company Name",
  companyName: "Company Name", 
  industry: "technology" | "finance" | "healthcare" | "education" | "retail",
  teamSize: 2-15,
  teamLeadName: "Full Name",
  teamLeadEmail: "matching.email@example.com", // Matches the team lead name
  teamLeadPhone: "+1234567890",
  onboardingCompleted: true | false,
  features: {
    etlEnabled: true | false,
    dwhEnabled: true | false,
    biEnabled: true | false,
  },
  subscriptionPlan: "bronze" | "silver" | "gold",
  subscriptionStatus: "active" | "trial" | "cancelled",
  contractValue: 500.00-20000.00,
}
```

### Usage

**Basic Usage:**
```bash
CUSTOMER_TEAM_TABLE_NAME=CustomerTeam-ct2fqxniubax7jwnx6aegbpq2i-NONE node dev_scripts/populateCustomerTeams.js
```

**With Custom Count:**
```bash
CUSTOMER_TEAM_TABLE_NAME=CustomerTeam-ct2fqxniubax7jwnx6aegbpq2i-NONE node dev_scripts/populateCustomerTeams.js 50
```

**Clear Existing Data First:**
```bash
CUSTOMER_TEAM_TABLE_NAME=CustomerTeam-ct2fqxniubax7jwnx6aegbpq2i-NONE node dev_scripts/populateCustomerTeams.js 100 --clear
```

### Command Options

- **No arguments**: Creates 100 records
- **`[count]`**: Creates specified number of records (e.g., `50`)
- **`--clear`**: Deletes all existing records before creating new ones

### Output

The script shows detailed progress:

```
🚀 Starting data generation for table: CustomerTeam-ct2fqxniubax7jwnx6aegbpq2i-NONE
📍 Region: eu-central-1
📊 Records to create: 5
🗑️ Clearing existing data...
Found 15 existing records. Deleting...
🗑️ Deleted record 1/15
...
✅ Successfully deleted: 15 records
✅ [1/5] Inserted teamId: bcc3b8c6-f4e8-4047-976c-61d958817ce4
...
📈 Summary:
✅ Successfully inserted: 5 records
❌ Failed insertions: 0 records
📊 Total processed: 5/5
```

## 🔧 Adding New Scripts

When adding new development scripts:

1. **Create the script file** in this directory
2. **Add clear documentation** at the top of the file
3. **Update this README** with usage instructions
4. **Include error handling** and progress logging
5. **Use environment variables** for configuration when possible

## 🚨 Important Notes

- ⚠️ **Never run scripts against production data** without proper backups
- 🔒 **Ensure AWS credentials** have appropriate permissions
- 🧪 **Test scripts** in development environments first
- 🗑️ **Clean up test data** when no longer needed
- 📋 **Always set CUSTOMER_TEAM_TABLE_NAME** environment variable

## 📝 Common Issues

### Script fails with "Could not determine table name"
- Set the `CUSTOMER_TEAM_TABLE_NAME` environment variable
- Find your table name in AWS Console > DynamoDB > Tables
- Example: `export CUSTOMER_TEAM_TABLE_NAME=CustomerTeam-ct2fqxniubax7jwnx6aegbpq2i-NONE`

### Script fails with "Could not load credentials"
- Check your AWS credentials: `aws sts get-caller-identity`
- Configure AWS CLI: `aws configure`
- Or set environment variables: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`

### "ResourceNotFoundException" error
- Confirm your table name is correct in the environment variable
- Ensure the Amplify environment is deployed
- Check the AWS region matches your deployment

### Import/Export errors
- Ensure you're using Node.js v18+ for ES modules support
- Or convert to CommonJS if using older Node.js versions

### Permission errors
- Verify IAM permissions for DynamoDB operations:
  - `dynamodb:Scan`
  - `dynamodb:PutItem`
  - `dynamodb:DeleteItem`