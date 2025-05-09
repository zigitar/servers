import express, { Request, Response } from 'express';

export interface AuthConfig {
  enabled: boolean;
  // Additional auth config options can be added here later
}

export interface WellKnownOAuthMetadata {
  issuer: string;
  authorization_endpoint: string;
  token_endpoint: string;
  jwks_uri: string;
  response_types_supported: string[];
  grant_types_supported: string[];
  subject_types_supported: string[];
  id_token_signing_alg_values_supported: string[];
  scopes_supported: string[];
}

export function addAuthEndpoints(app: express.Application, config: AuthConfig): void {
  if (!config.enabled) {
    return;
  }

  // OAuth metadata endpoint
  app.get('/.well-known/oauth-authorization-server', (req: Request, res: Response) => {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    
    const metadata: WellKnownOAuthMetadata = {
      issuer: baseUrl,
      authorization_endpoint: `${baseUrl}/oauth/authorize`,
      token_endpoint: `${baseUrl}/oauth/token`,
      jwks_uri: `${baseUrl}/.well-known/jwks.json`,
      response_types_supported: ['code', 'token', 'id_token', 'code token', 'code id_token', 'token id_token', 'code token id_token'],
      grant_types_supported: ['authorization_code', 'implicit', 'refresh_token', 'client_credentials'],
      subject_types_supported: ['public'],
      id_token_signing_alg_values_supported: ['RS256'],
      scopes_supported: ['openid', 'profile', 'email']
    };

    res.header('Content-Type', 'application/json').send(metadata);
  });
}