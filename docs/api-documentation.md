# API Documentation

This section will provide details for each function and interface exposed by the plugin.

## securityValidator

This function is meant to wrap a standard Adze log listener to validate any logs that contain meta indicating context for a security event. It also accepts a second listener callback that will be fired when a security log fails validation. The keys it checks for are `'accessEvent'` and `'authenticationEvent'` within a log's meta data. If a log fails validation, a fail log will be generated in the console so the developer can take action on it to fix it.

### securityValidator Interface

Refer to [Shed.addListener()](https://adzejs.com/guide/using-shed.html#addlistener) in the Adze docs for explanation of the ListenerCallback interface.

```typescript
function securityValidator(
  cb: ListenerCallback = () => {},
  errCb: ErrorCallback = () => {}
): ListenerCallback;
```

### securityValidator Example

```typescript
import { createShed } from 'adze';
import { securityValidator } from '@adze/security-validator';

const shed = createShed();

shed.addListener(
  '*',
  securityValidator(
    (data, render) => {
      // Do stuff with non-security logs or security logs that have passed validation
    },
    (data, render) => {
      // Do stuff with security logs that have failed validation
    }
  )
);
```

---

## Type Guards

The **Adze Security Validator** library exposes a number of type guards to assist with targetting your security event logs in your log listeners.

### isAccessEventMeta

This type guard validates that the object passed in is of the [AccessEventMeta]() type.

#### Interface - isAccessEventMeta

```typescript
function isAccessEventMeta(obj: any): obj is AccessEventMeta;
```

#### Example - isAccessEventMeta

```typescript
import { createShed } from 'adze';
import { isAccessEventMeta } from '@adze/security-validator';

const shed = createShed();

shed.addListener((data, render) => {
  if (isAccessEventMeta(data.meta.accessEvent)) {
    // do stuff with your accessEvent meta data...
  }
});
```

### isAuthenticationEventMeta

This type guard validates that the object passed in is of the [AuthenticationEventMeta]() type.

#### Interface - isAuthenticationEventMeta

```typescript
function isAuthenticationEventMeta(obj: any): obj is AuthenticationEventMeta;
```

#### Example - isAuthenticationEventMeta

```typescript
import { createShed } from 'adze';
import { isAuthenticationEventMeta } from '@adze/security-validator';

const shed = createShed();

shed.addListener((data, render) => {
  if (isAuthenticationEventMeta(data.meta.authenticationEvent)) {
    // do stuff with your accessEvent meta data...
  }
});
```

### isSecurityEvent

This type guard validates that the meta data of a log contains a security event context. This is useful for specifically targetting security event logs (accessEvent or authenticationEvent). Refer to the Adze docs for more information on [MetaData](https://adzejs.com/guide/modifiers.html#meta).

#### Interface - isSecurityEvent

```typescript
function isSecurityEvent(meta: MetaData): boolean;
```

#### Example - isSecurityEvent

```typescript
import { createShed } from 'adze';
import { isSecurityEvent } from '@adze/security-validator';

const shed = createShed();

shed.addListener((data, render) => {
  if (isSecurityEvent(data.meta)) {
    // do stuff with your security event logs...
  }
});
```

---

## Interfaces

The **Adze Security Validator** library utilizes TypeScript interfaces to help you type check your security event logs when they are being generated.

### AccessEvent

The **AccessEvent** interface is to be passed in as a generic to `meta()` Adze log methods to assist with type checking the key/value pairs provided for your access event log context.

#### Interface - AccessEvent

```typescript
type AccessEvent = ['accessEvent', AccessEventMeta];
```

#### Example - AccessEvent

```typescript
import { adze } from 'adze';
import { AccessEvent } from '@adze/security-validator';

adze()
  .meta<AccessEvent>('accessEvent', {
    userId: 'abc123',
    subject: 'my-app',
    description: 'access medical-portal-db',
    hostname: '123.456.789.100',
  })
  .log('Logging an access event.');
```

### AuthenticationEvent

The **AuthenticationEvent** interface is to be passed in as a generic to `meta()` Adze log methods to assist with type checking the key/value pairs provided for your authentication event log context.

#### Interface - AuthenticationEvent

```typescript
type AuthenticationEvent = ['authenticationEvent', AuthenticationEventMeta];
```

#### Example - AuthenticationEvent

```typescript
import { adze } from 'adze';
import { AuthenticationEvent } from '@adze/security-validator';

adze()
  .meta<AuthenticationEvent>('authenticationEvent', {
    userId: 'abc123',
    mechanism: 'cognito',
    subject: 'my-app',
    description: 'authenticate to medical portal',
    hostname: '123.456.789.100',
  })
  .log('Logging an authentication event.');
```

### AccessEventMeta

The **AccessEventMeta** interface describes the minimum required context for your access event security log meta data.

Refer to the [readme homepage](../README.md#access-event-context) of this library for more information about each property.

#### Interface - AccessEventMeta

```typescript
interface AccessEventMeta {
  userId: string | number;
  subject: string;
  description: string;
  hostname: string;
  context?: any;
}
```

#### Example - AccessEventMeta

```typescript
import { AccessEventMeta } from '@adze/security-validator';

const accessMeta: AccessEventMeta = {
  userId: 'abc123',
  subject: 'my-app',
  description: 'access medical-portal-db',
  hostname: '123.456.789.100',
};
```

### AuthenticationEventMeta

The **AuthenticationEventMeta** interface describes the minimum required context for your access event security log meta data.

Refer to the [readme homepage](../README.md#authentication-event-context) of this library for more information about each property.

#### Interface - AuthenticationEventMeta

```typescript
interface AuthenticationEventMeta {
  userId: string | number;
  mechanism: string;
  subject: string;
  description: string;
  hostname: string;
}
```

#### Example - AuthenticationEventMeta

```typescript
import { AuthenticationEventMeta } from '@adze/security-validator';

const authMeta: AuthenticationEventMeta = {
  userId: 'abc123',
  mechanism: 'cognito',
  subject: 'my-app',
  description: 'authenticate to medical portal',
  hostname: '123.456.789.100',
};
```
