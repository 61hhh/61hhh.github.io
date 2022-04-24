---
title: Java读取txt文件&处理
date: 2020-06-04 16:33:54
tags: Java基础
categories: Java
---

### 前言

因为实验课的任务需要做一个交通的查询功能，因此要将在txt文档中的高铁、航班信息读取+处理

简单的代码编写过程中，也遇到了很多问题，例如文档编码格式为ANSI，而我设置的UTF-8读到的是乱码；用数组存数据报数组越界问题；String转Double类型出现精度缺失问题。。。

> 长剑横九野，高冠拂玄穹。

<!--more-->

### Java读取文件

对航班数据的读取处理，放在`flightData`类中，将需要导入数据库的数据创建为属性，读取和处理作为类方法

```java
class flightData {
    //公司、飞机名、型号、出发时间、始发站、到达时间、终点站、准点率、票价、折扣
	public String enterprise;
    public String planeName;
    public String planeType;
    public double startTime;
    public String startport;
    public double arriveTime;
    public String arriveport;
    public String onTime;
    public String price;
    public String sale;
    int minute0;
    int minute1;
    public int totalTime;
    public double realPrice;
    
    public void loadFile(){
        //导入读取文件
    }
    private void parseText(String linetext) throws Exception{
        //处理数据为指定的格式
    }
}
```

在之前学Java时，有学过I/O流操作，常见文件操作，基本思路通过流与文件就是建立连接，然后往流中进行读写操作。

- 获取文件句柄.`File filePath = new File("路径信息"); `此时相当于建立了连接
- 通过该连接获取文件信息，使用`new FileInputStream(filePath)`将文件信息读到内存，再使用对应的`InputStreamReader()`将字节流转换为字符流
- 使用`BufferReader`缓存流包装`InputStreamReader()`，减少开销、提高效率

```java
    int count = 0;    
	public void loadFile() {
        try {
            File filePath = new File("旅客系统txt\\北京到上海航班.txt");
            BufferedReader br = new BufferedReader(new InputStreamReader((new FileInputStream((filePath))),"utf-8"));
            String lineText;
            lineText = br.readLine();
            while (lineText != null) {
                parseText(lineText);//航班数据的处理函数
                lineText = br.readLine();
            }
            System.out.println("解析"+count+"条记录完成");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
```

由于拿到的航班数据是txt文件，形式如下：

