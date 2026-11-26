import { createMiddleware } from 'hono/factory';
import { createRemoteJWKSet, jwtVerify } from 'jose';

const supabaseUrl = process.env.SUPABASE_URL!;

const PROJECT_JWKS = createRemoteJWKSet(new URL(`${supabaseUrl}/auth/v1/.well-known/jwks.json`));

// Verifies a Supabase access token and returns the user's id.
export async function verifyToken(token: string): Promise<string> {
  const { payload } = await jwtVerify(token, PROJECT_JWKS, {
    issuer: `${supabaseUrl}/auth/v1`,
    audience: 'authenticated'
  });

  if (!payload.sub) throw new Error('Token missing sub claim');
  return payload.sub;
}

export const authMiddleware = createMiddleware(async (c, next) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const token = authHeader.slice(7);

  let userId: string;
  try {
    userId = await verifyToken(token);
  } catch (error) {
    console.error('JWT verification failed:', error);
    return c.json({ error: 'Unauthorized' }, 401);
  }

  c.set('uid', userId);
  await next();
});
