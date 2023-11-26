type handlerKeys = (string | symbol)[];
// type primitiveType=string|number|boolean|symbol|undefined|null

type deepProxyOptions<T extends object> = {
    set?(target: any, keys: handlerKeys, p: string | symbol, newValue: any, oldValue: any, receiverTarget: T): boolean,
    apply?(target: any, keys: handlerKeys, thisArg: any, argArray: any[], receiverTarget: T): any,
    construct?(target: any, keys: handlerKeys, argArray: any[], newTarget: Function, receiverTarget: T): object,
    defineProperty?(target: any, keys: handlerKeys, property: string | symbol, attributes: PropertyDescriptor, receiverTarget: T): boolean,
    deleteProperty?(target: any, keys: handlerKeys, property: string | symbol, receiverTarget: T): boolean
    get?(target: any, keys: handlerKeys, p: string | symbol, value: any, receiverTarget: T): any,
    getOwnPropertyDescriptor?(target: any, keys: handlerKeys, p: string | symbol, receiverTarget: T): PropertyDescriptor | undefined,
    getPrototypeOf?(target: any, keys: handlerKeys, receiverTarget: T): object | null,
    has?(target: any, keys: handlerKeys, p: string | symbol, receiverTarget: T): boolean,
    isExtensible?(target: any, keys: handlerKeys, receiverTarget: T): boolean,
    ownKeys?(target: any, keys: handlerKeys, receiverTarget: T): ArrayLike<string | symbol>,
    preventExtensions?(target: any, keys: handlerKeys, receiverTarget: T): boolean,
    setPrototypeOf?(target: any, keys: handlerKeys, v: object | null, receiverTarget: T): boolean
}
type confirmedDeepProxyOptions<T extends object> = Required<deepProxyOptions<T>>;
type defaultDeepProxyOptions = Readonly<confirmedDeepProxyOptions<object>>;

