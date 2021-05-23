# object-resolver

## examples

## basic usage

```ts
// target object
const document = { User: { name: 'taro' } };

// import { ObjectResolver } from "/path/to/src/index"
const resolver = new ObjectResolver(document);
console.log(resolver.resolve('User'));
// --> { name: "taro" }

console.log(resolver.resolve('User.name'));
// --> "taro"
```

## array operations

```ts
const document = { Users: [{ name: 'taro' }, { name: 'jiro' }] };

const resolver = new ObjectResolver(document);
console.log(resolver.resolve('Users[1]'));
// --> { name: "jiro" }
```

## JSON selector

```ts
const document = {
  Users: [
    { id: 123, name: 'taro', height: 170 },
    { id: 456, name: 'jiro', height: 180 },
  ],
};

const resolver = new ObjectResolver(document);
console.log(resolver.resolve('Users[]{"id": 123}'));
// --> { id: 123, name: 'taro', height: 170 }
```

## developer

- up-tri <yaki-shake@up-tri.me>

## LICENSE

under the MIT License.
