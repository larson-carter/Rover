# Rover
A generation 2 server (scraper/crawler) for ApolloTV

## Get Started
1. Install the necessary dependencies; `npm install`
2. Run the application; `npm start`

## Configuration
Refer to `./config.ts` (copy from default template - `config.ts.dist`)

## Terms and Architecture
Content is discovered by searching 'indexes' which list 'hosts' that serve that content. By default, Rover searches all relevant indexes for hosts.

## Project Structure
```bash
    .
    ├── api/                    # API endpoints for the web, including socket APIs.
    ├── docs/                   # Documentation files
    ├── lib/                    # All hosts and indexes (essentially anything pertaining to third parties goes here).
    ├── tests/                  # Automated tests. (Currently unused)
    ├── src/                    # TypeScript code pertaining to the application itself.
    ├── out/                    # Generated code ready to be executed by the JavaScript interpreter.
    ├── LICENSE
    └── README.md
```

## Disabling the CLI
If you don't want the CLI - perhaps because you're parsing log output - you can pass the argument `--no-cli` and the CLI will be disabled.
```bash
$ npm start -- --no-cli
```

or 

```bash
$ npm run dev -- -- --no-cli
```

> Remember, you have to use double hyphens to get `npm` to pass the arguments through to the application.
> For `npm run dev`, these are required twice because it passes through two commands.