import { createMiddleware } from 'hono/factory';
import { createRemoteJWKSet, jwtVerify } from 'jose';

const supabaseUrl = process.env.SUPABASE_URL!;

const PROJECT_JWKS = createRemoteJWKSet(
  new URL(`${supabaseUrl}/auth/v1/.well-known/jwks.json`)
);

export const authMiddleware = createMiddleware(async (c, next) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const token = authHeader.slice(7);

  try {
    const { payload } = await jwtVerify(token, PROJECT_JWKS, {
      issuer: `${supabaseUrl}/auth/v1`,
      audience: 'authenticated',
    });

    const userId = payload.sub;
    c.set('uid', userId);

    await next();
  } catch (error) {
    console.error('JWT verification failed:', error);
    return c.json({ error: 'Unauthorized' }, 401);
  }
});
