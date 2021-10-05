/**
 * This interface provides validation of required meta data for access event logs.
 *
 * + userId: Unique identifier of the user accessing the object
 * + subject: Service identifier or principal name that uniquely identifies the subject accessing the object
 * + description: Unique object identifier or complete description of the object AND the action requested
 * + hostname: The hostname of the entity accessing the object
 * + context?: Optional authorization context details
 *
 */
export interface AccessEventMeta {
  userId: string | number;
  subject: string;
  description: string;
  hostname: string;
  context?: any;
}

/**
 * This interface provides a key/value pair type safety for meta modifiers with Adze for
 * access events.
 *
 * + userId: Unique identifier of the user accessing the object
 * + subject: Service identifier or principal name that uniquely identifies the subject accessing the object
 * + description: Unique object identifier or complete description of the object AND the action requested
 * + hostname: The hostname of the entity accessing the object
 * + context?: Optional authorization context details
 *
 */
export type AccessEvent = ['accessEvent', AccessEventMeta];

/**
 * This interface provides validation of required meta data for authentication event logs.
 *
 * + userId: Unique identifier of the user accessing the object
 * + mechanism: The authentication mechanism used
 * + subject: Service identifier or principal name that uniquely identifies the subject accessing the object
 * + description: Unique object identifier or complete description of the object AND the action requested
 * + hostname: The hostname of the entity accessing the object
 *
 */
export interface AuthenticationEventMeta {
  userId: string | number;
  mechanism: string;
  subject: string;
  description: string;
  hostname: string;
}

/**
 * This interface provides a key/value pair type safety for meta modifiers with Adze for
 * authentication events.
 *
 * + userId: Unique identifier of the user accessing the object
 * + mechanism: The authentication mechanism used
 * + subject: Service identifier or principal name that uniquely identifies the subject accessing the object
 * + description: Unique object identifier or complete description of the object AND the action requested
 * + hostname: The hostname of the entity accessing the object
 *
 */
export type AuthenticationEvent = [
  'authenticationEvent',
  AuthenticationEventMeta
];
