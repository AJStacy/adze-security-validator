import { adze, LogData, FinalLogData, ListenerCallback, MetaData } from 'adze';
import { AccessEventMeta, AuthenticationEventMeta } from './_contracts';
import { hasOwnProperty, isObject } from './util';

/**
 * Create a new adze log factory that inherits the adze-security-validator namespace.
 */
const log = adze()
  .ns('adze-security-validator')
  .seal();

/**
 * This function acts as a callback wrapper for log listeners with Adze. When a log containing
 * either AccessEvent or AuthenticationEvent meta data passes through this function it will
 * validate that all of the required properties are present and will warn the user if they are not.
 * This is an extra level of runtime validation and is mostly useful for vanilla JS implementations.
 *
 * When using TypeScript this is optional because passing the generics of `AccessEvent` or
 * `AuthenticationEvent` that are provided by this plugin will force the user to enter the
 * required properties.
 */

export function securityValidator(
  cb: ListenerCallback = () => {},
  errCb: ListenerCallback = () => {}
): ListenerCallback {
  let wrapper: ListenerCallback = (data, render) => {
    // Check if the log has any security event meta data attached
    if (isSecurityEvent(data.meta)) {
      /* Route log data with meta properties of accessEvent or authenticationEvent to the
       appropriate validators. */
      if (!accessEventValid(data)) {
        log().fail(
          'A log failed access event validation! Please verify its context is set properly.'
        );
        errCb(data, render);
        return;
      } else if (!authenticationEventValid(data)) {
        log().fail(
          'A log failed authentication event validation! Please verify its context is set properly.'
        );
        errCb(data, render);
        return;
      }
    }
    // Execute the user's listener callback.
    cb(data, render);
  };
  return wrapper;
}

/**
 * Validates that the provided log data contains a meta property of `accessEvent` and the attached
 * object has all of the required AccessEvent properties.
 */
function accessEventValid(data: LogData | FinalLogData): boolean {
  if (isAccessEventMeta(data.meta.accessEvent)) {
    if (typeof data.timestamp?.iso8601 === 'string') {
      return true;
    }
    adze().error(
      'The iso8601 timestamp value was not set. Please make sure that you have timestamps enabled in your Adze configuration.'
    );
  }
  return false;
}

/**
 * Validates that the provided log data contains a meta property of `authenticationEvent` and the attached
 * object has all of the required AuthenticationEvent properties.
 */
function authenticationEventValid(data: LogData | FinalLogData): boolean {
  if (isAuthenticationEventMeta(data.meta.authenticationEvent)) {
    if (typeof data.timestamp?.iso8601 === 'string') {
      return true;
    }
    adze().error(
      'The iso8601 timestamp value was not set. Please make sure that you have timestamps enabled in your Adze configuration.'
    );
  }
  return false;
}

/**
 * TypeGuard that indicates the provided object is of type `AccessEventMeta`.
 */
export function isAccessEventMeta(obj: any): obj is AccessEventMeta {
  if (isObject(obj)) {
    const userIdSet = propertyExistsWithType(obj, 'userId', [
      'string',
      'number',
    ]);
    const subjectSet = propertyExistsWithType(obj, 'subject', ['string']);
    const hostnameSet = propertyExistsWithType(obj, 'hostname', ['string']);
    const descriptionSet = propertyExistsWithType(obj, 'description', [
      'string',
    ]);
    return userIdSet && subjectSet && hostnameSet && descriptionSet;
  }
  return false;
}

/**
 * TypeGuard that indicates the provided object is of type `AuthenticationEventMeta`.
 */
export function isAuthenticationEventMeta(
  obj: any
): obj is AuthenticationEventMeta {
  if (isObject(obj)) {
    const userIdSet = propertyExistsWithType(obj, 'userId', [
      'string',
      'number',
    ]);
    const mechanismSet = propertyExistsWithType(obj, 'mechanism', ['string']);
    const subjectSet = propertyExistsWithType(obj, 'subject', ['string']);
    const hostnameSet = propertyExistsWithType(obj, 'hostname', ['string']);
    const descriptionSet = propertyExistsWithType(obj, 'description', [
      'string',
    ]);
    return (
      userIdSet && mechanismSet && subjectSet && hostnameSet && descriptionSet
    );
  }
  return false;
}

/**
 * Checks that the property exists on the object and
 * the property is of the provided type.
 */
function propertyExistsWithType(
  obj: any,
  prop: string,
  type: string[]
): boolean {
  return hasOwnProperty(obj, prop) && type.includes(typeof obj[prop]);
}

/**
 * Validates that the provided log meta data object has security event meta data attached.
 */
export function isSecurityEvent(meta: MetaData): boolean {
  if (isObject(meta)) {
    return (
      meta.hasOwnProperty('accessEvent') ||
      meta.hasOwnProperty('authenticationEvent')
    );
  }
  return false;
}
