---
title: JS中this的指向
tags: JS
categories: 其他记录
abbrlink: 2d4e300a
date: 2020-04-10 19:09:28
---

学习Javascript时遇到说this指针的指向问题，因此查找了一些博客教程，作为个人学习的总结。

首先要明确Js中的this指向并不是在定义时确定的，而是在具体的对象调用函数时确定，即哪个对象调用了函数，函数中的this就指向哪个对象，**函数的调用方式决定了this的指向**。

Js中的函数调用有：直接调用、方法调用、构造函数调用。还有特殊的例如bind()绑定后调用、通过call()、apply()调用、箭头函数调用

<!--more-->

### 1.直接调用

直接调用，就是通过 `函数名(...)` 这种方式调用，此时函数内部的this指向的时全局对象。

(浏览器中全局对象时window，在NodeJs中全局对象时global)

```javascript
var name = "I am Leslie's fans";
function getName(){
	console.log(this);//输出 window  即this指向全局对象window
	console.log(this.name);//输出 I am Leslie's fans
}
getName();
```

注：直接调用并不是在全局作用域下调用，任何作用域下直接通过`函数名(...)`对函数调用都称为直接调用。

#### bind()对直接调用的影响

`Function.prototype.bind()` 的作用是将当前函数与指定的对象绑定，并返回一个新函数，这个新函数无论以什么样的方式调用，其 `this` 始终指向绑定的对象。

```javascript
const obj={};
function test(){
    console.log(this===obj);
}
const testObj=test.bind(obj);//将test函数与obj对象绑定，它的this指向obj
test();//false
testObj();//true
```



### 2.方法调用

方法调用是指通过对象来调用其方法函数，是以`对象.方法函数(...)`的形式调用

```javascript
var name = "Salute Leslie";
var test = {
	name = "Always salute";
	getName:function(){
		console.log(this);//输出test  this指向的时test对象
		console.log(this.name);//输出Always salute 即this.name并没有调用到window的name属性
	}
}
test.getName();
```

当有多个对象调用时：虽然test1.getName是由test2.getName赋值得到，但调用的是test1，this指向test1

```javascript
var test1 = {
	name: 'Leslie';
}
var test2 = {
	name: 'Not Leslie';
	getName:function(){
		console.log(this.name);
	}
}
test1.getName=test2.getName;
test1.getName();//输出Leslie
```



### 3.构造函数调用

在ES5中，每个函数都可以当作构造函数，通过new调用来产生新的对象实例，其中的this指向这个对象。

```javascript
var name = "Leslie";
function getName(name){
    this.name=name;
}
var Name1=new getName("Not Leslie");
console.log(newName.name);//输出Not Leslie
console.log(name);//输出Leslie
var Name2=new getName("Not Leslie");
console.log(Name1===Name2);//false
```



### 4.使用call()、apply()

call()和apply()简单来说就是会改变传入函数的this

```javascript
var obj1={
    name:'Leslie'
};
var obj2={
    name:'Not Leslie',
    fn:function(){
        console.log(this.name);
    }
}
obj2.fn.call(obj1);//输出Leslie
//虽然obj2.fn执行，但是call了obj1，动态的将this指向了obj1，相当于obj2.fn执行环境是obj1
```

#### call与apply的用途：

1. 改变this的指向
2. 方法借用

#### call与apply的区别：

二者作用相同，只是参数不同

- call参数不固定，`acll(thisArg [ ,arg1,arg2,...])`，第一个参数是this指向，后面使用参数列表
- apply参数固定，`apply(thisArg [,argArray])`，第一个参数是this指向，第二个是参数数组



### 5.箭头函数调用

首先，ES6提供的箭头函数中，并没有this，箭头函数中的this是继承的外部环境，即直接包含它的那个函数或函数表达式中的this。

```javascript
const obj = {
    test(){
        const arrow=()=>{
            //这里的this是test()中的this，由test()的调用方式决定
            console.log(this===obj);
        };
        arrow();
    },
    
    getArrow(){
        return()=>{
            //这里的this是getArrow()的this，由getArrow()的调用方式决定
            console.log(this===obj);
        };
    }
};
obj.test();//输出true
const Arrow=obj.getArrow();
Arrow();//输出true
```

它本身是没有绑定 `this` 的，它用的是直接外层函数(即包含它的最近的一层函数或函数表达式)绑定的 `this`。

注：箭头函数不能new调用，bind也不起作用。