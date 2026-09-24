export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // * Azure Active Directory
      AAD_CLIENT_ID: string;
      AAD_CLIENT_SECRET: string;
      AAD_TENANT_ID: string;
      // * Power BI
      DASHBOARD_DATASET_IDS: string;
      DASHBOARD_EMBED_URL: string;
      DASHBOARD_REPORT_IDS: string;
      // * Feedback ExcelSheet
      DRIVE_ID: string;
      EXCEL_FILE_ID: string;
      LAST_UPDATED_TIME_CELL: string;
      SHEET_NAME: string;
      TABLE_NAME: string;
      // * SAML
      KIGO_OKTA_ENTITY_ID: string;
      // * Misc.
      CODE_ENCRYPTION_SECRET?: string;
      NEXT_PUBLIC_BASE_URL: string;
      NEXT_PUBLIC_DEBUG_MODE: "false" | "true";
      /**
       * * String that should be parsed to a number
       */
      NEXT_PUBLIC_INACTIVITY_PROMPT_TIMEOUT: string;
      /**
       * * String that should be parsed to a number
       */
      NEXT_PUBLIC_INACTIVITY_TIMEOUT: string;
      NEXT_PUBLIC_KIGO_BASE_URL?: string;
      NEXT_PUBLIC_KIGO_CORE_SERVER_URL: string;
      NEXT_PUBLIC_LOG_LEVEL?: "debug" | "error" | "info" | "trace" | "warn";
      // * Sentry
      NEXT_PUBLIC_SENTRY_ENVIRONMENT:
        | "development"
        | "production"
        | "staging"
        | "test";
      REDIS_URL: string;
      REFRESH_TOKEN_DURATION_DAYS: string;
      SENTRY_AUTH_TOKEN: string;
      // * Session
      SESSION_COOKIE_NAME: string;
      // * AI Assistant
      NEXT_PUBLIC_AI_ASSISTANT_API_BASE_URL: string;
      NEXT_PUBLIC_AI_ASSISTANT_SDK_URL: string;
    }
  }
}
