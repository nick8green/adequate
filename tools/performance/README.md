# Adequate Performance Testing

Initial performance testing is done using the npm tool artillery.

## Running the tests

From the root of the project, you can run the test command from the performance workspace. The profile needs to be passed on the end of the command.

### Example

```
$ yarn workspace performance test profiles/home-base.yml
```

## Useful Links

- https://v-checha.medium.com/load-testing-tools-for-node-js-developers-98291ed75a4b
- https://margatama.medium.com/optimizing-node-js-express-js-apis-with-npm-loadtest-a6732010868d
