import { adze, createShed } from 'adze';
import { securityValidator, AccessEvent, AuthenticationEvent } from './src';

const shed = createShed();

shed.addListener(
  '*',
  securityValidator(
    data => {
      // DO NOT DO THIS IN REAL LIFE. THIS IS FOR TESTING THE DEMO ONLY!
      console.log('Passed Validation =>', data.meta);
    },
    data => {
      // DO NOT DO THIS IN REAL LIFE. THIS IS FOR TESTING THE DEMO ONLY!
      console.log('Failed Validation =>', data.meta);
    }
  )
);

adze()
  .meta('accessEvent', {
    foo: 'bar',
  })
  .log('I should fail validation!');

adze()
  .meta<AccessEvent>('accessEvent', {
    userId: 'abc123',
    subject: 'my-app',
    description: 'abc123 accessed HIIPA data.',
    hostname: '243.123.678.456',
  })
  .log('HIIPA data was accessed.');

adze()
  .meta<AuthenticationEvent>('authenticationEvent', {
    userId: 'abc123',
    mechanism: 'cognito',
    subject: 'cognitoUser',
    description: 'abc123 authenticated with SecureApp.',
    hostname: '243.123.678.456',
  })
  .log('SecureApp was accessed.');
