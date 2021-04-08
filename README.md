# babel-plugin-transform-iife-for-debug

> Automatically execute debug code in the development environment without affecting production code.
> 
> 在不会影响到生产代码的前提下，在开发环境对调试代码进行自动执行。

You can easily write debug code in the development environment without having to delete it before testing, avoiding the risk of taking debug code to production.

让你可以在开发环境轻松编写调试代码，而不需要在发布测试环境前仔细核对并删除，能避免把调试代码带上生产的风险。

## Install

Using npm:

```shell
npm install --save-dev babel-plugin-transform-iife-for-debug
```

or using yarn:

```shell
yarn add babel-plugin-transform-iife-for-debug --dev
```

## Usage
```js
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

```javascript
// Default
{   
    targetFlag: '@IIFE-for-debug',
    enableCondition: () => true,
    transformCondition: () => process.env.NODE_ENV==='development'
}
```