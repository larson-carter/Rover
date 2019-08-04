---
title: Rover Socket Protocol
layout: article
subtitle: "**Protocol Version:** 2.0.0 (August 4th 2019)"
---

## Rover Socket Protocol (RSP)

The WebSocket protocol allows for fast impromptu messaging (a basic requirement given the delay and lack of dependability in retrieving data from various sources).
RSP is built on the WebSocket protocol.

RSP is a protocol that allows a client to request a specific file or resource from one or multiple servers without knowing where or on which server the data is stored.
> NOTE: This protocol is not inherently designed or intended for search. The idea is that the client is already aware of the content - just not where the content is found.

## Commands
Here is a table of valid commands and descriptions:

<table>
    <thead>
        <th>Command</th>
        <th>Description</th>
    </thead>
    <tbody>
        <td><code>schemas.get</code></td>
        <td>Used to request a list of schemas from a server that it supports.</td>
    </tbody>
</table>

## Content Request
To get content from a server implementing RSP, you first submit a _'content request'_ to the server. This is a JSON structure that defines the stipulations that must be met by any content returned by the server.

The fields in a content request are declared in a _'content schema'_ (see [Content Schema](#declaring-a-content-schema)).

```javascript
{
  // This is the content schema, this defines all of the valid fields.
  //
  // The name for the schema field is prefixed with an '@' symbol.
  // This shows that it is a field that *does not* pertain to the content itself.
  "@schema": "https://rover.apollotv.xyz/schema/Movie",

  "title": "Django Unchained",
  "year": 2014
}
```
> Comments should not be included in the actual content request as it conforms to regular JSON standards. We're using [JSON5](https://json5.org/) for the documentation for readability, however implementations of JSON5 are not generally available enough to use in the protocol.

## Content Schema
```javascript
{
  // This is the name of the type defined by the schema.
  "type": "Movie",

  "fields": {

    "title": {
      "description": "The title of the movie.",

      // If a field is required, it must be present AND non-null.
      "required": true,

      // Valid types include: string|number|object|array|boolean
      "type": "string"
    }

  }
}
```

### Getting a list of schemas
To obtain a list of all schemas that an RSP server support, the following request should be made:
```json
{ "command": "schemas.get" }
```

The server should respond to this request with a JSON object containing an array of schema URLs supported by the server named 'schemas':
```json
{
  "command": "schemas.get",

  "schemas": [
    "https://rover.apollotv.xyz/schema/Movie",
    "https://rover.apollotv.xyz/schema/TVShow"
  ]
}
```