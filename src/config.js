// App config
export const APP_NAME = "Meet.work";
export const APP_ADDRESS = "https://app.meet.work";
export const LANDING_ADDRESS = "https://meet.work";
export const COPYRIGHT_NAME = "Valentin Foucault";
export const COPYRIGHT_YEAR = "2020";
export const COPYRIGHT_LINK = "https://valentinfoucault.com";
export const JITSI_HOST = "jitsi.valentinfoucault.com";
export const TERMS_OF_SERVICE_LINK =
  "https://www.iubenda.com/terms-and-conditions/26479859";
export const PRIVACY_POLICY_LINK =
  "https://www.iubenda.com/privacy-policy/26479859";
export const DEFAULT_LOCALE = "en-US";

// Meeting config
export const MAX_MEETING_DURATION = 10800000;

export const MAX_MEETING_NAME_LENGTH = 25;

export const MAX_MEETING_PARTICIPANTS = 10;

export const MAX_MEETING_AGENDA_ITEMS = 10;
export const MAX_MEETING_AGENDA_ITEM_LENGTH = 200;

export const MAX_MEETING_PREPARATION_ITEMS = 10;
export const MAX_MEETING_ATTACHMENT_ITEM_SIZE = 2000000;
export const MAX_MEETING_ATTACHMENT_ITEM_INTERNET_LINK_LENGTH = 1000;

export const MAX_MEETING_OUTPUT_ITEMS = 10;
export const MAX_MEETING_OUTPUT_ITEM_LENGTH = 200;

export const MEETING_OVERTIME_ALLOWANCE = 300000;

export const MEETING_START_TIME_NOW_LABEL = "Now";
export const MEETING_START_TIME_NOW_VALUE = "now";
export const MEETING_START_TIME_ERROR_VALUE = "error";

// Firebase config
export const ATTACHMENT_TYPE_INTERNET_LINK = "internetLink";
export const ATTACHMENT_TYPE_FILE_UPLOADED = "fileUploaded";
export const ATTACHMENT_TYPE_FILE_UPLOADING = "fileUploading";

// Firebase config, taken from the environment file
export const FIREBASE_CONFIG = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};
