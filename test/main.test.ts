import { adze, createShed, removeShed } from 'adze';
import {
  securityValidator,
  AccessEvent,
  AuthenticationEvent,
  isAccessEventMeta,
  isAuthenticationEventMeta,
  isSecurityEvent,
} from '../src';

// Setting the adze environment to 'test' to suppress logs from printing
const GLOBAL: any = global;
GLOBAL.ADZE_ENV = 'test';

afterEach(() => {
  removeShed();
});

test('securityValidator logs error and fire the error callback when meta data is incorrect', () => {
  const shed = createShed();

  const passCb = jest.fn();
  const errCb = jest.fn();
  shed.addListener('*', securityValidator(passCb, errCb));

  adze()
    .meta('accessEvent', {
      thisIs: 'wrong',
    })
    .log("I'm a failure! :(");

  // Generate a non-security log to make sure that other logs do not throw failures
  adze().log('This should not trigger the error!');

  expect(passCb).toHaveBeenCalledTimes(2);
  expect(errCb).toHaveBeenCalledTimes(1);
});

test('securityValidator passes access event log', () => {
  const shed = createShed();

  shed.addListener(
    '*',
    securityValidator(data => {
      if (isSecurityEvent(data.meta)) {
        const accessEvent = data.meta.accessEvent;
        if (isAccessEventMeta(accessEvent)) {
          expect(accessEvent.userId).toEqual('abc123');
          expect(accessEvent.subject).toEqual('my-app');
          expect(accessEvent.description).toEqual('access medical-portal-db');
          expect(accessEvent.hostname).toEqual('123.456.789.100');
        } else {
          throw new Error('The access event meta was not detected.');
        }
      }
    })
  );

  adze()
    .meta<AccessEvent>('accessEvent', {
      userId: 'abc123',
      subject: 'my-app',
      description: 'access medical-portal-db',
      hostname: '123.456.789.100',
    })
    .log('Accessing HIIPA protected data.');
});

test('securityValidator passes authentication event log', () => {
  const shed = createShed();

  shed.addListener(
    '*',
    securityValidator(data => {
      if (isSecurityEvent(data.meta)) {
        const authentication = data.meta.authenticationEvent;
        if (isAuthenticationEventMeta(authentication)) {
          expect(authentication.userId).toEqual('abc123');
          expect(authentication.mechanism).toEqual('cognito');
          expect(authentication.subject).toEqual('my-app');
          expect(authentication.description).toEqual(
            'authenticate to medical portal'
          );
          expect(authentication.hostname).toEqual('123.456.789.100');
        } else {
          throw new Error('The authentication event meta was not detected.');
        }
      }
    })
  );

  adze()
    .meta<AuthenticationEvent>('authenticationEvent', {
      userId: 'abc123',
      mechanism: 'cognito',
      subject: 'my-app',
      description: 'authenticate to medical portal',
      hostname: '123.456.789.100',
    })
    .log('Accessing HIIPA protected data.');
});
