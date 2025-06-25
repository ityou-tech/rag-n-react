import React from 'react';
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

export function TeamInfoCard({
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
}: TeamInfoCardProps) {
  const cardStyle: React.CSSProperties = {
    minWidth: '320px',
    maxWidth: '500px',
    padding: '1.5rem',
    background: THEME_COLORS.surface,
    border: `1px solid ${THEME_COLORS.border}`,
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    margin: '1rem 0',
  };

  const headerStyle: React.CSSProperties = {
    marginBottom: '1rem',
    paddingBottom: '0.75rem',
    borderBottom: `1px solid ${THEME_COLORS.border}`,
  };

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr 2fr',
    gap: '0.5rem 1rem',
    alignItems: 'center',
    marginBottom: '1rem',
  };

  const labelStyle: React.CSSProperties = {
    fontWeight: '600',
    color: THEME_COLORS.text,
    fontSize: '0.875rem',
  };

  const valueStyle: React.CSSProperties = {
    color: THEME_COLORS.textSecondary,
    fontSize: '0.875rem',
    fontFamily: 'monospace',
  };

  const getBadgeStyle = (variant: 'success' | 'warning' | 'destructive' | 'secondary'): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      display: 'inline-block',
      padding: '0.25rem 0.5rem',
      borderRadius: '6px',
      fontSize: '0.75rem',
      fontWeight: '500',
      textTransform: 'capitalize',
    };

    switch (variant) {
      case 'success':
        return { ...baseStyle, background: '#dcfce7', color: '#166534' };
      case 'warning':
        return { ...baseStyle, background: '#fef3c7', color: '#92400e' };
      case 'destructive':
        return { ...baseStyle, background: '#fee2e2', color: '#dc2626' };
      case 'secondary':
      default:
        return { ...baseStyle, background: THEME_COLORS.border, color: THEME_COLORS.textSecondary };
    }
  };

  const getStatusBadgeVariant = (status?: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'trial':
        return 'warning';
      case 'cancelled':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const formatCurrency = (value?: number) => {
    if (value === undefined || value === null) return '—';
    return `€${value.toLocaleString()}`;
  };

  const activeFeatures = features ? Object.entries(features)
    .filter(([key, value]) => key !== 'activatedAt' && value === true)
    .map(([key]) => key.replace('Enabled', '').toUpperCase()) : [];

  return (
    <div style={cardStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <h3 style={{
          margin: '0 0 0.5rem 0',
          fontSize: '1.25rem',
          fontWeight: '600',
          color: THEME_COLORS.text,
        }}>
          {teamName}
        </h3>
        <p style={{
          margin: 0,
          fontSize: '0.875rem',
          color: THEME_COLORS.textSecondary,
        }}>
          {companyName}
        </p>
      </div>

      {/* Basic Info Grid */}
      <div style={gridStyle}>
        <span style={labelStyle}>ID:</span>
        <span style={valueStyle}>{teamId}</span>

        <span style={labelStyle}>Industry:</span>
        <span style={valueStyle}>{industry || '—'}</span>

        <span style={labelStyle}>Team Size:</span>
        <span style={valueStyle}>{teamSize ?? '—'}</span>

        <span style={labelStyle}>Onboarding:</span>
        <span style={getBadgeStyle(onboardingCompleted ? 'success' : 'secondary')}>
          {onboardingCompleted ? 'Completed' : 'Pending'}
        </span>

        {subscriptionPlan && (
          <>
            <span style={labelStyle}>Plan:</span>
            <span style={valueStyle}>{subscriptionPlan}</span>
          </>
        )}

        {subscriptionStatus && (
          <>
            <span style={labelStyle}>Status:</span>
            <span style={getBadgeStyle(getStatusBadgeVariant(subscriptionStatus))}>
              {subscriptionStatus}
            </span>
          </>
        )}

        {contractValue !== undefined && (
          <>
            <span style={labelStyle}>Contract Value:</span>
            <span style={valueStyle}>{formatCurrency(contractValue)}</span>
          </>
        )}
      </div>

      {/* Separator */}
      <div style={{
        height: '1px',
        background: THEME_COLORS.border,
        margin: '1rem 0',
      }} />

      {/* Team Lead */}
      <div style={{ marginBottom: '1rem' }}>
        <h4 style={{
          margin: '0 0 0.5rem 0',
          fontSize: '0.875rem',
          fontWeight: '600',
          color: THEME_COLORS.text,
        }}>
          Team Lead
        </h4>
        <div style={{ fontSize: '0.875rem', color: THEME_COLORS.textSecondary }}>
          <div>{teamLeadName}</div>
          <div>
            <a 
              href={`mailto:${teamLeadEmail}`} 
              style={{ 
                color: THEME_COLORS.primary, 
                textDecoration: 'underline' 
              }}
            >
              {teamLeadEmail}
            </a>
          </div>
          {teamLeadPhone && <div>{teamLeadPhone}</div>}
        </div>
      </div>

      {/* Features */}
      {activeFeatures.length > 0 && (
        <>
          <div style={{
            height: '1px',
            background: THEME_COLORS.border,
            margin: '1rem 0',
          }} />
          <div>
            <h4 style={{
              margin: '0 0 0.5rem 0',
              fontSize: '0.875rem',
              fontWeight: '600',
              color: THEME_COLORS.text,
            }}>
              Active Features
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {activeFeatures.map((feature) => (
                <span key={feature} style={getBadgeStyle('secondary')}>
                  {feature}
                </span>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// Export the response components for use with AIConversation
export const responseComponents = {
  TeamInfoCard: {
    description: 'Detailed info card for a customer team',
    component: TeamInfoCard,
    props: {
      teamId: { type: 'string' as const, required: true },
      teamName: { type: 'string' as const, required: true },
      companyName: { type: 'string' as const, required: true },
      industry: { type: 'string' as const },
      teamSize: { type: 'number' as const },
      teamLeadName: { type: 'string' as const, required: true },
      teamLeadEmail: { type: 'string' as const, required: true },
      teamLeadPhone: { type: 'string' as const },
      onboardingCompleted: { type: 'boolean' as const },
      features: { type: 'object' as const },
      subscriptionPlan: { type: 'string' as const },
      subscriptionStatus: { type: 'string' as const },
      contractValue: { type: 'number' as const },
    },
  },
};