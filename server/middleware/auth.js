import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

if (!getApps().length) {
  let serviceAccount = null;
  try {
    serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
      ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
      : null;
  } catch (e) {
    // Log the error but DO NOT crash the server — fall back to default credentials
    console.error(
      '[Firebase] FIREBASE_SERVICE_ACCOUNT_KEY is not valid JSON: ' + e.message
    );
    console.error('[Firebase] Stack:', e.stack);
    // process.exit(1) — REMOVED: crashing the server is worse than degraded auth
  }

  if (serviceAccount) {
    try {
      initializeApp({ credential: cert(serviceAccount) });
      console.log('[Firebase] Initialized with service account credentials.');
    } catch (initErr) {
      console.error('[Firebase] Failed to initialize with service account:', initErr.message);
      console.error('[Firebase] Falling back to application default credentials.');
      initializeApp({ projectId: process.env.VITE_FIREBASE_PROJECT_ID || 'careerpilot-ai-58262' });
    }
  } else {
    console.warn(
      'WARNING: FIREBASE_SERVICE_ACCOUNT_KEY not set. '
      + 'Firebase Auth will use application default credentials. '
      + 'Set this env var in production (Render) for token verification to work.'
    );
    initializeApp({ projectId: process.env.VITE_FIREBASE_PROJECT_ID || 'careerpilot-ai-58262' });
  }
}

const isProduction = process.env.NODE_ENV === 'production' || !!process.env.VERCEL;

export const requireAuth = async (req, res, next) => {
  const NODE_ENV = process.env.NODE_ENV;
  const VERCEL = process.env.VERCEL;
  const DEV_BYPASS_AUTH = process.env.DEV_BYPASS_AUTH === 'true';
  const runningLocally = DEV_BYPASS_AUTH && !isProduction;

  if (DEV_BYPASS_AUTH && isProduction) {
    console.error('FATAL: DEV_BYPASS_AUTH is set in production! Auth bypass disabled for safety.');
  }

  if (runningLocally) {
    console.log('[Auth Middleware] Dev bypass ENABLED — injecting dev-user');
    req.user = {
      uid: 'dev-user',
      email: 'dev@local.dev',
      isDevBypass: true
    };
    return next();
  }

  console.log('\n--- [Auth Middleware Debug] ---');
  console.log(`NODE_ENV: ${NODE_ENV}`);
  console.log(`VERCEL: ${VERCEL}`);
  console.log(`DEV_BYPASS_AUTH: ${DEV_BYPASS_AUTH}`);
  console.log(`runningLocally (dev bypass enabled): ${runningLocally}`);
  console.log(`req.headers.authorization: ${req.headers.authorization ? '(present)' : '(none)'}`);

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('[Auth Middleware] REJECTING: no Authorization header');
    return res.status(401).json({
      error: {
        message: 'Missing Authentication header. A valid Firebase ID token is required.'
      }
    });
  }

  const idToken = authHeader.split('Bearer ')[1];

  if (!idToken) {
    return res.status(401).json({
      error: {
        message: 'Authentication token is empty.'
      }
    });
  }

  try {
    const decodedToken = await getAuth().verifyIdToken(idToken);
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email || null,
      name: decodedToken.name || null,
      picture: decodedToken.picture || null
    };
    console.log('[Auth Middleware] Token verified for uid:', decodedToken.uid);
    next();
  } catch (err) {
    console.error('[Auth Middleware] Token verification failed:', err.message);
    return res.status(401).json({
      error: {
        message: 'Invalid or expired authentication token. Please sign in again.'
      }
    });
  }
};
