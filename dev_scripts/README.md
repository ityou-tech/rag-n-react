# 🛠️ Development Scripts

This directory contains utility scripts for development, testing, and data management for the rag-n-react project.

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

2. **Find your DynamoDB table name** in the AWS Console or Amplify outputs
3. **Update the script configuration** with your actual values

## 📊 populateCustomerTeams.js

Seeds your DynamoDB CustomerTeam table with realistic fake data for development and testing.

### Configuration

Before running, update these variables in the script:

```javascript
const REGION = "eu-central-1";           // Your AWS region
const TABLE_NAME = "CustomerTeam-dev";   // Your actual table name
```

### Data Schema

The script generates customer teams with the following structure:

```javascript
{
  teamId: "uuid",
  teamName: "Company Name",
  companyName: "Company Name", 
  industry: "technology" | "finance" | "healthcare" | "education" | "retail",
  teamSize: 5-250,
  teamLeadName: "Full Name",
  teamLeadEmail: "email@example.com",
  teamLeadPhone: "+1234567890",
  onboardingCompleted: true | false,
  features: {
    etlEnabled: true | false,
    dwhEnabled: true | false,
    biEnabled: true | false,
    activatedAt: "ISO Date"
  },
  subscriptionPlan: "bronze" | "silver" | "gold",
  subscriptionStatus: "active" | "trial" | "cancelled",
  contractValue: 500.00-20000.00,
  renewalDate: "Future ISO Date"
}
```

### Usage

1. **Configure the script** with your region and table name
2. **Run the script**:
   ```bash
   node dev_scripts/populateCustomerTeams.js
   ```

By default, it creates 100 customer team records. To create a different number:

```javascript
// Edit the last line in the script
seed(50);  // Creates 50 records instead of 100
```

### Output

The script will show progress as it inserts records:

```
✅ Inserted teamId: 550e8400-e29b-41d4-a716-446655440000
✅ Inserted teamId: 6ba7b810-9dad-11d1-80b4-00c04fd430c8
...
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

## 📝 Common Issues

### Script fails with "AccessDenied"
- Check your AWS credentials: `aws sts get-caller-identity`
- Verify IAM permissions for DynamoDB operations

### "ResourceNotFoundException" error
- Confirm your table name is correct
- Ensure the Amplify environment is deployed
- Check the AWS region matches your deployment

### Import/Export errors
- Ensure you're using Node.js v18+ for ES modules support
- Or convert to CommonJS if using older Node.js versions