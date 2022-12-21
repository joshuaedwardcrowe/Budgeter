export const ENVIRONMENT_DARWIN_NAME = "darwin";
export const ENVIRONMENT_DOWNLOADS_FOLDER = "Downloads";

export const APP_READY_EVENT = "ready";
export const APP_WINDOW_ALL_CLOSED = "window-all-closed";
export const APP_ACTIVATE = "activate";

export const CONFIG_FOLDER_NAME = "budgeter";
export const CONFIG_FILE_NAME = "budgeter-config.json";
export const LOG_FILE_NAME = "budgeter.log";

export const DEFAULT_WINDOW_TITLE = "Budgeter";
export const DEFAULT_WINDOW_HEIGHT = 800;
export const DEFAULT_WINDOW_WIDTH = 1200;
export const DEFAULT_WINDOW_NODE_INTEGRATION = false;
export const DEFAULT_WINDOW_CONTEXT_ISOLATION = true;
export const IPC_PROMPT_FILE_PATH_REQUEST = "promptFilePath:request";
export const IPC_PROMPT_FILE_PATH_SUCCESS_RESPONSE = "promptFilePath:response_success"
export const IPC_PROMPT_FILE_PATH_FAILURE_RESPONSE = "promptFilePath:response_failure";
export const IPC_HOME_DIRECTORY_PATH_REQUEST = "homeDirectoryPath:request";
export const IPC_HOME_DIRECTORY_PATH_SUCCESS_RESPONSE = "homeDirectoryPath:success";
export const IPC_DIRECTORY_CONTENT_REQUEST = "directoryContent:request";
export const IPC_DIRECTORY_CONTENT_SUCCESS_RESPONSE = "directoryContent:response_success";
export const IPC_DIRECTORY_CONTENT_FAILURE_RESPONSE = "directoryContent:response_failure";
export const IPC_FILE_CONTENT_REQUEST = "fileContent:request";
export const IPC_FILE_CONTENT_SUCCESS_RESPONSE = "fileContent:response_success";
export const IPC_FILE_CONTENT_FAILURE_RESPONSE = "fileContent:response_failure";
export const IPC_FILE_CREATION_REQUEST = "fileCreation:request";
export const IPC_FILE_CREATION_SUCCESS_RESPONSE = "fileCreation:response_success";
export const IPC_FILE_CREATION_FAILURE_RESPONSE = "fileCreation:response_failure";

export const FAILED_CONFIG_ERROR_TITLE = "Configuration Loading Failed";
export const FAILED_CONFIG_ERROR_MESSAGE = "Budgeter failed to either retrieve or create the configuration for this app. Please try running as an administrator, or contact support."

export const TEMPLATE_REASON_FOR_FILE = "{{reasonForFile}}";
export const TEXT_SELECT_FILE = `Select ${TEMPLATE_REASON_FOR_FILE} File`;

export const SPENDEE_TRANSACTION_EXPORT_FILE_NAME_SEPARATOR = "_";
export const SPENDEE_TRANSACTION_EXPORT_ACCOUNT_NAME_SEPARATOR = "-";
export const SPENDEE_TRANSACTION_EXPORT_FILE_PREFIX = "transactions_export_";
export const SPENDEE_TRANSACTION_EXPORT_FILE_SUFFIX = ".csv";
