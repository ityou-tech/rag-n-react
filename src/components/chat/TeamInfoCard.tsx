import { Card, Flex, Text, Badge, Divider, View } from '@aws-amplify/ui-react';
import { THEME_COLORS } from '../../constants';

interface TeamInfoCardProps {
  teamId: string;
  teamName: string;
  companyName: string;
  industry?: string;
  teamSize?: number;
  teamLeadName: string;
  teamLeadEmail: string;
  teamLeadPhone?: string;
  onboardingCompleted?: boolean;
  features?: {
    etlEnabled?: boolean;
    dwhEnabled?: boolean;
    biEnabled?: boolean;
  };
  subscriptionPlan?: string;
  subscriptionStatus?: string;
  contractValue?: number;
}

export function TeamInfoCard(props: TeamInfoCardProps) {
  const {
    teamId,
    teamName,
    companyName,
    industry,
    teamSize,
    teamLeadName,
    teamLeadEmail,
    teamLeadPhone,
    onboardingCompleted,
    features,
    subscriptionPlan,
    subscriptionStatus,
    contractValue,
  } = props;

  const getPlanColor = (plan?: string) => {
    switch (plan?.toLowerCase()) {
      case 'gold': return '#FFD700';
      case 'silver': return '#C0C0C0';
      case 'bronze': return '#CD7F32';
      default: return THEME_COLORS.textSecondary;
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'active': return '#4CAF50';
      case 'trial': return '#FF9800';
      case 'cancelled': return '#F44336';
      default: return THEME_COLORS.textSecondary;
    }
  };

  return (
    <Card variation="outlined" padding="1.5rem" backgroundColor={THEME_COLORS.surface}>
      {/* Header */}
      <Flex direction="column" gap="0.5rem">
        <Flex justifyContent="space-between" alignItems="flex-start">
          <View>
            <Text fontSize="1.25rem" fontWeight="600" color={THEME_COLORS.primary}>
              {teamName}
            </Text>
            <Text fontSize="1rem" color={THEME_COLORS.text}>
              {companyName}
            </Text>
          </View>
          <Flex gap="0.5rem">
            {subscriptionPlan && (
              <Badge backgroundColor={getPlanColor(subscriptionPlan)} color="white">
                {subscriptionPlan.toUpperCase()}
              </Badge>
            )}
            {subscriptionStatus && (
              <Badge backgroundColor={getStatusColor(subscriptionStatus)} color="white">
                {subscriptionStatus.toUpperCase()}
              </Badge>
            )}
          </Flex>
        </Flex>
        
        <Flex gap="1rem" wrap="wrap">
          <Text fontSize="0.875rem" color={THEME_COLORS.textSecondary}>
            <strong>Team ID:</strong> {teamId}
          </Text>
          {industry && (
            <Text fontSize="0.875rem" color={THEME_COLORS.textSecondary}>
              <strong>Industry:</strong> {industry}
            </Text>
          )}
          {teamSize && (
            <Text fontSize="0.875rem" color={THEME_COLORS.textSecondary}>
              <strong>Team Size:</strong> {teamSize}
            </Text>
          )}
        </Flex>
      </Flex>

      <Divider margin="1rem 0" />

      {/* Team Lead Info */}
      <View>
        <Text fontSize="1rem" fontWeight="600" marginBottom="0.5rem" color={THEME_COLORS.text}>
          Team Lead
        </Text>
        <Flex direction="column" gap="0.25rem">
          <Text fontSize="0.875rem" color={THEME_COLORS.text}>
            <strong>Name:</strong> {teamLeadName}
          </Text>
          <Text fontSize="0.875rem" color={THEME_COLORS.text}>
            <strong>Email:</strong> <a href={`mailto:${teamLeadEmail}`} style={{ color: THEME_COLORS.primary }}>{teamLeadEmail}</a>
          </Text>
          {teamLeadPhone && (
            <Text fontSize="0.875rem" color={THEME_COLORS.text}>
              <strong>Phone:</strong> <a href={`tel:${teamLeadPhone}`} style={{ color: THEME_COLORS.primary }}>{teamLeadPhone}</a>
            </Text>
          )}
        </Flex>
      </View>

      {/* Features */}
      {features && (
        <>
          <Divider margin="1rem 0" />
          <View>
            <Text fontSize="1rem" fontWeight="600" marginBottom="0.5rem" color={THEME_COLORS.text}>
              Platform Features
            </Text>
            <Flex gap="0.5rem">
              <Badge 
                backgroundColor={features.etlEnabled ? '#4CAF50' : '#9E9E9E'} 
                color="white"
              >
                ETL {features.etlEnabled ? '✓' : '✗'}
              </Badge>
              <Badge 
                backgroundColor={features.dwhEnabled ? '#4CAF50' : '#9E9E9E'} 
                color="white"
              >
                DWH {features.dwhEnabled ? '✓' : '✗'}
              </Badge>
              <Badge 
                backgroundColor={features.biEnabled ? '#4CAF50' : '#9E9E9E'} 
                color="white"
              >
                BI {features.biEnabled ? '✓' : '✗'}
              </Badge>
            </Flex>
          </View>
        </>
      )}

      {/* Additional Info */}
      <Divider margin="1rem 0" />
      <Flex justifyContent="space-between" alignItems="center">
        <Flex gap="1rem">
          <Text fontSize="0.875rem" color={THEME_COLORS.textSecondary}>
            <strong>Onboarding:</strong> {onboardingCompleted ? '✓ Complete' : '⏳ Pending'}
          </Text>
          {contractValue && (
            <Text fontSize="0.875rem" color={THEME_COLORS.textSecondary}>
              <strong>Contract Value:</strong> ${contractValue.toLocaleString()}
            </Text>
          )}
        </Flex>
      </Flex>
    </Card>
  );
}