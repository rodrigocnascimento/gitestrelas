import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "https://af22b14852d4511bda61f4e5f4b67e7e@o4511324370632704.ingest.us.sentry.io/4511324370894848",
  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,
  // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring
  tracesSampleRate: 1.0,
  // Set profilesSampleRate to 1.0 to profile every transaction
  profilesSampleRate: 1.0,
});