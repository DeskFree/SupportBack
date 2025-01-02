export interface Notification {
    id: string;        // Unique identifier for the notification
    title: string;     // Title of the notification
    message: string;   // Main content or message
    timestamp: Date;   // When the notification was created
    read?: boolean;     // Whether the notification has been read
    type?: NotificationType;     // Optional: Type of the notification (e.g., "info", "warning", "alert")
    userId?: string;   // Optional: ID of the user associated with the notification
  }
  
  export enum NotificationType {
    Info = 'INFO',        // Informational notification
    Warning = 'WARNING',  // Warning notification
    Alert = 'ALERT',      // Alert notification
    Error = 'ERROR'       // Error notification
  }
  