---
title: Intent详解
tags: Android
categories: 学习
abbrlink: 89a5df9d
date: 2020-07-02 21:14:42
---

# Android中使用Intent的总结

学习Android一开始就是活动（Activity），而Intent就是连接活动的重要组件。

Android中提供了Intent机制来协助应用间的交互与通讯，或者采用更准确的说法是，Intent不仅可用于应用程序之间，也可用于应用程序内部的activity, service和broadcast receiver之间的交互。Intent是一种运行时绑定（runtime binding)机制，它能在程序运行的过程中连接两个不同的组件。通过Intent，你的程序可以向Android表达某种请求或者意愿，Android会根据意愿的内容选择适当的组件来响应。

参考文档：

[Intent 和 Intent 过滤器](https://developer.android.google.cn/guide/components/intents-filters)

[Android组件系列----Intent详解](https://www.cnblogs.com/qianguyihao/p/3959204.html)

> 江山代有才人出，各领风骚数百年。

<!--more-->

## 1 Intent概念

`Intent` 是一个消息传递对象，您可以用来从其他[应用组件](https://developer.android.google.cn/guide/components/fundamentals#Components)请求操作。尽管 Intent 可以通过多种方式促进组件之间的通信，但其基本用例主要包括以下三个：

- **启动Activity**

  通过将 `Intent` 传递给 `startActivity()`，可以启动新的 `Activity` 实例。`Intent` 用于描述要启动的 Activity，并携带任何必要的数据。

  如果希望在 Activity 完成后收到结果，可以调用 `startActivityForResult()`。在 Activity 的 `onActivityResult()` 回调中， Activity 将结果作为单独的 `Intent` 对象接收。

- **启动服务**

  `Service` 是一个不使用用户界面而在后台执行操作的组件。使用 Android 5.0（API 级别 21）及更高版本，您可以启动包含 `JobScheduler` 的服务。如需了解有关 `JobScheduler` 的详细信息，请参阅其 `API-reference documentation`。

  对于 Android 5.0（API 级别 21）之前的版本，您可以使用 `Service` 类的方法来启动服务。通过将 `Intent` 传递给 `startService()`，您可以启动服务执行一次性操作（例如，下载文件）。`Intent` 用于描述要启动的服务，并携带任何必要的数据。

  如果服务旨在使用客户端-服务器接口，则通过将 `Intent` 传递给 `bindService()`，您可以从其他组件绑定到此服务。如需了解详细信息，请参阅[服务](https://developer.android.google.cn/guide/components/services)指南。

- **传递广播**

  广播是任何应用均可接收的消息。系统将针对系统事件（例如：系统启动或设备开始充电时）传递各种广播。通过将 `Intent` 传递给 `sendBroadcast()` 或 `sendOrderedBroadcast()`，您可以将广播传递给其他应用。

## 2 Intent类型

Intent分为两种类型：

- **显示Intent**

  即直接指明了需要交互的Activity对应的类，用于启动某个特定应用组件

- **隐式Intent**

  隐式 Intent 指定能够在可以执行相应操作的设备上调用任何应用的操作，相比于显式Intent，隐式Intent不指定组件名，而是指定Intent的Action、Data或Category，当启动组件时，系统会去匹配`AndroidManifest.xml`中相关的`Intent-filter`，逐一匹配满足属性的组件，不止一个满足条件时会弹出应用选择框。

<img src="http://img.salute61.top/Intent-Filter%E5%8C%B9%E9%85%8D%E8%BF%87%E7%A8%8B.png" style="zoom:50%;"/>

## 3 Intent相关属性

Intent有7个属性，其中除了Component是直接属性，其他都是可选属性：

1. component(组件)：目的组件
2. action（动作）：用来表现意图的行动
3. category（类别）：用来表现动作的类别
4. data（数据）：表示与动作要操纵的数据
5. type（数据类型）：对于data范例的描写
6. extras（扩展信息）：扩展信息
7. Flags（标志位）：期望这个意图的运行模式

### 3.1 component（组件）

Component属性明确指定Intent的目标组件的类名称。（属于直接Intent）如果 component这个属性有指定的话，将直接使用它指定的组件。指定了这个属性以后，Intent的其它所有属性都是可选的。

```java
//Activity1中点击button1跳转到Activity2
button1.setOnClickListener(new OnClickListener() {
            @Override
            public void onClick(View v) {
                //创建一个意图对象
                Intent intent = new Intent();
                //创建组件，通过组件来响应
                ComponentName component = new ComponentName(MainActivity.this, SecondActivity.class);
                intent.setComponent(component);
                startActivity(intent);
            }
        });
```

或者使用setClass：

```java
Intent intent = new Intent();
//setClass函数的第一个参数是一个Context对象
//Context是一个类，Activity是Context类的子类，也就是说，所有的Activity对象，都可以向上转型为Context对象
//setClass函数的第二个参数是一个Class对象，在当前场景下，应该传入需要被启动的Activity类的class对象
intent.setClass(MainActivity.this, SecondActivity.class);
startActivity(intent); 
```

更简单常用的是直接使用Intent的构造函数：

```java
Intent intent=new Intent(FirstActivity.this,secondActivity.class);
startActivity(intent);
```



### 3.2 Action（动作）

在Intent中，Action就是描述做、写等动作的，当你指明了一个Action，执行者就会依照这个动作的指示，接受相关输入，表现对应行为，产生符合的输出（实际action属性就是一个字符串标记而已）。在Intent类中，定义了一批量的动作，比如ACTION_VIEW，ACTION_PICK等， 基本涵盖了常用动作。加的动作越多，越精确。

Action 是一个用户定义的字符串，用于描述一个 Android 应用程序组件，一个 Intent Filter 可以包含多个 Action。在 AndroidManifest.xml 的Activity 定义时，可以在其 <intent-filter >节点指定一个 Action列表用于标识 Activity 所能接受的“动作”。

| 类型            | 作用                                                         |
| :-------------- | :----------------------------------------------------------- |
| `ACTION_MAIN`   | 表示程序的入口                                               |
| `ACTION_VIEW`   | 配合intent.setData(uri)使用，跳转到指定数据的界面            |
| `ACTION_DAIL`   | 显示Data指向的号码并在拨号界面Dailer上                       |
| `ACTION_PICK`   | 选择一个一条的Data并且返回它，是一种精确跳转方式(满足条件的Activity只有一个) |
| `ACTION_SEND`   | 发送Data到指定地方（sendto可以发送多组Data）                 |
| `ACTION_EDIT`   | 配合intent.setData(uri)使用，根据不同数据类型的uri，跳转到可编辑的uir指定的需要修改的数据的指定页面。 |
| `ACTION_INSERT` | 添加一个空的项到容器中                                       |
| `ACTION_SEARCH` | 执行搜索                                                     |
| `ACTION_RUN`    | 运行Data                                                     |

### 3.3 category（类别）

Category属性也是作为<intent-filter>子元素来声明的。Action 和category通常是放在一起用的，例如Activity1跳转到Activity2的隐式Intent即可以采用此方法：

```java
//隐式Intent，Activity1中的OnClick方法
Intent intent=new Intent("com.example.activitytest.Action_START");
intent.addCategory("com.example.activitytest.MY_CATEGORY");
startActivity(intent);

//在对应的AndroidManifest.xml添加
        <activity android:name=".secondActivity">
            <intent-filter>
                <action android:name="com.example.activitytest.Action_START" />
                <category android:name="android.intent.category.DEFAULT" />
                <category android:name="android.intent.category.MY_CATEGORY" />
            </intent-filter>
        </activity>
//在Intent添加类别可以添加多个类别，那就要求被匹配的组件必须同时满足这多个类别，才能匹配成功。操作Activity的时候，如果没有类别，须加上默认类别
```

`action`表示匹配的动作，category默认为default，即：**只有<action>和<category>中的内容同时能够匹配上Intent中指定的action和category时，这个活动才能响应Intent。而如果有多个组件匹配成功，就会以对话框列表的方式让用户进行选择。**



常用的category添加：

| 类型                  | 作用                                                         |
| --------------------- | ------------------------------------------------------------ |
| `CATEGORY_DEFAULT`    | 把一个组件Component设为可被implicit启动的                    |
| `CATEGORY_LAUNCHER`   | 把一个action设置为在顶级执行。并且包含这个属性的Activity所定义的icon将取代application中定义的icon |
| `CATEGORY_BROWSABLE`  | 当Intent指向网络相关时，必须要添加这个类别                   |
| `CATEGORY_HOME`       | 使Intent指向Home界面                                         |
| `CATEGORY_PREFERENCE` | 定义的Activity是一个偏好面板Preference Panel                 |



### 3.4 data（数据）

- Data属性是Android要访问的数据，于前面类似也在<intent-filter>中，当有多个组件匹配成功时显示优先级高的，相同则显示列表
- Data是用Uri对象来表示的，uri代表数据的地址，属于一种标识符。

```java
//打开浏览器
Intent intent=new Intent(Intent.ACTION_VIEW);
intent.setData(Uri.parse("http://salute61.top/"));
startActivity(intent);
//初始时调用系统默认的浏览器，可以在清单中修改一下匹配2个       
<activity android:name=".ThirdActivity">
            <intent-filter>
                <action android:name="android.intent.action.VIEW"></action>
                <category android:name="android.intent.category.DEFAULT"></category>
                <category android:name="android.intent.category.BROWSABLE"></category>
                <data android:scheme="http"></data>
            </intent-filter>
        </activity>
```

<img src="http://img.salute61.top/Intent%E9%9A%90%E5%BC%8F%E5%8C%B9%E9%85%8D%E5%A4%9A%E4%B8%AA.png" style="zoom:50%;"/>

注：当然匹配到的testActivity中的Activity2并没有对应的功能代码，这里只是演示，实际项目开发中不要将没有对应功能的Activity进行响应

Type属性用于明确指定Data属性的数据类型或MIME类型，但是通常来说，当Intent不指定Data属性时，Type属性才会起作用，否则Android系统将会根据Data属性值来分析数据的类型，所以无需指定Type属性。

data和type属性一般只需要一个，通过setData方法会把type属性设置为null，相反设置setType方法会把data设置为null，如果想要两个属性同时设置，要使用Intent.setDataAndType()方法。



### 3.5 type（数据类型）

如果Intent对象中既包含Uri又包含Type，则在<intent-filter>中也必须将二者都包含

Type属性用于明确指定Data属性的数据类型或MIME类型，但是通常来说，当Intent不指定Data属性时，Type属性才会起作用，否则Android系统将会根据Data属性值来分析数据的类型，所以无需指定Type属性。

data和type属性一般只需要一个，通过setData方法会把type属性设置为null，相反设置setType方法会把data设置为null，如果想要两个属性同时设置，要使用Intent.setDataAndType()方法。



### 3.6 extras（扩展信息）

extras可以携带完成请求操作所需的附加信息的键值对。正如某些操作使用特定类型的数据 URI 一样，有些操作也使用特定的 extra。

您可以使用各种 `putExtra()` 方法添加 extra 数据，每种方法均接受两个参数：键名和值。您还可以创建一个包含所有 extra 数据的 `Bundle` 对象，然后使用 `putExtras()` 将 `Bundle` 插入 `Intent` 中。

例如，使用 `ACTION_SEND` 创建用于发送电子邮件的 Intent 时，可以使用 `EXTRA_EMAIL` 键指定*目标*收件人，并使用 `EXTRA_SUBJECT` 键指定*主题*。

向下一个活动传递数据：

```java
String data="使用Intent传递的数据";
Intent intent=new Intent(FirstActivity.this,secondActivity.class);
intent.putExtra("extra_data",data);
startActivity(intent);

//在secondActivity中接收
Intent intent=getIntent();
String data=intent.getStringExtra("extra_data");
Log.d("secondActivity",data);
```

<img src="http://img.salute61.top/Intent%E4%BC%A0%E9%80%92%E6%95%B0%E6%8D%AE.png">

返回数据给上一个活动（使用startActivityForResult），由于使用startActivityForResult启动了secondActivity，因此secondActivity销毁后会回调上一个活动的onActivityResult方法，因此要重写一下：

```java
//FirstActivity代码
Intent intent=new Intent(FirstActivity.this,secondActivity.class);
startActivityForResult(intent,1);
//SecondActivity中添加返回数据的逻辑
Intent intent=new Intent();
intent.putExtra("data_return","secondActivity返回的数据");
setResult(RESULT_OK,intent);
finish();

//重写onActivityResult方法
    @Override
    protected void onActivityResult(int requestCode,int resultCode,Intent data){
        super.onActivityResult( requestCode, resultCode,data);
        switch (requestCode){
            case 1:
                if(resultCode==RESULT_OK){
                    String returnData=data.getStringExtra("data_return");
                    Log.d("FirstActivity",returnData);
                }
                break;
                default:
        }
    }
```

<img src="http://img.salute61.top/Intent%E6%95%B0%E6%8D%AE%E4%BC%A0%E9%80%922.png">

### 3.7 Flag（标志位）

一个程序启动后系统会为这个程序分配一个task供其使用，另外同一个task里面可以拥有不同应用程序的activity。那么，同一个程序能不能拥有多个task？相关知识涉及到加载activity的启动模式

注：android中一组逻辑上在一起的activity被叫做task，自己认为可以理解成一个activity堆栈。