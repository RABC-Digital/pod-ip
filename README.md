# Overview

![Build Status](https://github.com/RABC-Group/pod-ip/actions/workflows/node.yml/badge.svg)
![npm](https://img.shields.io/npm/v/pod-ip)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/pod-ip)
![npm](https://img.shields.io/npm/dm/pod-ip)
[![codecov](https://codecov.io/gh/RABC-Group/pod-ip/branch/main/graph/badge.svg)](https://codecov.io/gh/RABC-Group/pod-ip)

This package consists of a couple of utilities to get IP addresses of containers and host from inside a kubernetes pod or docker container.

## Usage

1. Install this package

using [yarn](https://classic.yarnpkg.com/en/):

```
yarn add pod-ip
```

or using [npm](https://www.npmjs.com/):

```
npm install pod-ip
```

2. Get IP address (ES6 module syntax)

```javascript
import * as podIp from "pod-ip";
podIp.ipSync(); // ⇨ '1.1.1.1'
```

or using CommonJS syntax:

```javascript
const podIp = require("pod-ip");
podIp.ipSync(); // ⇨ '1.1.1.1'
```


## API Summary

| Method  |  |
| --- | --- |
| [`podIp.ip`](#podipip) | Get IP address asynchronously.
| [`podIp.ipSync`](#podipipsync) | Get IP address synchronously.

## API

### podIp.ip

Get IP address asynchronously

Example:

```javascript
import * as podIp from "pod-ip";
podIp.ip().then(console.log); // ⇨ '1.1.1.1'
```

### podIp.ipSync

Get IP address synchronously

Example:

```javascript
import * as podIp from "pod-ip";
podIp.ipSync(); // ⇨ '1.1.1.1'
```

## Acknowledgements

This project was inspired by [docker-ip-get](https://github.com/ukalwa/docker-ip-get) and [internal-ip](https://github.com/sindresorhus/internal-ip).