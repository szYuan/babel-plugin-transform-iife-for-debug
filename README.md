# @babel/plugin-transform-iife-for-debug

> Turn arrow function with debuge comment into IIFE

See our website [@babel/plugin-transform-iife-for-debug](https://babeljs.io/docs/en/next/plugin-transform-iife-for-debug.html) for more information.

## Install

Using npm:

```sh
npm install --save-dev @babel/plugin-transform-iife-for-debug
```

or using yarn:

```sh
yarn add @babel/plugin-transform-iife-for-debug --dev
```

## Usage
```json
// .babelrc
{
    "plugins": [
        ["transform-iife-for-debug"]
        // with options:
        // ["transform-iife-for-debug", {"targetFlag": "@IIFE-for-debug", ...}]
    ]
}
```

Source Code:
```javascript
let normalNum = 1 + 2;

// @IIFE-for-debug
() => {
    normalNum = 10
}

let normalResult = normalNum * 10;
```

After Transforming(development)
```javascript
let normalNum = 1 + 2;

// [IIFE]
// @IIFE-for-debug
(() => {
    normalNum = 10
})()

let normalResult = normalNum * 10;
```

After Transforming(not development)
```javascript
let normalNum = 1 + 2;

// [removed]
// @IIFE-for-debug

let normalResult = normalNum * 10;
```

## Options

```
Default
{   
    targetFlag: '@IIFE-for-debug',
    enableCondition: () => true,
    transformCondition: () => process.env.NODE_ENV==='development'
}
```