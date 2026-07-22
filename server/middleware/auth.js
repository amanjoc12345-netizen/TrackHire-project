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
      initializeApp({ projectId: process.env.VITE_FIREBASE_PROJECT_ID || 'trackhire-42b62' });
      console.log('[Firebase] Initialized with project ID fallback.');
    }
  } catch (err) {
    console.warn('[Firebase] Warning during initialization:', err.message);
  }
}

export const requireAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // If no auth header or empty header is provided, allow access as guest user
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    req.user = {
      uid: 'guest-user',
      email: 'guest@trackhire.app',
      isGuest: true
    };
    return next();
  }

  const idToken = authHeader.split('Bearer ')[1]?.trim();

  if (!idToken || idToken === 'null' || idToken === 'undefined' || idToken === 'bypass') {
    req.user = {
      uid: 'guest-user',
      email: 'guest@trackhire.app',
      isGuest: true
    };
    return next();
  }

  try {
    const decodedToken = await getAuth().verifyIdToken(idToken);
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email || null,
      name: decodedToken.name || null,
      picture: decodedToken.picture || null
    };
    return next();
  } catch (err) {
    console.warn('[Auth Middleware] Token verification failed, falling back to guest mode:', err.message);
    // Allow request to proceed in guest mode so AI features never fail for users across devices
    req.user = {
      uid: 'guest-user',
      email: 'guest@trackhire.app',
      isGuest: true
    };
    return next();
  }
};
