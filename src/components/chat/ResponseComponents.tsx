import { TeamInfoCard } from './TeamInfoCard';

export const responseComponents = {
  TeamInfoCard: {
    description: 'Detailed info card for a customer team',
    component: TeamInfoCard,
    props: {
      teamId: { type: 'string', required: true },
      teamName: { type: 'string', required: true },
      companyName: { type: 'string', required: true },
      industry: { type: 'string' },
      teamSize: { type: 'number' },
      teamLeadName: { type: 'string', required: true },
      teamLeadEmail: { type: 'string', required: true },
      teamLeadPhone: { type: 'string' },
      onboardingCompleted: { type: 'boolean' },
      features: { type: 'object' },  // Changed from 'json' to 'object'
      subscriptionPlan: { type: 'string' },
      subscriptionStatus: { type: 'string' },
      contractValue: { type: 'number' },
    },
  },
} as const;