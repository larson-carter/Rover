# Rover
The Next Generation Scraper and Crawler Software by ApolloTV

## Get Started
1. Install the necessary dependencies; `npm install`
2. Run the application; `npm start`

## Configuration
Refer to `./config/config.ts` (you can copy the default template - `./config/config.dist.ts`)

## Terms and Architecture
Content is discovered by searching 'indexes' which list 'hosts' that serve that content. By default, Rover searches all relevant indexes for hosts.

## Project Structure
```bash
    .
    ├── api/                    # API endpoints for the web, including socket APIs.
    ├──── v2/                   #   All 'API version 2' methods and endpoints go here.
    ├── docs/                   # Documentation files
    ├── lib/                    # All hosts and indexes (essentially anything pertaining to third parties goes here).
    ├── tests/                  # Automated tests. (Currently unused)
    ├── src/                    # TypeScript code pertaining to the application itself.
    ├── out/                    # Generated code ready to be executed by the JavaScript interpreter.
    ├── LICENSE
    └── README.md
```

## Arguments
> Remember, you have to use double hyphens to get `npm` to pass the arguments through to the application.
> For `npm run dev`, these are required twice because it passes through two commands.

For example, if you want to disable the CLI in production mode, you can do the following:
```bash
$ npm start -- --no-cli
```

and if you want to disable the CLI in development mode, you can do the following:
```bash
$ npm run dev -- -- --no-cli
```

### Enabling request logging
`--enable-logging`

> If you'd like to log all requests made to the webserver, you can use the argument `--enable-logging`.

### Disabling the CLI
`--no-cli`

> If you don't want the CLI - perhaps because you're parsing log output - you can pass the argument `--no-cli` and the CLI will be disabled.

## Developers: Application Properties
Application properties are set, retrieved and updated by using the appropriate methods on the `Application` singleton.  
This allows you to keep important properties in a convenient global place without dealing with all of TypeScript's crap.

Here's a complete list of application properties:  
_If you add any, you should update this list, so we can avoid duplicate properties flying around._
```bash
number activeConnections           # The number of socket connections that are currently open with the server.
```

### Setting properties
Let's presume you have a `number` value that you want to declare as a global property.  
Simply, call the static method `set` on `Application`.
```typescript
import Application from "src/application";

const myProperty : number = 42;
Application.set('theAnswer', myProperty);
```

### Getting Properties
Now, let's assume that elsewhere in our application we want to get our all-important value back out of the global property store.
```typescript
import Application from "src/application";

const myProperty : number = Application.get<number>('theAnswer');
```
As you presumably noticed, the `get` method supports generic types. You simply put the type in the diamond operator and it will be cast for you.

### Manipulating Properties
Obviously, this `get`/`set` combination can be really quite cumbersome and tedious if you want to do trivial things like `++myNumber`.  
In order to deal with this, an `update` method exists.
```typescript
import Application from "src/application";

Application.update('theAnswer', (value) => ++value);
```
> Remember to use the ++value or --value notation, because the value needs to be returned to the function.

## Developers: Utilities
Important utilities, such as the logger, are handled separately to Application Properties.

There is [a definitive list of utilities](src/application.ts) in an enum and whilst you may declare utilities anywhere however you must register your utility before it is used. We therefore recommend that you register all utilities as close to application startup as possible.

## Quick Example: Logger
In lieu of some real documentation about utilities, here's a quick example of how to access the logger.
```typescript
import Application, {Utility} from "../../src/application";

Application.getUtility<P.Logger>(Utility.Logger).info(`Quick logger test!`);
```
Annoyingly, the Pino (logger library) uses the namespace `P` which makes this look a lot more verbose than it actually is.  

That said, this code simply calls the method `getUtility` on `Application`, providing the `Utility.Logger` enum value and finally casting the value to `P.Logger` (the Pino class)