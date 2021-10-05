# TypeScript Tutorial

The **Adze Security Validator** library exposes some helper interfaces useful for TypeScript environments. Along with the `securityValidator` listener factory we can ensure that our logs meet the requirements for security event context.

## Access Event

The following code provides an example for logging when an access event occurs within your app.

```typescript
import { adze, createShed } from 'adze';
import {
  securityValidator,
  AccessEvent,
  isAccessEventMeta,
} from '@adze/security-validator';

const shed = createShed();

// Example #1: add a security validator callback by itself.
// This will only print fail logs if a security log doesn't pass validation.
shed.addListener('*', securityValidator());

// Example #2: wrap the standard listener callback with the securityValidator callback factory and
// also provide a second callback that is executed when a security log fails validation.
shed.addListener(
  '*',
  securityValidator(
    data => {
      // Do stuff normally
    },
    data => {
      // Do stuff with invalid security logs
    }
  )
);

// Example #3: use a typeguard to narrow down accessEvent logs.
shed.addListener(
  '*',
  securityValidator(
    data => {},
    data => {
      if (isAccessEventMeta(data.meta.accessEvent)) {
        // Do stuff with all invalid logs that contains access event context
      }
    }
  )
);

/* Here we will generate an access event log by passing the AccessEvent interface as a generic
   to the meta() method. This will force you to supply the correct key and value. */
adze()
  .meta<AccessEvent>('accessEvent', {
    userId: 'abc123',
    subject: 'my-app',
    description: 'access medical-portal-db',
    hostname: '123.456.789.100',
  })
  .log('Accessing HIIPA protected data.');
```

## Authentication Event

The following code provides an example for logging when an authentication event occurs within your app.

```typescript
import { adze, createShed } from 'adze';
import {
  securityValidator,
  AuthenticationEvent,
  isAuthenticationEventMeta,
} from '@adze/security-validator';

const shed = createShed();

/* Here we'll used the isAuthenticationEventMeta type guard to narrow down our logic to only logs
   that are authentication events. */
shed.addListener(
  '*',
  securityValidator(
    data => {},
    data => {
      if (isAuthenticationEventMeta(data.meta.authenticationEvent)) {
        // Do stuff with all invalid logs that contains authentication event context
      }
    }
  )
);

/* Here we will generate an access event log by passing the AuthenticationEvent interface as a generic
   to the meta() method. This will force you to supply the correct key and value. */
adze()
  .meta<AuthenticationEvent>('authenticationEvent', {
    userId: 'abc123',
    mechanism: 'cognito',
    subject: 'my-app',
    description: 'access medical-portal-db',
    hostname: '123.456.789.100',
  })
  .log('Accessing HIIPA protected data.');
```
