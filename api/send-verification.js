import fetch from "node-fetch";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const ALLOWED_ORIGINS = new Set([
  "https://medastare.com",
  "https://www.medastare.com",
]);

function setCors(req, res) {
  const origin = req.headers.origin;
  if (origin && ALLOWED_ORIGINS.has(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  }
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");
}

function getFirebaseApp() {
  if (getApps().length) return getApps()[0];

  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!raw) {
    throw new Error("FIREBASE_SERVICE_ACCOUNT is not configured");
  }

  const serviceAccount = JSON.parse(raw);
  return initializeApp({ credential: cert(serviceAccount) });
}

export default async function handler(req, res) {
  setCors(req, res);

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "method_not_allowed" });
  }

  try {
    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    getFirebaseApp();
    const auth = getAuth();

    const authorization = req.headers.authorization || "";
    if (!authorization.startsWith("Bearer ")) {
      return res.status(401).json({ ok: false, error: "missing_auth_token" });
    }

    const idToken = authorization.slice("Bearer ".length).trim();
    const decoded = await auth.verifyIdToken(idToken, true);
    const user = await auth.getUser(decoded.uid);

    if (!user.email) {
      return res.status(400).json({ ok: false, error: "user_has_no_email" });
    }

    if (user.emailVerified) {
      return res.status(200).json({ ok: true, alreadyVerified: true });
    }

    const verificationUrl = await auth.generateEmailVerificationLink(user.email, {
      url: "https://www.medastare.com/?emailVerified=1",
      handleCodeInApp: false,
    });

    const bucket = Math.floor(Date.now() / (5 * 60 * 1000));
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
        "Idempotency-Key": `verify-email/${user.uid}/${bucket}`,
      },
      body: JSON.stringify({
        from: "MedaStaré <hello@medastare.com>",
        to: [user.email],
        template: {
          id: "verify-account",
          variables: {
            VERIFICATION_URL: verificationUrl,
          },
        },
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      console.error("Resend verification email failed", {
        status: response.status,
        message: data?.message || data?.name || "unknown_error",
      });
      return res.status(502).json({ ok: false, error: "email_send_failed" });
    }

    return res.status(200).json({ ok: true, emailId: data.id || null });
  } catch (error) {
    console.error("send-verification failed", error);
    return res.status(500).json({ ok: false, error: "internal_error" });
  }
}
