import React from 'react';
import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react';
import { View, Heading, Button } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { THEME_COLORS } from '../constants';

interface AuthenticatorWrapperProps {
  children: (props: { signOut?: (() => void) | undefined; user?: any }) => React.ReactElement;
}

export default function AuthenticatorWrapper({ children }: AuthenticatorWrapperProps) {
  const authenticatorStyles = `
    /* Beautiful gradient background */
    body {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
      min-height: 100vh;
    }
    
    .amplify-authenticator {
      --amplify-colors-background-primary: transparent !important;
      --amplify-colors-background-secondary: #ffffff !important;
      --amplify-colors-font-primary: #1a202c !important;
      --amplify-colors-font-secondary: #4a5568 !important;
      --amplify-colors-brand-primary-60: #667eea !important;
      --amplify-colors-brand-primary-80: #5a67d8 !important;
      --amplify-colors-brand-primary-100: #4c51bf !important;
      background: transparent !important;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
    }
    
    .amplify-authenticator [data-amplify-authenticator] {
      background: transparent !important;
    }
    
    /* Beautiful card with glass effect */
    .amplify-card {
      background: rgba(255, 255, 255, 0.95) !important;
      backdrop-filter: blur(20px) !important;
      border: 1px solid rgba(255, 255, 255, 0.2) !important;
      border-radius: 20px !important;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1), 0 15px 25px rgba(0, 0, 0, 0.05) !important;
      padding: 2rem !important;
      transition: all 0.3s ease !important;
    }
    
    .amplify-card:hover {
      transform: translateY(-2px) !important;
      box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15), 0 20px 30px rgba(0, 0, 0, 0.08) !important;
    }
    
    /* Beautiful primary button with gradient */
    .amplify-button[data-variation="primary"] {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
      border: none !important;
      border-radius: 12px !important;
      color: #ffffff !important;
      font-weight: 600 !important;
      padding: 0.75rem 1.5rem !important;
      transition: all 0.3s ease !important;
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4) !important;
    }
    
    .amplify-button[data-variation="primary"]:hover {
      transform: translateY(-2px) !important;
      box-shadow: 0 8px 25px rgba(102, 126, 234, 0.6) !important;
      background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%) !important;
    }
    
    /* Beautiful input fields */
    .amplify-input {
      background: rgba(255, 255, 255, 0.8) !important;
      border: 2px solid rgba(102, 126, 234, 0.1) !important;
      border-radius: 12px !important;
      color: #1a202c !important;
      font-size: 1rem !important;
      padding: 0.75rem 1rem !important;
      transition: all 0.3s ease !important;
    }
    
    .amplify-input:focus {
      border-color: #667eea !important;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1) !important;
      background: rgba(255, 255, 255, 1) !important;
      transform: translateY(-1px) !important;
    }
    
    .amplify-input:hover {
      border-color: rgba(102, 126, 234, 0.2) !important;
    }
    
    /* Beautiful labels */
    .amplify-field-group__field-label {
      color: #2d3748 !important;
      font-weight: 600 !important;
      font-size: 0.875rem !important;
      margin-bottom: 0.5rem !important;
      text-transform: uppercase !important;
      letter-spacing: 0.05em !important;
    }
    
    /* Beautiful tabs */
    .amplify-tabs {
      border: none !important;
      background: rgba(255, 255, 255, 0.1) !important;
      border-radius: 15px !important;
      padding: 0.25rem !important;
      margin-bottom: 2rem !important;
    }
    
    .amplify-tabs-item {
      color: #4a5568 !important;
      border: none !important;
      border-radius: 12px !important;
      padding: 0.75rem 1.5rem !important;
      font-weight: 500 !important;
      transition: all 0.3s ease !important;
    }
    
    .amplify-tabs-item:hover {
      background: rgba(255, 255, 255, 0.5) !important;
      color: #2d3748 !important;
    }
    
    .amplify-tabs-item[data-state="active"] {
      background: rgba(255, 255, 255, 0.9) !important;
      color: #667eea !important;
      border: none !important;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
      font-weight: 600 !important;
    }
    
    /* Beautiful link buttons */
    .amplify-button[data-variation="link"] {
      color: #667eea !important;
      font-weight: 500 !important;
      transition: all 0.3s ease !important;
    }
    
    .amplify-button[data-variation="link"]:hover {
      color: #5a67d8 !important;
      transform: translateY(-1px) !important;
    }
    
    /* Error states */
    .amplify-field-group--error .amplify-input {
      border-color: #e53e3e !important;
      box-shadow: 0 0 0 3px rgba(229, 62, 62, 0.1) !important;
    }
    
    /* Success states */
    .amplify-field-group--valid .amplify-input {
      border-color: #38a169 !important;
      box-shadow: 0 0 0 3px rgba(56, 161, 105, 0.1) !important;
    }
    
    /* Loading states */
    .amplify-button[data-variation="primary"]:disabled {
      background: linear-gradient(135deg, #a0aec0 0%, #cbd5e0 100%) !important;
      cursor: not-allowed !important;
      transform: none !important;
      box-shadow: none !important;
    }
    
    /* Smooth animations */
    .amplify-authenticator * {
      transition: all 0.3s ease !important;
    }
  `;

  const components = {
    Header() {
      return (
        <View textAlign="center" padding="3rem 0 2rem 0" backgroundColor="transparent">
          <div style={{
            fontSize: '3rem',
            marginBottom: '1rem',
            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))'
          }}>
            🤖
          </div>
          <div style={{
            color: 'rgba(255, 255, 255, 0.95)',
            fontSize: '2rem',
            fontWeight: '700',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)',
            marginBottom: '0.5rem'
          }}>
            Rag n React
          </div>
          <div style={{
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: '1rem',
            fontWeight: '400',
            textShadow: '0 1px 2px rgba(0,0,0,0.1)'
          }}>
            Powered by Amazon Nova Micro ✨
          </div>
        </View>
      );
    },

    Footer() {
      return (
        <View textAlign="center" padding="2rem 0 1rem 0" backgroundColor="transparent">
          <div style={{
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: '0.875rem',
            fontWeight: '400',
            textShadow: '0 1px 2px rgba(0,0,0,0.1)'
          }}>
            © 2025 Rag n React. Crafted with ❤️
          </div>
        </View>
      );
    },

    SignIn: {
      Header() {
        return (
          <Heading
            level={3}
            color="#1e293b"
            fontWeight="600"
            textAlign="center"
            marginBottom="1.5rem"
          >
            Welcome back
          </Heading>
        );
      },
      Footer() {
        const { toForgotPassword } = useAuthenticator();
        return (
          <View textAlign="center" marginTop="1rem">
            <Button
              fontWeight="normal"
              onClick={toForgotPassword}
              size="small"
              variation="link"
              color={THEME_COLORS.primary}
            >
              Forgot your password?
            </Button>
          </View>
        );
      },
    },

    SignUp: {
      Header() {
        return (
          <Heading
            level={3}
            color="#1e293b"
            fontWeight="600"
            textAlign="center"
            marginBottom="1.5rem"
          >
            Create your account
          </Heading>
        );
      },
      Footer() {
        const { toSignIn } = useAuthenticator();
        return (
          <View textAlign="center" marginTop="1rem">
            <Button
              fontWeight="normal"
              onClick={toSignIn}
              size="small"
              variation="link"
              color={THEME_COLORS.primary}
            >
              Already have an account? Sign in
            </Button>
          </View>
        );
      },
    },

    ForgotPassword: {
      Header() {
        return (
          <Heading
            level={3}
            color="#1e293b"
            fontWeight="600"
            textAlign="center"
            marginBottom="1.5rem"
          >
            Reset your password
          </Heading>
        );
      },
    },

    ConfirmResetPassword: {
      Header() {
        return (
          <Heading
            level={3}
            color="#1e293b"
            fontWeight="600"
            textAlign="center"
            marginBottom="1.5rem"
          >
            Enter new password
          </Heading>
        );
      },
    },
  };

  const formFields = {
    signIn: {
      username: {
        placeholder: 'Enter your email',
      },
    },
    signUp: {
      password: {
        label: 'Password',
        placeholder: 'Enter your password',
      },
      confirm_password: {
        label: 'Confirm Password',
        placeholder: 'Confirm your password',
      },
    },
    forgotPassword: {
      username: {
        placeholder: 'Enter your email',
      },
    },
    confirmResetPassword: {
      confirmation_code: {
        placeholder: 'Enter confirmation code',
        label: 'Confirmation Code',
      },
      confirm_password: {
        placeholder: 'Enter your new password',
        label: 'New Password',
      },
    },
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: authenticatorStyles }} />
      <Authenticator variation="modal" components={components} formFields={formFields}>
        {(props) => children(props) as React.ReactElement}
      </Authenticator>
    </>
  );
}