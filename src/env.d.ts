/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly RESEND_API_KEY?: string;
  readonly CONTACT_FROM_EMAIL?: string;
  readonly CONTACT_TO_EMAIL?: string;
  readonly CONTACT_ALLOWED_ORIGIN?: string;
}
