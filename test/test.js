const {getDeepProxy} = require( "../lib/index")

let a={
    a:1,
    b:2,
    c:{
        d:[
            1,2,3,4
        ],
        e:{
            f:{
                g:{
                    h:11
                }
            }
        }
    }
}
let b=getDeepProxy(a,{
    get(target,keys,p,value,receiver){
        console.log(keys,p,value,receiver)
        return value
    },set(target,keys,p,newValue,oldValue,receiver){
        console.log(target,keys,p,newValue,oldValue,receiver)
        target[p]=newValue
        return true
    }
})
b.c.e.f.g.h=1
console.log(a)
while (true){}