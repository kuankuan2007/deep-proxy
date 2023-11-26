# @kuankuan/deep-proxy

The `@kuankuan/deep-proxy` library is a tool that allows you to proxy an object and all its nested objects. It provides a flexible and customizable way to intercept and modify the behavior of object properties and methods.

## Installation

You can install `@kuankuan/deep-proxy` via npm:

```bash
npm install @kuankuan/deep-proxy
```

## Usage

To use `@kuankuan/deep-proxy`, you need to import the `getDeepProxy` function from the library:

```javascript
import { getDeepProxy } from '@kuankuan/deep-proxy';
```

### Proxying an Object

To proxy an object, you can simply pass the object and an options object to the `getDeepProxy` function:

```javascript
const target = { foo: 'bar' };
const options = {
  // Define your custom handlers here
};

const proxy = getDeepProxy(target, options);
```

### Options

The options object allows you to define custom handlers for various operations on the proxied object. Each handler is a function that will be called when the corresponding operation is performed on the object.

Here are the available handlers:

- `set`: Called when a property is set on the object.
- `get`: Called when a property is accessed on the object.
- `apply`: Called when a function is called on the object.
- `construct`: Called when the object is used as a constructor.
- `defineProperty`: Called when a property is defined on the object.
- `deleteProperty`: Called when a property is deleted from the object.
- `getOwnPropertyDescriptor`: Called when the descriptor of a property is accessed.
- `getPrototypeOf`: Called when the prototype of the object is accessed.
- `has`: Called when the existence of a property is checked.
- `isExtensible`: Called when the extensibility of the object is checked.
- `ownKeys`: Called when the keys of the object are accessed.
- `preventExtensions`: Called when the object is made non-extensible.
- `setPrototypeOf`: Called when the prototype of the object is set.

Each handler function receives the following parameters:

- `target`: The target object being proxied.
- `keys`: An array of keys representing the path to the current property.
- `...other parameters`: Additional parameters specific to each handler.

### Example

Here's an example of how you can use `@kuankuan/deep-proxy` to intercept property access on an object:

```javascript
const target = { foo: 'bar' };
const options = {
  get(target, keys, p, value, receiverTarget) {
    console.log(`Property ${p.toString()} was accessed.`);
    return value;
  },
};

const proxy = getDeepProxy(target, options);

console.log(proxy.foo); // Output: "Property foo was accessed."
```

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, please open an issue or submit a pull request on the GitHub repository.

## License

This project is licensed under the MulanPSL-2.0 License. See the [LICENSE](https://github.com/kuankuan-yu/deep-proxy/blob/main/LICENSE) file for more information.
