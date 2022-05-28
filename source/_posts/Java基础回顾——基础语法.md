---
title: Java基础回顾——基础语法
tags: Java基础
categories:
  - Java
abbrlink: 98c92646
date: 2020-07-21 17:41:34
---

之前上Java课时，找到一个非常好的网站[how2j](https://how2j.cn/)（**强推!!!**），结合这个网站和上课把Java SE的知识过完了，但是到现在过了这么久，用的也不是很多，所以很多知识点都有点遗忘了，现在用[实验楼](https://www.shiyanlou.com/)再过一遍知识点

how2j主要是基于实践和练习为主，现在用实验楼的再过一遍

<!--more-->

## Java基础语法(上)

### 变量

变量可以指在计算机存储器里存在值的被命名的存储空间。

变量通常是可被修改的，即可以用来表示可变的状态。这是 Java 的基本概念之一。

程序通过改变变量的值来改变整个程序的状态。为了方便使用变量，所以变量都需要命名，叫做**变量名**。

在 Java 中，变量需要先声明 (declare) 才能使用。在声明中，说明变量的类型，赋予变量以特别名字，以便在后面的程序中调用它。你可以在程序中的任意位置声明变量，语法格式如下：

```txt
数据类型 变量名称;
```

例如：

```java
int a = 1;
```

在该语法格式中，数据类型可以是 Java 语言中任意的类型，如 `int`。变量名称是该变量的标识符，需要符合标识符的命名规则，数据类型和变量名称之间使用空格进行间隔，使用 `;` 作为结束。

在 `/home/project/` 新建一个 `VarTest.java` 文件：

```java
public class VarTest
{
  public static void main(String[] args)
  {
    System.out.println("Define a variable a is ");
    int a; //声明变量a
    a = 5;
    System.out.println(a);  // 打印一个整数a
  }
}
```

编译运行：

```bash
$ javac VarTest.java
$ java VarTest
Define a variable a is
5
```





### 常量

常量代表程序运行过程中不能改变的值。我们也可以把它们理解为特殊的变量，只是它们在程序的运行过程中是不允许改变的。**常量的值是不能被修改的**。

Java 中的 `final` 关键字可以用于声明属性（常量），方法和类。当 `final` 修饰属性时，代表该属性一旦被分配内存空间就必须初始化，它的含义是“这是无法改变的”或者“终态的”。在变量前面添加关键字 `final` 即可声明一个常量。在 Java 编码规范中，要求常量名必须大写。

语法格式：

```txt
final 数据类型 常量名 = 值;
```

例如：

```java
final double PI = 3.14;
```

常量也可以先声明，再进行赋值，但只能赋值一次，比如：

```java
final int FINAL_VARIABLE;
FINAL_VARIABLE = 100;
```

在 `/home/project/` 下新建一个 `FinalVar.java`：

```java
public class FinalVar{
    public static void main(String[] args){
        final String FINAL_STRING="shiyanlou";
        System.out.println(FINAL_STRING);
    }
}
```

编译运行：

```bash
$ javac FinalVar.java
$ java FinalVar
shiyanlou
```





### 数据类型

Java 中一共八种基本数据类型，下表列出了基本数据类型的数据范围、存储格式、默认值和包装类型等。

| 数据类型 | 默认值         | 存储格式 | 数据范围                                                     | 包装类型  |
| -------- | -------------- | -------- | ------------------------------------------------------------ | --------- |
| short    | 0              | 2 个字节 | -32,768 到 32,767                                            | Short     |
| int      | 0              | 4 个字节 | -2,147,483,648 到 2,147,483,647                              | Integer   |
| byte     | 0              | 1 个字节 | -128 到 127                                                  | Byte      |
| char     | 空             | 2 个字节 | Unicode 的字符范围：`\u0000`（即为 0）到 `\uffff`（即为 65,535） | Character |
| long     | 0L 或 0l       | 8 个字节 | -9,223,372,036,854,775,808 到 9,223,372,036,854,775,807      | Long      |
| float    | 0.0F 或 0.0f   | 4 个字节 | 32 位 IEEEE-754 单精度范围                                   | Float     |
| double   | 0.0 或 0.0D(d) | 8 个字节 | 64 位 IEEE-754 双精度范围                                    | Double    |
| boolean  | false          | 1 位     | true 或 false                                                | Boolean   |

#### 整数

`byte`、`short`、`int`、`long` 四种基本数据类型表示整数，需要注意的是 `long` 类型，使用 `long` 修饰的变量需要在数值后面加上 L 或者 l，比如 `long num = 1L;`，一般使用大写 `L`，为了避免小写 `l` 与数值 `1` 混淆。

#### 浮点数

`float` 和 `double` 类型表示浮点数，即可以表示小数部分。需要注意的是 `float` 类型的数值后面需要加上 `F` 或者 `f`，否则会被当成 `double` 类型处理。`double` 类型的数值可以加上 `D` 或 `d`，也可以不加。

#### char 类型

char 类型用于表示单个字符。需要将字符用单引号括起来`char a = 'a'`，char 可以和整数互相转换，如果字符 `a` 也可以写成`char a = 97`。也可以用十六进制表示`char a = '\u0061'`。

#### boolean 类型

`boolean` 类型（布尔类型）用于表示真值 `true`或者假值 `false`，Java 中布尔值不能和整数类型或者其它类型互相转换。





### String

Java 中使用 `String` 类来定义一个字符串，字符串是**常量**，它们的值在创建之后不能更改。字符串缓冲区支持可变的字符串。

`String` 对象的初始化格式有如下两种：

```java
String s0 = "abc";

String s1 = new String("abd");
```

String 类具有丰富的方法，比如计算字符串的长度、连接字符串、比较字符串、提取字符串等等。

#### 计算字符串长度

`length()` 方法：

```java
//方法原型
public int length(){
}
```

调用方法：`字符串标识符.length();` 返回一个 `int` 类型的整数（字符串中字符数，中文字符也是一个字符）。例如：

```java
String s1 = "abc";
String s2 = "Java语言";
int len1 = s1.length();
int len2 = s2.length();
```

则变量 `len1` 的值是 3，变量 `len2` 的值是 6。

#### 字符串比较

`equals()` 方法，该方法的作用是判断两个字符串对象的内容是否相同。如果相同则返回 `true`，否则返回 `false`。

`equals()` 方法比较是从第一字符开始，一个字符一个字符依次比较。

![equals比较原理](https://doc.shiyanlou.com/document-uid79144labid1085timestamp1435503766697.png/wm)

如果想忽略掉大小写关系，比如：java 和 Java 是一样的，那怎么办呢？可以调用 `equalsIgnoreCase()` 方法，其用法与 `equals()` 一致，不过它会忽视大小写。

比如：

```java
public class StringTest {
    public static void main(String[] args){
        String s = new String("Java");
        String m = "java";
        System.out.println("用equals()比较，java和Java结果为"+s.equals(m));
        System.out.println("用equalsIgnoreCase()比较，java和Java结果为"+s.equalsIgnoreCase(m));
    }
}
```

编译运行：

```bash
$ javac StringTest.java
$ java StringTest
用equals()比较，java和Java结果为false
用equalsIgnoreCase()比较，java和Java结果为true
```

而使用 `"=="` 比较的是两个对象在内存中存储的地址是否一样。例如：

```java
         String s1 = "abc";
         String s2 = new String("abc");
         boolean b = (s1 == s2);
```

则变量 `b` 的值是 `false`，因为 `s1` 对象对应的地址是 `"abc"` 的地址，而 `s2` 使用 `new` 关键字申请新的内存，所以内存地址和 `s1` 的 `"abc"` 的地址不一样，所以获得的值是 `false`。

#### 字符串连接

字符串连接有两种方法：

1. 使用 `+`，比如 `String s = "Hello " + "World!"`。
2. 使用 `String` 类的 `concat()` 方法。

代码示例：

```java
String s0 = new String("Hello ");
String s1 = "World" + "!";   //+号连接
String s2 = s0.concat(s1); //concat()方法连接
System.out.println(s2);
```

而且使用 `+` 进行连接，不仅可以连接字符串，也可以连接其他类型。但是要求进行连接时至少有一个参与连接的内容是字符串类型。

#### charAt() 方法

`charAt()` 方法的作用是按照索引值（规定字符串中第一个字符的索引值是 0，第二个字符的索引值是 1，依次类推），获得字符串中的指定字符。例如：

```java
String s = "abc";
char c = s.charAt(1);
```

则变量 `c` 的值是 `'b'`。

#### 字符串常用提取方法

| 方法                                    | 返回值 | 功能描述                                     |
| --------------------------------------- | ------ | -------------------------------------------- |
| indexOf(char ch)                        | int    | 搜索字符 ch 第一次出现的索引                 |
| indexOf(String value)                   | int    | 搜索字符串 value 第一次出现的索引            |
| lastIndexOf(char ch)                    | int    | 搜索字符 ch 最后一次出现的索引               |
| lastIndexOf(String value)               | int    | 搜索字符串 value 最后一次出现的索引          |
| substring(int index)                    | String | 提取从位置索引开始到结束的字符串             |
| substring(int beginindex, int endindex) | String | 提取 beginindex 和 endindex 之间的字符串部分 |
| trim()                                  | String | 返回一个前后不含任何空格的调用字符串的副本   |

> 说明：在字符串中，第一个字符的索引为 0，子字符串包含 `beginindex` 的字符，但不包含 `endindex` 的字符。

来写一些代码，验证一下上面的方法吧。

```java
public class StringTest {
    public static void main(String[] args) {
         String s = "abcdefabc";
         System.out.println("字符a第一次出现的位置为"+s.indexOf('a'));
         System.out.println("字符串bc第一次出现的位置为"+s.indexOf("bc"));
         System.out.println("字符a最后一次出现的位置为"+s.lastIndexOf('a'));
         System.out.println("从位置3开始到结束的字符串"+s.substring(3));
         System.out.println("从位置3开始到6之间的字符串"+s.substring(3,6));
    }
}
```

编译运行：

```bash
$ javac StringTest.java
$ java StringTest
字符a第一次出现的位置为0
字符串bc第一次出现的位置为1
字符a最后一次出现的位置为6
从位置3开始到结束的字符串defabc
从位置3开始到6之间的字符串def
```





### 算数运算符

算术运算符用在数学表达式中，主要实现的是算术运算，如常见的*加减乘除*等。

表格中的例子中，变量 `a` 的值为 5，变量 `b` 的值为 3，变量 `i` 的值为 1：

| 算术运算符 | 名称 | 描述                     | 类型       | 举例                 |
| ---------- | ---- | ------------------------ | ---------- | -------------------- |
| +          | 加法 | 相加运算符两侧的值       | 双目运算符 | a + b 等于 8         |
| -          | 减法 | 左操作数减去右操作数     | 双目运算符 | a - b 等于 2         |
| *          | 乘法 | 相乘操作符两侧的值       | 双目运算符 | a * b 等于 15        |
| /          | 除法 | 左操作数除以右操作数     | 双目运算符 | a / b 等于 1         |
| %          | 取余 | 左操作数除右操作数的余数 | 双目运算符 | a % b 等于 2         |
| ++         | 自增 | 操作数的值增加 1         | 单目运算符 | ++i（或 i++） 等于 2 |
| --         | 自减 | 操作数的值减少 1         | 单目运算符 | --i（或 i--） 等于 0 |

其中，自增 (++) 和自减 (--) 运算符有两种写法：**前缀（++i,--i）**和**后缀（i++,i--）**。

- 前缀自增自减法 (++i,--i): 先进行自增或者自减运算，再进行表达式运算。
- 后缀自增自减法 (i++,i--): 先进行表达式运算，再进行自增或者自减运算

新建一个源代码文件 `ArithmeticOperation.java`：

```java
public class ArithmeticOperation {
    public static void main(String args[]) {
        int a = 5;
        int b = 3;
        int c = 3;
        int d = 3;
        System.out.println("a + b = " + (a + b));
        System.out.println("a - b = " + (a - b));
        System.out.println("a * b = " + (a * b));
        System.out.println("a / b = " + (a / b));
        System.out.println("a % b = " + (a % b));
        System.out.println("a++ = " + (a++));
        System.out.println("++a = " + (++a));
        System.out.println("b-- = " + (b--));
        System.out.println("--b = " + (--b));
        System.out.println("c++ = " + (c++));
        System.out.println("++d = " + (++d));
    }
}
```

编译运行：

```bash
$ javac ArithmeticOperation.java
$ java ArithmeticOperation
a + b = 8
a - b = 2
a * b = 15
a / b = 1
a % b = 2
a++ = 5
++a = 7
b-- = 3
--b = 1
c++ = 3
++d = 4
```





### 位运算符

Java 定义了位运算符，应用于整数类型 (`int`)，长整型 (`long`)，短整型 (`short`)，字符型 (`char`)，和字节型 (`byte`) 等类型。位运算时先转换为二进制，再按位运算。

表格中的例子中，变量 `a` 的值为 60（二进制：`00111100`），变量 `b` 的值为 13（二进制：`00001101`）：

| 位运算符 | 名称         | 描述                                                         | 举例                              |
| -------- | ------------ | ------------------------------------------------------------ | --------------------------------- |
| &        | 按位与       | 如果相对应位都是 1，则结果为 1，否则为 0                     | （a＆b），得到 12，即 0000 1100   |
| 丨       | 按位或       | 如果相对应位都是 0，则结果为 0，否则为 1                     | （ a 丨 b ）得到 61，即 0011 1101 |
| ^        | 按位异或     | 如果相对应位值相同，则结果为 0，否则为 1                     | （a^b）得到 49，即 0011 0001      |
| ~        | 按位补       | 翻转操作数的每一位，即 0 变成 1，1 变成 0                    | （〜a）得到 -61，即 1100 0011     |
| <<       | 按位左移     | 左操作数按位左移右操作数指定的位数                           | a<<2 得到 240，即 1111 0000       |
| >>       | 按位右移     | 左操作数按位右移右操作数指定的位数                           | a>>2 得到 15 即 1111              |
| >>>      | 按位右移补零 | 左操作数的值按右操作数指定的位数右移，移动得到的空位以零填充 | a>>>2 得到 15 即 0000 1111        |

在 `/home/project` 目录下新建一个源代码文件 `BitOperation.java`：

```java
public class BitOperation {
    public static void main(String args[]) {
        int a = 60;
        int b = 13;
        System.out.println("a & b = " + (a & b));
        System.out.println("a | b = " + (a | b));
        System.out.println("a ^ b = " + (a ^ b));
        System.out.println("~a = " + (~a));
        System.out.println("a << 2 = " + (a << 2));
        System.out.println("a >> 2 = " + (a >> 2));
        System.out.println("a >>> 2 = " + (a >>> 2));
    }
}
```

编译运行：

```bash
$ javac BitOperation.java
$ java BitOperation
a & b = 12
a | b = 61
a ^ b = 49
~a = -61
a << 2 = 240
a >> 2 = 15
a >>> 2 = 15
```





### 逻辑运算符

逻辑运算符是通过运算符将操作数或等式进行逻辑判断的语句。

表格中的例子中，假设布尔变量 `a` 为真（`true`），变量 `b` 为假（`false`）：

| 逻辑运算符 | 名称 | 描述                                                         | 类型       | 举例                         |
| ---------- | ---- | ------------------------------------------------------------ | ---------- | ---------------------------- |
| && 或 &    | 与   | 当且仅当两个操作数都为真，条件才为真                         | 双目运算符 | (a && b) 或 (a & b) 为假     |
| \|\| 或 \| | 或   | 两个操作数任何一个为真，条件为真                             | 双目运算符 | （a \|\| b) 或 (a \| b) 为真 |
| !          | 非   | 用来反转操作数的逻辑状态。如果条件为真，则逻辑非运算符将得到假 | 单目运算符 | （!a）为假                   |
| ^          | 异或 | 如果两个操作数逻辑相同，则结果为假，否则为真                 | 双目运算符 | (a ^ b) 为真                 |

**`&&` 与 `||` 是具有短路性质，当按优先级顺序计算到当前表达式时，表达式的结果可以确定整个表达式的结果时，便不会继续向后进行判断和计算，而直接返回结果**。

例如：当使用 `&&` 逻辑运算符时，在两个操作数都为 `true` 时，结果才为 `true`，但是当得到第一个操作为 `false` 时，其结果就必定是 `false`，这时候就不会再判断第二个操作了。在计算表达式 `(a & b) && (a | b)` 时，首先计算 `a & b` 得到了 `false`，因为之后是 `&&`，任何值与 `false` 进行与操作都是 `false`，所以可以不用再计算下去，而直接返回 `a & b` 的结果 `false`。

在`/home/project`目录下新建一个`LogicOperation.java`。

```java
public class LogicOperation {
    public static void main(String args[]) {
        boolean a = true;
        boolean b = false;
        System.out.println("a && b = " + (a && b));
        System.out.println("a || b = " + (a || b));
        System.out.println("!a = " + (!a));
        System.out.println("a ^ b = " + (a ^ b));
    }
}
```

编译运行：

```bash
$ javac LogicOperation.java
$ java LogicOperation
a && b = false
a || b = true
!a = false
a ^ b = true
```





关系运算符

关系运算符生成的是一个 `boolean`（布尔）结果，它们计算的是操作数的值之间的关系。如果关系是真实的，结果为 `true`（真），否则，结果为 `false`（假）。

表格中的例子中，假设变量 `a` 为 3，变量 `b` 为 5：

| 比较运算符 | 名称     | 描述                                                         | 举例               |
| ---------- | -------- | ------------------------------------------------------------ | ------------------ |
| ==         | 等于     | 判断两个操作数的值是否相等，如果相等则条件为真               | (a == b） 为 false |
| !=         | 不等于   | 判断两个操作数的值是否相等，如果值不相等则条件为真           | (a != b) 为 true   |
| >          | 大于     | 判断左操作数的值是否大于右操作数的值，如果是那么条件为真     | (a > b) 为 false   |
| <          | 小于     | 判断左操作数的值是否小于右操作数的值，如果是那么条件为真     | (a < b) 为 true    |
| >=         | 大于等于 | 判断左操作数的值是否大于或等于右操作数的值，如果是那么条件为真 | (a >= b) 为 false  |
| <=         | 小于等于 | 判断左操作数的值是否小于或等于右操作数的值，如果是那么条件为真 | (a <= b) 为 true   |

除了上表列出的二元运算符，Java 还有唯一的一个三目运算符 `?:` 。

语法格式：

```txt
布尔表达式 ？表达式 1 : 表达式 2;
```

运算过程：如果布尔表达式的值为 `true`，则返回**表达式 1**的值，否则返回**表达式 2**的值。

在 `/home/project` 目录下新建一个源代码文件 `RelationalOperation.java`：

```java
public class RelationalOperation {
    public static void main(String args[]) {
        int a = 3;
        int b = 5;
        System.out.println("a == b = " + (a == b));
        System.out.println("a != b = " + (a != b));
        System.out.println("a > b = " + (a > b));
        System.out.println("a < b = " + (a < b));
        System.out.println("a >= b = " + (a >= b));
        System.out.println("a <= b = " + (a <= b));
        System.out.println("a > b ? a : b = " + (a > b ? a : b));
    }
}
```

编译运行：

```bash
$ javac RelationalOperation.java
$ java RelationalOperation
a == b = false
a != b = true
a > b = false
a < b = true
a >= b = false
a <= b = true
a > b ? a : b = 5
```

**强调**：

- `==` 和 `!=` 适用于所有的基本数据类型，其他关系运算符不适用于 `boolean`，因为 `boolean` 值只有 `true` 和 `false`，比较没有任何意义。
- `==` 和 `!=` 也适用于所有对象，可以比较对象的**引用**是否相同。

**引用：Java 中一切都是对象，但操作的标识符实际是对象的一个引用。**





### 方法

Java 中的方法，可以将其看成一个功能的集合，它们是为了解决特定问题的代码组合。

方法的定义语法：

```java
访问修饰符 返回值类型 方法名(参数列表) {
    方法体
}
```

比如：

```java
public void functionName(Object arg) {
  System.out.println("Hello World.");
}
```

在上面的语法说明中：

1. **访问修饰符**：代表方法允许被访问的权限范围， 可以是 `public`、`protected`、`private` 或者省略（`default`） ，其中 `public` 表示该方法可以被其他任何代码调用。
2. **返回值类型**：方法返回值的类型，如果方法不返回任何值，则返回值类型指定为 `void` （代表无类型）；如果方法具有返回值，则需要指定返回值的类型，并且在方法体中使用 `return` 语句返回值。
3. **方法名**：是方法的名字，必须使用合法的标识符。
4. **参数列表**：是传递给方法的参数列表，参数可以有多个，多个参数间以逗号隔开，每个参数由参数类型和参数名组成，以空格隔开。当方法被调用时，传递值给参数。这个值被称为实参或变量。参数列表是指方法的参数类型、顺序和参数的个数。参数是可选的，方法可以不包含任何参数。
5. **方法体**：方法体包含具体的语句，定义该方法的功能。

根据方法是否带参、是否带返回值，可将方法分为四类：

- 无参无返回值方法
- 无参带返回值方法
- 带参无返回值方法
- 带参带返回值方法

当方法定义好之后，需要调用才可以生效，我们可以通过 `main` 方法（`main` 方法是 Java 程序的入口，所以需要用它来调用）来调用它，比如：

在 `/home/project` 下建立 `MethodDemo.java`：

```java
public class MethodDemo {
    public static void main(String[] args){
        method();
    }
    //这里要加上 static 关键字 因为静态方法只能调用静态方法
    public static void method(){
        System.out.println("方法被调用");
    }
}
```

编译运行：

```bash
javac MethodDemo.java
java MethodDemo
方法被调用
```





## Java基础语法(下)

### 流程控制

#### if语句

`if` 语句是一种判断语句。

语法：

```java
if(条件){
    条件成立时执行的代码
}
```

<img src="https://doc.shiyanlou.com/document-uid79144labid1051timestamp1434347907568.png/wm" alt="if语句执行过程"  />

`if...else` 语句当条件成立时，则执行 `if` 部分的代码块； 条件不成立时，则进入 `else` 部分。例如，如果一个月天数大于 30 天，则为大月，否则为小月。

语法：

```java
if(条件){
    代码块1
}
else{
    代码块2
}
```

![if...else语句执行过程](https://doc.shiyanlou.com/document-uid79144labid1051timestamp1434347936247.png/wm)

多重 `if` 语句，在条件 1 不满足的情况下，才会进行条件 2 的判断，以此向下；当前面的条件均不成立时，最终执行 `else` 块内的代码。

语法：

```java
if(条件1){
    代码块1
}
else if(条件2){
    代码块2
}
...
else {
    代码块n
}
```

![多重if语句](https://doc.shiyanlou.com/document-uid79144labid97timestamp1437039991806.png/wm)

> 注意：如果 `if`（或 `else if`，或 `else`) 条件成立时的执行语句只有一条，是可以省略大括号的！但如果执行语句有多条，那么大括号就是不可或缺的。

比如：

```java
int days = 31;
if(days > 30)
    System.out.println("本月是大月");
else
    System.out.println("本月是小月");
```

if 语句是可以在内层进行嵌套的。嵌套 if 语句，只有当外层 if 的条件成立时，才会判断内层 if 的条件。

语法：

```java
if(条件1){
    if(条件2){
        代码块1
    }
    else{
        代码块2
    }
}
else{
    代码块3
}
```

![if的嵌套](https://doc.shiyanlou.com/document-uid79144labid1051timestamp1434348012040.png/wm)

`if` 语句练习：小明考了 78 分，60 分以上及格，80 分以上为良好，90 分以上为优秀，60 分以下要重考，编写源代码 `ScoreJudge.java`，输出小明的情况。

参考代码如下：

```java
public class ScoreJudge {
    public static void main(String[] args){
        int score = 78;
        if(score >= 60){
            if(score >= 80){
                if(score >= 90){
                    System.out.println("成绩优秀");
                }
                else{
                    System.out.println("成绩良好");
                }
            }
            else{
                System.out.println("成绩及格");
            }
        }
        else{
            System.out.println("需要补考");
        }
    }
}
```

> **注**：所有的条件语句都是利用条件表达式的真或假来决定执行路径，Java 里不允许将一个数字作为布尔值使用，虽然这在 C 和 C++ 是允许的，如果要在布尔测试里使用一个非布尔值，需要先用一个条件表达式将其转换成布尔值，其他控制语句同理。

编译执行：

```shell
$ javac ScoreJudge.java
$ Java ScoreJude
成绩及格
```



#### switch语句

当需要对选项进行等值判断时，使用 `switch` 语句更加简洁明了。比如：摇号摇到 1 的得一等奖，摇到 2 的得二等奖，摇到 3 的等三等奖，摇到其他的没有奖。

语法：

```java
switch(表达式){
    case 值1:
        代码块1
        break;
    case 值2:
        代码块2
        break;
    ...
    default:
        默认执行的代码块
}
```

当 `switch` 后表达式的值和 `case` 语句后的值相同时，从该位置开始向下执行，直到遇到 `break` 语句或者 `switch` 语句块结束；如果没有匹配的 `case` 语句则执行 `default` 块的代码。

- `defualt` 块不是必须的，默认为空。

新建一个源代码文件`Draw.java`。

```java
public class Draw {
    public static void main(String[] args){
        int num = 2;
        switch(num){
        case 1:
            System.out.println("恭喜你，获得了一等奖");
            break;
        case 2:
            System.out.println("恭喜你，获得了二等奖");
            break;
        case 3:
            System.out.println("恭喜你，获得了三等奖");
            break;
        default:
            System.out.println("很遗憾，下次再来");
        }
    }
}
```

编译运行：

```bash
$ javac Draw.java
$ java Draw
恭喜你，获得了二等奖
```





#### while和do-while语句

`while`语法：

```java
while(条件){
    代码块
}
```

`while` 的执行过程是先判断，再执行。

1. 判断 `while` 后面的条件是否成立 ( `true` or `false` )
2. 当条件成立时，执行循环内的代码。

然后重复执行 `1`、`2`， 直到循环条件不成立为止。

![while的语句流程](https://doc.shiyanlou.com/document-uid79144labid1051timestamp1434348643037.png/wm)

`do-while` 语法：

```java
do{
    代码块
}while(条件);
```

`do-while` 的执行过程是先执行一次，再循环判断（所以循环内的代码至少会执行一次）。

1. 先执行一遍循环操作，然后判断循环条件是否成立。
2. 如果条件成立，继续执行`1`、`2`，直到循环条件不成立为止。

![do...while的流程](https://doc.shiyanlou.com/document-uid79144labid1051timestamp1434348718160.png/wm)

如：

```java
int i = 0;
while(i < 100){
    System.out.println("I love ShiYanlou!");
    i++;
}
int i = 0;
do {
    System.out.println("I love ShiYanlou!");
    i++;
} while(i < 100);
```

练习：分别用 `while` 和 `do-while` 两种方法，编写代码，文件名为： `SumOfEven.java`。实现计算 1-1000 中所有偶数的和，并输出。验证一下两种方法你输出的结果是一致吗？

参考代码如下：

```java
public class SumOfEven {
    public static void main(String[] args){
        int i1 = 1, i2 = 1;
        int sum1 = 0, sum2 = 0;

        while (i1 <= 1000){     //循环1000次
            if(0 == i1 % 2){   //判断是否为偶数
                sum1 += i1;    //将偶数加入到总数里
            }
            i1++;              //i自增1
        }
        System.out.println("用while，1到1000中，所有偶数的和为："+sum1);

        do {
            if (0 == i2 % 2){   //在条件语句中，将数值写在前面是为了防止将==写成了=
                sum2 += i2;
            }
            i2++;
        } while(i2 <= 1000);
        System.out.println("用do-while，1到1000中，所有偶数的和为："+sum2);
    }
}
```

编译运行：

```bash
$ javac SumOfEven.java
$ java SumOfEven
用while，1到1000中，所有偶数的和为：250500
用do-while，1到1000中，所有偶数的和为：250500
```





#### for语句

`for` 语法：

```java
for(循环变量初始化①; 循环条件②; 循环变量值操作③){
    循环操作④
}
```

`for` 相比 `while` 和 `do-while` 语句结构更加简洁易读，它的执行顺序：

1. 执行循环变量初始化部分（1），设置循环的初始状态，此部分在**整个循环中只执行一次**。
2. 进行循环条件的判断（2），如果条件为 `true`，则执行循环体内代码（4）；如果为 `false` ，则直接退出循环。
3. 执行循环变量值操作部分（3），对循环变量的值进行修改，然后进行下一次循环条件判断（4）。

整个循环的流程可以简化为：

```txt
(1) -> [(2)->(4)->(3)] -> [(2)->(4)->(3)] -> ... => (3) 结果为 false, 退出循环。
```

![for的流程](https://doc.shiyanlou.com/document-uid79144labid1051timestamp1434348757545.png/wm)

例如，计算 100 以内不能被 3 整除的数之和：

```java
    int sum = 0; // 保存不能被3整除的数之和
    // 循环变量 i 初始值为 1 ,每执行一次对变量加 1，只要小于等于 100 就重复执行循环
    for (int i = 1;i<=100;i++) {
    // 变量 i 与 3 进行求模（取余），如果不等于 0 ，则表示不能被 3 整除
        if (i % 3 != 0) {
            sum = sum + i; // 累加求和
        }
    }
    System.out.println("1到100之间不能被3整除的数之和为：" + sum);
```

练习：编写代码，文件名为： `SumOfEven.java`，实现计算 1-1000 中所有偶数的和，并输出。

参考代码如下：

```java
public class SumOfEven {
    public static void main(String[] args){
        int sum = 0;
        for(int i = 1; i <= 1000; i++){
            if(0 == i % 2){
                sum += i;
            }
        }
        System.out.println("用for，1到1000中，所有偶数和为："+sum);
    }
}
```

编译运行：

```shell
$ javac SumOfEven.java
$ java SumOfEven
用for，1到1000中，所有偶数和为：250500
```





### 练习题：字符串处理

在 `/home/project/` 目录下新建文件 `StringUtil.java`，你需要实现以下需求：

- 从控制台输入一行字符串
- 去除字符串中的所有空格
- 打印去除空格后的字符串

示例：

```java
输入：
    shi ya n  lou
输出：
    shiyanlou
```

提示：`java.util.Scanner` 可以获取控制台输入。

```java
Scanner in = new Scanner(System.in);
//获取String值
String a = in.nextLine();
```

我的方法：

```java
import java.util.Scanner;
public class StringUtil{
    public static void main(String[] args){
        Scanner in = new Scanner(System.in);
        String a = in.nextLine();
        String b = a.replaceAll(" ","");
        System.out.println(b);
    }
}
```

答案方法：

```java
import java.util.Scanner;
public class StringUtil {
    public static void main(String[] args) {
        Scanner in =new Scanner(System.in);
        //获取String值
        String a=in.nextLine();
        StringBuilder stringBuilder = new StringBuilder(a);
        for (int i = 0; i < stringBuilder.length(); i++) {
            if (stringBuilder.charAt(i)==' ') {
                System.out.println(i);
                stringBuilder.deleteCharAt(i);
                i--;
            }else {
                stringBuilder.charAt(i);
            }
        }
        System.out.println(stringBuilder.toString());
    }
}
```

### 练习题：字符串处理

在`/home/project/`目录下新建`ContrastString.java`，你需要实现以下需求：

- 从控制台输入字符串 a 和字符串 b
- 比较字符串 a 和字符 b 是否完全一致，长度，内容等完全一致。
- 如果完全一致，输出`相同`，如果不一致，输出`不同`。
- 禁止使用`equals`方法

示例：

```java
输入：
    abc3
    abc3
输出：
    相同
```

提示：`java.util.Scanner` 可以获取控制台输入。

```java
import java.util.Scanner;

public class App{
      public static void main(String[] args){
          Scanner in = new Scanner(System.in);
        //获取String值
        String a = in.nextLine();
        String b = in.nextLine();
    }
}
```

我的：

```java
import java.util.Scanner;

public class ContrastString{
      public static void main(String[] args){
        Scanner in = new Scanner(System.in);
        //获取String值
        String a = in.nextLine();
        String b = in.nextLine();
        int len1 = a.length();
        int len2 = b.length();

        if(len1==len2){
            for(int i=0;i<len1;i++){
                if(a.charAt(i)!=b.charAt(i)){
                    System.out.println("不同");
                    return;
                }
            }
            System.out.println("相同");
        }else{
            System.out.println("不同");
        }
    }
}
```

答案：

```java
import java.util.Scanner;

public class ContrastString {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        //获取String值
        String a = in.nextLine();
        String b = in.nextLine();
        if (a.length() != b.length()) {
            System.out.println("不同");
            return;
        }
        for (int i = 0; i < a.length(); i++) {
            if (a.charAt(i) != b.charAt(i)) {
                System.out.println("不同");
                return;
            }
        }
        System.out.println("相同");
    }
}
```

### 练习题：打印星期

在`/home/project/`目录下新建一个源代码文件`PrintWeek.java`。

你需要实现当输入 1-7 的数字时返回对应的星期：

- 从控制台获取一个整型参数
- 当输入数字 1 时输出`今天是星期一`
- 当输入数字 2 时输出`今天是星期二`

以此类推

示例：

```java
输入：
    1
输出：
    今天是星期一
```

提示：`java.util.Scanner`可以获取控制台输入。

```java
Scanner in =new Scanner(System.in);
//获取int值
int x=in.nextInt();
```

我的&答案：都是switch结构

```java
import java.util.Scanner;
public class PrintWeek{
    public static void main(String[] args){
        Scanner in =new Scanner(System.in);
        //获取int值
        int x=in.nextInt();

        switch(x){
            case 1:
                System.out.println("今天是星期一");
                break;
            case 2:
                System.out.println("今天是星期二");
                break;
            case 3:
                System.out.println("今天是星期三");
                break;
            case 4:
                System.out.println("今天是星期四");
                break;
            case 5:
                System.out.println("今天是星期五");
                break;
            case 6:
                System.out.println("今天是星期六");
                break;
            case 7:
                System.out.println("今天是星期天");
                break;
            default:
                break;
        }
    }
}
```





### 数组

所谓数组，是有序的元素序列。若将有限个类型相同的变量的集合命名，那么这个名称为数组名。组成数组的各个变量称为数组的分量，也称为数组的元素，有时也称为下标变量。用于区分数组的各个元素的数字编号称为下标。数组是在程序设计中，为了处理方便，把具有相同类型的若干元素按无序的形式组织起来的一种形式。这些无序排列的同类数据元素的集合称为数组。数组是用于储存多个相同类型数据的集合。-- 来自百度百科

简单来说，数组就是相同数据类型的元素按一定顺序排列的集合。可以把它看成一个大的盒子，里面按顺序存放了多个数据类型相同的数据。

![数组的定义](https://doc.shiyanlou.com/document-uid79144labid1052timestamp1434356533170.png/wm)

数组中的元素都可以通过下标来访问，**下标从 0 开始，到数组长度 -1 结束**。例如，可以通过 `ages[0]` 获取数组中的第一个元素 18 ，`ages[3]` 就可以取到第四个元素 10。

**注意**：

使用数组前要声明数组。

语法：

```java
数据类型[ ] 数组名;   //或者: 数据类型 数组名[ ];
```

数组名为任意合法的变量名，如：

```java
int ages[];      //存放年龄的数组，类型为整型
char symbol[];   //存放符号的数组，类型为字符型
String [] name;  //存放名称的数组，类型为字符串型
```

声明数组后，需要为数组分配空间，也就是定义多大的数组。

语法：

```java
数组名 = new  数据类型 [ 数组长度 ];
```

数组长度就是数组最多可存放元素的个数。可以在数组声明的时候初始化数组，或者在声明时就为它分配好空间，这样就不用再为数组分配空间。

语法：

```java
int [] ages = {12,18,9,33,45,60}; //声明并初始化了一个整型数组，它有6个元素
char [] symbol = new char[10] //声明并分配了一个长度为10的char型数组
```

分配空间后就可以向数组中放数据了，数组中元素都是通过下标来访问的。 如：

```java
ages[0]=12;
```

Java 中可以将一个数组赋值给另一个数组，如：

```java
int [] a1 = {1,2,3};
int [] a2;
a2 = a1;
```

这里只是复制了一个引用，即 a2 和 a1 是相同数组的不同名称。

在`/home/project/`下新建一个`Test.java`测试一下。

```java
public class Test {
    public static void main(String[] args) {
        int [] a1 = {1,2,3};
        int [] a2;
        a2 = a1;
        for(int i = 0; i < a2.length; i++){
            a2[i]++;
        }
        for(int i = 0; i < a1.length; i++){
            System.out.println(a1[i]);
        }
    }
}
```

编译输出：

```bash
$ javac Test.java
$ java Test
2
3
4
```

可以看到，修改 a2 的值，a1 的值也跟着变化。

数组遍历：

```java
int [] ages = {12, 18, 9, 33, 45, 60};
for(int i = 0; i < ages.length; i++){ //ages.length是获取数组的长度
    System.out.println("数组中第"+(i+1)+"个元素是 "+ages[i]); //数组下标是从零开始，一定要注意
}
```

**注意**：

1. 数组下标从 0 开始。所以数组的下标范围是 0 至 数组长度 -1。
2. 数组不能越界访问，否则会报错。

for 语句在数组内可以使用特殊简化版本，在遍历数组、集合时，foreach 更简单便捷。从英文字面意思理解 foreach 也就是“ for 每一个”的意思。

语法：

```java
for(元素类型 元素变量:遍历对象){
    执行的代码
}
```

在`/home/project/`下新建`JudgePrime.java`

```java
public class JudgePrime {
    public static void main(String[] args){
        int [] ages = {12, 18, 9, 33, 45, 60};
        int i = 1;
        for(int age:ages){
            System.out.println("数组中第"+i+"个元素是"+age);
            i++;
        }
    }
}
```

编译运行：

```bash
$ javac JudgePrime.java
$ java JudgePrime
数组中第1个元素是12
数组中第2个元素是18
数组中第3个元素是9
数组中第4个元素是33
数组中第5个元素是45
数组中第6个元素是60
```





### Scanner输入

Java 可以使用 `java.util` 包下的`Scanner` 类来获取用户的输入。使用 `import java.util.Scanner;` 即可导入 Scanner，使用方法示例：

在 `/home/project` 目录下新建 `ScannerDemo.java` 类。

```java
import java.util.Scanner;

public class ScannerDemo {
    public static void main(String[] args) {
        Scanner in=new Scanner(System.in);
        //获取用户输入的一行数据  返回为字符串
        String s = in.nextLine();
        System.out.println(s);
        //循环读取String数据，当输入exit时退出循环
        while (!in.hasNext("exit")) {
            System.out.println(in.nextLine());
        }
        //关闭输入
        in.close();
    }
}
```

编译运行：

```java
javac ScannerDemo.java
java ScannerDemo
```

运行结果示例：

```shell
shiyanlou
shiyanlou
aa
aa
bbb
bbb
cc
cc
exit
```

除去以上列举的方法，其他方法可以在 API 文档中查询https://docs.oracle.com/javase/8/docs/api/java/util/Scanner.html。



### 练习题：用户输入

在 `/home/project/` 目录下新建文件 `InputTest.java`，你需要完成以下需求：

- 获取用户的输入信息（字符串）。
- 当用户输入 end 时，结束输入并打印用户之前输入的所有信息（输入的信息数量不超过 100 个）。

示例：

```shell
输入：
    shi
    yan
    lou
    end
输出：
    shi
    yan
    lou
```

提示：

- 使用数组保存元素。

我的：直接参照上面Scanner的示例

```java
import java.util.Scanner;

public class InputTest {
    public static void main(String[] args) {
        Scanner in=new Scanner(System.in);
        String s = in.nextLine();
        System.out.println(s);

        while (!in.hasNext("end")) {
            System.out.println(in.nextLine());
        }
        in.close();
    }
}
```

答案：

```java
import java.util.Scanner;

public class InputTest {
    public static void main(String[] args) {
        String[] data = new String[100];
        Scanner in = new Scanner(System.in);
        for (int i = 0; i < 100; i++) {
            if ((data[i] = in.nextLine()).equals("end")) {
                break;
            }
        }
        for (String a : data) {
            if (a.equals("end")) {
                break;
            }
            System.out.println(a);
        }
    }
}
```



### 练习题：最大最小值

现给出一串数据（313, 89, 123, 323, 313, 15, 90, 56, 39）求出最大值和最小值并输出。

在 `/home/project/` 目录下新建文件 `MaxAndMin.java`，在其中编写正确的代码。

我的&答案：差别不大

```java
import java.util.Scanner;

public class MaxAndMin {
    public static void main(String[] args) {
        int[] data ={313, 89, 123, 323, 313, 15, 90, 56, 39};
        int max= -1;
        int min= 10010;
        for(int i=0;i<data.length;i++){
            if(max<data[i])
                max=data[i];
            if(min>data[i])
                min=data[i];
        }
        System.out.println("最大值："+max+"最小值："+min);
    }
}
```