![](https://ae01.alicdn.com/kf/Hf2ef2e460cae4bd4b1bd59d3275e5a2dG.jpg)

### 处理数据

在` parseText`函数中，使用`spilt`分割每一行的得到的数据，然后在得到的数组中选择需要的

- 并且后面要对出行时间做判断，选择我查询时间之后的出发时间才是有效的，因此时间不能存储为字符串格式
- 直接采用数组会出现越界情况，应采用`ArrayList`的形式

```java
    private void parseText(String linetext) throws Exception {
            ArrayList<String>  fileText=new ArrayList<String>();
        	//按一个或多个空格、制表符来分割
            String [] a=linetext.split("\\s+");
        	
            for(int i=0;i<a.length;i++){
                fileText.add(a[i]);
            }
            enterprise = fileText.get(0);
            planeName = fileText.get(1);
            planeType = fileText.get(2);
            startport = fileText.get(4);
            arriveport =fileText.get(6);
            onTime = fileText.get(8);
            price = fileText.get(9);
            sale = fileText.get(10);

            count++;
    }
```

#### 处理时间

主要是处理时间格式，并计算一次航班的总时长

- `ArrayList`中的时间数据是`String`类型的，如`15:35`，要将其转换为数字，并且会有跨转中的情况，比如23:00-01:15在txt文档中是`23:00   01:15+1天`表示，因此还要考虑这种情况

- 总时间

- 时间处理可以使用`Pattern和Matcher`处理，也可以继续逐个字符判断

  ```java
  //                String regEx="[^0-9]";
  //                Pattern p=Pattern.compile(regEx);
  //                Matcher m=p.matcher(timeJudge);
  //                System.out.println(m.replaceAll("").trim());
  ```

- 一开始我是想采用对ArrayList的元素继续spilt再合并元素转数字，该方法会报错数组越界，因此将取数方式全部改为逐个判断字符

出发时间：

```java
			//取出发时间的数,出发时间不存在+1，
			//startTimeArr = fileText.get(3).split("\\:");
			//startTime = Double.parseDouble(startTimeArr[0]+"."+startTimeArr[1]);
            String startTimeTmp = fileText.get(3).trim();
            String str1 = "";
            if(startTimeTmp!=null&&!"".equals(startTimeTmp)){
                for(int i=0;i< startTimeTmp.length();i++){
                    if(startTimeTmp.charAt(i)>=48&&startTimeTmp.charAt(i)<=57){
                        str1 += startTimeTmp.charAt(i);
                    }
                }
            }
            startTime = Double.parseDouble(str1);
            minute0=Integer.parseInt(str1);
            startTime = startTime*0.01;
            DecimalFormat df=new DecimalFormat("0.00");
            String str=df.format(startTime);
            startTime =Double.parseDouble(str);
            System.out.println("出发时间字符串: "+str1+" 出发时间数字： "+startTime);
```

对于到达时间，由于有`+1天`的特殊情况，因此要先判断处理

到达时间：

```Java
            //到达时间可能会隔一天，先判断，再取数
            String abnTime=fileText.get(5);
            if(abnTime.length()>5){//转中情况的取数
                abnTime=abnTime.trim();
                String str2="";
                if(abnTime!=null&&!"".equals(abnTime)){
                    for(int i=0;i< abnTime.length();i++){
                        if(abnTime.charAt(i)>=48&&abnTime.charAt(i)<=57){
                            str2+=abnTime.charAt(i);
                        }
                    }
                }
                System.out.println(str2);
                //转中情况相当于＋24小时，00：15就是24：15
                arriveTime = Double.parseDouble(str2);
                minute1=Integer.parseInt(str2);
                arriveTime = arriveTime*0.001;
                arriveTime = arriveTime+24;
                DecimalFormat df1=new DecimalFormat("0.00");
                String strTmp=df1.format(arriveTime);
                arriveTime =Double.parseDouble(strTmp);
                System.out.println("到达时间字符串: "+str2+" 到达时间数字： "+arriveTime);

            } else{//非转中的取数
				//arriveTimeArr = fileText.get(5).split("\\:");
				//arriveTime = Double.parseDouble(arriveTimeArr[0]+"."+arriveTimeArr[1]);
                String arriveTimeTmp = fileText.get(5);
                arriveTimeTmp=arriveTimeTmp.trim();
                String str3 = "";
                if(arriveTimeTmp!=null&&!"".equals(arriveTimeTmp)){
                    for(int i=0;i< arriveTimeTmp.length();i++){
                        if(arriveTimeTmp.charAt(i)>=48&&arriveTimeTmp.charAt(i)<=57){
                            str3 += arriveTimeTmp.charAt(i);
                        }
                    }
                }
                arriveTime = Double.parseDouble(str3);
                minute1=Integer.parseInt(str3);
                arriveTime = arriveTime*0.01;
                DecimalFormat df1=new DecimalFormat("0.00");
                String strTmp=df1.format(arriveTime);
                arriveTime =Double.parseDouble(strTmp);
                System.out.println("到达时间字符串: "+str3+" 到达时间数字： "+arriveTime);
            }
```

对得到的数据，再计算总时间，直接按分钟计算存储

其中`minut0 minute1`分别是出发、到达的时间相对于00:00的分钟数，在上面的时间处理中直接`Integer.parseInt(str)`得到，如果采用对得到的double时间乘100再转换会出现精度缺失问题

```java
            //计算总时长
            System.out.println("minute0:"+minute0);
            int time0=(minute0/100)* 60 + minute0%100 ;
            System.out.println("minute1:"+minute1);
            int time1=(minute1/100)* 60 + minute1%100 ;
            totalTime = time1-time0;
            System.out.println("总时长： "+totalTime);
```



#### 处理价格

之前`sale = fileText.get(10);`拿到的折扣，有两种情况

1. 有打折的情况：`sale="经济舱9.9折";`
2. 无打折的情况：`sale="经济舱全价";`

先通过contains()函数来判别，进行对应操作

1. 打折情况：参照处理时间方式，拿到折扣数额，乘以票价即为实际价格
2. 不打折情况：直接将票价作为实际价格

价格都是`￥1480起`的形式，因此也要处理一下拿到数字

```java
            //拿价格*优惠=实际价格
            if(sale.contains("折")){
//                System.out.println("打折");
                price=price.trim();
                String strPrice = "";
                if(price!=null&&!"".equals(price)){
                    for(int i=0;i< price.length();i++){
                        if(price.charAt(i)>=48&&price.charAt(i)<=57){
                            strPrice += price.charAt(i);
                        }
                    }
                }
                sale=sale.trim();
                String strSale="";
                if(sale!=null&&!"".equals(sale)){
                    for(int i=0;i< sale.length();i++){
                        if(sale.charAt(i)>=48&&sale.charAt(i)<=57){
                            strSale += sale.charAt(i);
                        }
                    }
                }
                System.out.println("原价字符："+strPrice+"折扣字符："+strSale);
                realPrice = Double.parseDouble(strPrice) * (Double.parseDouble(strSale)*0.01);
                DecimalFormat dfPrice=new DecimalFormat("0.00");
                String strTmp=dfPrice.format(realPrice);
                realPrice =Double.parseDouble(strTmp);
                System.out.println("打折后价格："+realPrice);
            }else if(sale.contains("全价")){
//                System.out.println("全价");
                price=price.trim();
                String strPrice = "";
                if(price!=null&&!"".equals(price)){
                    for(int i=0;i< price.length();i++){
                        if(price.charAt(i)>=48&&price.charAt(i)<=57){
                            strPrice += price.charAt(i);
                        }
                    }
                }
                System.out.println("不打折！");
                realPrice = Double.parseDouble(strPrice);
                System.out.println("不打折价格："+realPrice);
            }
```

最后在主函数中调用flightData创建类对象，即可得到指定数据

```java
public class flight{
    public static void main(String[] args){
        try{
            flightData data = new flightData();
            data.loadFile();
        }catch (Exception e){
            e.printStackTrace();
        }
    }
}
```