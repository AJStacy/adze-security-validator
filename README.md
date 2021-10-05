# Adze Security Validator

This project is a plugin for the Adze logging library to provide tools for ensuring proper context is applied to logs that are meant to record security events such as access events and authentication events.

This library exposes some opinionated interfaces and a log listener factory for validating your security event logs.

## Installation

### Yarn

```bash
yarn add @adze/security-validator
```

### npm

```bash
npm install --save @adze/security-validator
```

## Explanation

When creating web systems it is important for security audits to log access and authentication events with the proper context attached. If a security breach occurred and our access and authentication logs either don't exist or are missing some of their context this can hinder the recovery process as well as tracking down how the attacker compromised the system in the first place.

This library exposes an Adze log listener factory that wraps a log listener and validates that the context attached to it meets the minimum requirements. For TypeScript development environments this library also exposes some useful interfaces that can assist you with applying the proper context to your logs.

The library also exposes some type guard functions to validate if access event or authentication event meta is attached to your log context.

## Security Event Context

When logging a security event, such as an access event or an authentication event, proper context is needed to ensure that the most value is created by your log. Here are the properties required by the **Adze Security Validator** plugin and an explanation of each.

### Access Event Context

- **userId** - Unique identifier of the user accessing the object.
- **subject** - Service identifier or principal name that uniquely identifies the subject accessing the object.
- **description** - Unique object identifier or complete description of the object AND the action requested.
- **hostname** - The hostname of the entity accessing the object.
- **context** - _Optional_ authorization context details.

### Authentication Event Context

- **userId** - Unique identifier of the user accessing the object.
- **mechanism** - The authentication mechanism used.
- **subject** - Service identifier or principal name that uniquely identifies the subject accessing the object.
- **description** - Unique object identifier or complete description of the object AND the action requested.
- **hostname** - The hostname of the entity accessing the object.

## Tutorials

- [TypeScript Tutorial](docs/typescript-tutorial.md)
- [JavaScript Tutorial](docs/javascript-tutorial.md)

## API Documentation

- [API Documentation](docs/api-documentation.md)
