---
title: Installation and Setup
layout: tutorial
# Difficulty is a scale from 1 - 5
difficulty: 1
---

## Installation and Setup
Rover is simply a [Node.js](https://nodejs.org/) project. If you have worked with ApolloTV Claws, you may notice that the installation and setup steps are also relatively similar.
1. Install [![the latest version of nodejs](https://img.shields.io/badge/dynamic/json.svg?label=node&url=https%3A%2F%2Fapi.github.com%2Frepos%2Fnodejs%2Fnode%2Freleases%2Flatest&query=%24.tag_name&colorB=026e00)](https://nodejs.org/en/download/current/) and [![the latest version of npm](https://img.shields.io/badge/dynamic/json.svg?label=npm&url=https%3A%2F%2Fapi.github.com%2Frepos%2Fnpm%2Fcli%2Freleases%2Flatest&query=%24.tag_name&colorB=cb3837)](https://www.npmjs.com/get-npm) (usually included with nodejs).
2. Install the project dependencies, as per any Node.js project.
    ```bash
    $ npm install
    ```
3. Copy the example configuration and then edit the file if necessary.
    ```bash
   $ cp config/config.dist.ts config/config.ts
   ```
   > On Windows, you'll need to use `copy` instead of `cp`.
4. Profit!

## Configuration
{% include gist.html url="https://github.com/ApolloTVofficial/Rover/blob/master/config/config.dist.ts" %}