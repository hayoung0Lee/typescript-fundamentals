# Converting to TypeScript

## 3 steps for success

### what not to do
1. functional changes at the same time
2. attempt this with low test coverage
3. let the perfect be the enemy of the good
4. forget to add tests for your types: [dts type](https://github.com/microsoft/dts-gen)
5. publish types for consumer use while they're in a "weak" state

### 1. compiling in "loose mode"
- start with tests passing
- rename all .js to .ts allowing implicit any
- fix only things that are not type-checking or causing compile errors
- be carefult to avoid changing behavior
- get tests passing again


### 2. explicit any
- start with tests passing
- Ban implicit any ("noImplicitAny": true)
- Where possible, provide a specific and appropriate type
  - import types for dependencies from DefinitelyTyped
  - otherwise explicit any
- get tests passing again


### 3. squash explicit anys, enable strict mode
- incrementally, in small chunks...
- enable strict mode
  - "strictNullChecks" : true,
  - "strict": true,
  - "strictFunctionTypes": true,
  - "strictBindCallApply": true
- replace explicit anys w/ more appropriate types
- try really hard to avoid unsafe casts