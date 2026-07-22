import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

if (!getApps().length) {
  try {
    let serviceAccount = null;
    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      try {
        serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
      } catch (parseErr) {
        console.error('[Firebase] Invalid FIREBASE_SERVICE_ACCOUNT_KEY JSON:', parseErr.message);
      }
    }

    if (serviceAccount) {
      initializeApp({ credential: cert(serviceAccount) });
      console.log('[Firebase] Initialized with service account credentials.');
    } else {
      initializeApp({ projectId: process.env.VITE_FIREBASE_PROJECT_ID || 'careerpilot-ai-58262' });
      console.log('[Firebase] Initialized with project ID fallback.');
    }
  } catch (err) {
    console.warn('[Firebase] Warning during initialization:', err.message);
  }
}

const isProduction = process.env.NODE_ENV === 'production' || !!process.env.VERCEL;

export const requireAuth = async (req, res, next) => {
  const DEV_BYPASS_AUTH = process.env.DEV_BYPASS_AUTH === 'true';
  const runningLocally = DEV_BYPASS_AUTH && !isProduction;

  if (runningLocally) {
    req.user = {
      uid: 'dev-user',
      email: 'dev@local.dev',
      isDevBypass: true
    };
    return next();
  }

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
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