export function getValue<T extends object>(target: T, keys: handlerKeys): any {
    if (keys.length <= 0) {
        return target[keys[0] as keyof T]
    }
    return getValue(target[keys[0] as keyof T] as object, keys.slice(1))
}
function getNewKeys(keys: handlerKeys, p: string | symbol) {
    return [p].concat(keys)
}
export const defaultOptions: defaultDeepProxyOptions = {
    apply(target, _keys, thisArg, argArray) {
        return (target as Function).apply(thisArg, argArray)
    },
    construct(target, _keys, argArray, _newTarget) {
        return new (target as {
            new(...argArray: any[]): object
        })(...argArray)
    },
    defineProperty(target, _keys, property, attributes) {
        Object.defineProperty(target, property, attributes)
        return true
    }, deleteProperty(target, _keys, property) {
        delete target[property as keyof typeof target]
        return true
    },
    get(_target, _keys, _p, value) {
        return value
    },
    getOwnPropertyDescriptor(target, _keys, p) {
        return Object.getOwnPropertyDescriptor(target, p)
    },
    getPrototypeOf(_target, _keys, _receiverTarget) {
        return Object.getPrototypeOf(_target)
    },
    has(target, _keys, p) {
        return p in target
    },
    isExtensible(target, _keys, _receiverTarget) {
        return Object.isExtensible(target)
    },
    ownKeys(target, _keys, _receiverTarget) {
        return Reflect.ownKeys(target)
    }, preventExtensions(target, _keys, _receiverTarget) {
        Object.preventExtensions(target)
        return true
    }, set(target, _keys, p, _oldValue, newValue) {
        target[p as keyof typeof target] = newValue
        return true
    }, setPrototypeOf(target, _keys, v, _receiverTarget) {
        Object.setPrototypeOf(target, v)
        return true
    }
}
export function getDeepProxy<T extends object>(target: T, options: deepProxyOptions<T>) {
    let subProxy = new WeakMap()
    let confirmedOptions = Object.assign({}, defaultOptions, options) as confirmedDeepProxyOptions<T>
    return new Proxy(target, {
        apply(nowTarget, thisArg, argArray) {
            return confirmedOptions.apply(nowTarget, [], thisArg, argArray, nowTarget)
        }, construct(nowTarget, argArray, newTarget) {
            return confirmedOptions.construct(nowTarget, [], argArray, newTarget, nowTarget)
        }, defineProperty(nowTarget, property, attributes) {
            return confirmedOptions.defineProperty(nowTarget, [], property, attributes, nowTarget)
        }, deleteProperty(nowTarget, property) {
            return confirmedOptions.deleteProperty(nowTarget, [], property, nowTarget)
        }, get(nowTarget, p, nowReceiver): any {
            let value = p in nowTarget ? nowTarget[p as keyof T] : undefined
            if (typeof value === 'object' && value !== null) {
                if (!subProxy.has(value)) {
                    subProxy.set(value, getDeepProxy(value, {
                        apply: (target, keys, thisArg, argArray, _receiverTarget) => confirmedOptions.apply(target, getNewKeys(keys, p), thisArg, argArray, nowTarget),
                        construct: (target, keys, argArray, newTarget, _receiverTarget) => confirmedOptions.construct(target, getNewKeys(keys, p), argArray, newTarget, nowTarget),
                        defineProperty: (target, keys, property, attributes, _receiverTarget) => confirmedOptions.defineProperty(target, getNewKeys(keys, p), property, attributes, nowReceiver),
                        deleteProperty: (target, keys, property, _receiverTarget) => confirmedOptions.deleteProperty(target, getNewKeys(keys, p), property, nowTarget),
                        get: (target, keys, tP, value, _receiverTarget) => confirmedOptions.get(target, getNewKeys(keys, p), tP, value, nowTarget),
                        getOwnPropertyDescriptor: (target, keys, tP, _receiverTarget) => confirmedOptions.getOwnPropertyDescriptor(target, getNewKeys(keys, p), tP, nowReceiver),
                        getPrototypeOf: (target, keys, _receiverTarget) => confirmedOptions.getPrototypeOf(target, getNewKeys(keys, p), nowReceiver),
                        has: (target, keys, tP, _receiverTarget) => confirmedOptions.has(target, getNewKeys(keys, p), tP, nowTarget),
                        isExtensible: (target, keys, _receiverTarget) => confirmedOptions.isExtensible(target, getNewKeys(keys, p), nowTarget),
                        ownKeys: (target, keys, _receiverTarget) => confirmedOptions.ownKeys(target, getNewKeys(keys, p), nowTarget) as handlerKeys,
                        set: (target, keys, tP, oldValue, newValue, _receiverTarget) => confirmedOptions.set(target, getNewKeys(keys, p), tP, oldValue, newValue, nowTarget),
                        setPrototypeOf: (target, keys, v, _receiverTarget) => confirmedOptions.setPrototypeOf(target, getNewKeys(keys, p), v, nowReceiver),
                    }))
                }
                value = subProxy.get(value) as T[keyof T]
            }
            return confirmedOptions.get(nowTarget, [], p, value, nowTarget)
        },
        getOwnPropertyDescriptor(target, p) {
            return confirmedOptions.getOwnPropertyDescriptor(target, [], p, target)
        }, getPrototypeOf(target) {
            return confirmedOptions.getPrototypeOf(target, [], target)
        }, has(target, p) {
            return confirmedOptions.has(target, [], p, target)
        }, isExtensible(target) {
            return confirmedOptions.isExtensible(target, [], target)
        }, ownKeys(target) {
            return confirmedOptions.ownKeys(target, [], target)
        }, set(nowTarget, p, newValue) {
            return confirmedOptions.set(nowTarget, [], p, newValue, nowTarget[p as keyof T], nowTarget)
        }, setPrototypeOf(target, v) {
            return confirmedOptions.setPrototypeOf(target, [], v, target)
        }
    });
}