---
title: Mybatis-Plus 自定义批处理操作
date: 2022-05-11 17:35:28
tags: Mybatis
categories: Mybatis
---
### 一、背景

项目中有个对接同步数据的需求，大致流程是对接其他平台后把需要的数据在代码中处理保存到本项目对应库中，ORM 框架产线统一用的 Mybatis-Plus，列表批量数据保存调用的是 `saveOrUpdateBatch()` 方法，但是在同步开始结束 `log.info` 打日志发现数据量不大但是耗时比预期的长

进入 MP 的源码中查看该方法，发现它的批量操作并不是真正的批量操作，默认的 `saveOrUpdateBatch()` 调用的是 SqlHelper 的 `executeBatch()`，遍历创建 sql 语句，然后按照一个 batchSize 开启一次事务提交，所以控制台输出的也是一条一条的 insert 语句



### 二、改进方法

#### 1、用 Mybatis 写 xml

直接通过 Mybatis 写 xml，利用 `<foreach> </foreach>` 标签遍历待操作数据

具体操作参照官方文档：https://mybatis.org/mybatis-3/zh/dynamic-sql.html#foreach



#### 2、改进 MP

在 Mybatis-Plus 中新增有一个 sql 注入器，可以通过 sql 注入器实现批量新增删除等操作，一次注入随时可用，使用上比较方便，唯一的缺点就是在项目启动时会进行 sql 注入器注册



### 三、步骤

#### 1、自定义 BaseMapper

创建一个自定义的 BatchMapper（名称自定义）继承 BaseMapper，在 BatchMapper 中添加自定义的方法名称

```java
public interface BatchMapper<T> extends BaseMapper<T> {

    /**
     * 自定义的批量插入功能：mysqlSaveOrUpdateBatch
     * @param list 待批量插入的数据，要自动填充 @Param(xxx) xxx必须是 list/collection/array 三者之一
     * @return 操作条数
     */
    int mysqlSaveOrUpdateBatch(@Param("list")List<T> list);
}
```



#### 2、方法实现

自定义方法的具体实现，逻辑上就是将待插入的数据拼接成 VALUES 多个参数形式

```java
@Slf4j
public class saveOrUpdateBatchMethod extends AbstractMethod {

    @Override
    public MappedStatement injectMappedStatement(Class<?> mapperClass, Class<?> modelClass, TableInfo tableInfo) {
        final String sql = "<script>insert into %s %s values %s ON DUPLICATE KEY UPDATE %s</script>";
        String tableName = tableInfo.getTableName();
        String fieldSql = prepareFieldSql(tableInfo);
        String modelValueSql = prepareModelValueSql(tableInfo);
        String duplicateKeySql = prepareDuplicateKeySql(tableInfo);
        String sqlResult = String.format(sql, tableName, fieldSql, modelValueSql, duplicateKeySql);
        SqlSource sqlSource = languageDriver.createSqlSource(configuration, sqlResult, modelClass);
        return this.addInsertMappedStatement(mapperClass, modelClass, "mysqlSaveOrUpdateBatch", sqlSource, new NoKeyGenerator(), null, null);// 这里的名称要和Mapper中定义的一致
    }

    // 字段
    private String prepareFieldSql(TableInfo tableInfo) {
        StringBuilder fieldSql = new StringBuilder().append("(");
        fieldSql.append(tableInfo.getKeyColumn()).append(",");
        String columnStr = tableInfo.getFieldList().stream().map(TableFieldInfo::getColumn).collect(Collectors.joining(","));
        fieldSql.append(columnStr).append(")");
        return fieldSql.toString();
    }

    // 值
    private String prepareModelValueSql(TableInfo tableInfo) {
        StringBuilder valueSql = new StringBuilder();
        valueSql.append("<foreach collection=\"list\" item=\"item\" index=\"index\" open=\"(\" separator=\"),(\" close=\")\">");
        if (!StringUtils.isEmpty(tableInfo.getKeyProperty())) {
            valueSql.append("#{item.").append(tableInfo.getKeyProperty()).append("},");
        }
        tableInfo.getFieldList().forEach(x -> valueSql.append("#{item.").append(x.getProperty()).append("},"));
        valueSql.delete(valueSql.length() - 1, valueSql.length());
        valueSql.append("</foreach>");
        return valueSql.toString();
    }

    // 已存在数据执行更新
    private String prepareDuplicateKeySql(TableInfo tableInfo) {
        StringBuilder duplicateKeySql = new StringBuilder();
        if (!StringUtils.isEmpty(tableInfo.getKeyColumn())) {
            duplicateKeySql.append(tableInfo.getKeyColumn()).append("=values(").append(tableInfo.getKeyColumn()).append("),");
        }

        tableInfo.getFieldList().forEach(x -> {
            duplicateKeySql.append(x.getColumn())
                    .append("=values(")
                    .append(x.getColumn())
                    .append("),");
        });
        duplicateKeySql.delete(duplicateKeySql.length() - 1, duplicateKeySql.length());
        return duplicateKeySql.toString();
    }
}
```



#### 3、sql 注入器

自定义 sql 注入器继承默认的注入器，补充父类的方法，将刚刚自定义的实现方法添加到 methodList

```java
public class CustomizedSqlInjector extends DefaultSqlInjector {

    /**
     * 获取super的methodList，添加自定义的method
     */
    @Override
    public List<AbstractMethod> getMethodList(Class<?> mapperClass, TableInfo tableInfo) {
        List<AbstractMethod> methodList = super.getMethodList(mapperClass, tableInfo);
        methodList.add(new saveOrUpdateBatchMethod());
        return methodList;
    }
}
```



#### 4、补充配置

一般用到 Mybatis-Plus 时都会创建一个 Config 配置类，添加分页插件等基础配置，在对应配置类中补充注入

```java
@Bean
public GlobalConfig globalConfig(){
    GlobalConfig globalConfig = new GlobalConfig();
    return globalConfig;
}

@Bean
public CustomizedSqlInjector customizedSqlInjector() {
    return new CustomizedSqlInjector();
}
```



#### 5、开启批操作

在项目配置的 MySQL 连接后面添加参数

- `allowMultiQueries=true`：允许在 SQL 后添加分号，实现多语句在一个请求中执行，实现批处理

- `rewriteBatchedStatements=true`：可以理解为开启后会优化 JDBC 的解析 SQL 操作，原先单条单条执行的会合并操作。对于删除、更新会添加分号一次请求多个执行，对于插入会优化为 `VALUES (...),(...),(...);`



#### 6、修改并调用

修改待操作的 mapper，由原先的继承 BaseMapper 改为继承 BatchMapper

```java
@Repository
public interface VehicleMapper extends BatchMapper<VehicleCoordDO> {

}
```

修改调用代码，初始方法 `VehicleService.saveOrUpdate(list)` 调整为 `VehicleMapper.mysqlSaveOrUpdateBatch(list)`，通过日志查看执行的耗时是否优化了

自带的 `saveOrUpdateBatch()` 方法执行，批量提交，但是批次内还是单条执行，耗时4s

![image-20230511163740993](https://jihulab.com/Leslie61/imagelake/-/raw/main/pictures/2023/05/image-20230511163740993.png)

使用自定义的批量操作，形式和 `INSERT xxx VALUES (xxx),(xxx)` 一致，一条语句执行多个参数

![image-20230511164158482](https://jihulab.com/Leslie61/imagelake/-/raw/main/pictures/2023/05/image-20230511164158482.png)



### 四、说明

1、Mybatis-Plus 其实已经提供了一个拓展，里面的 `InsertBatchSomeColumn` 提供了批量插入的方法

<img src="https://jihulab.com/Leslie61/imagelake/-/raw/main/pictures/2023/05/image-20230511170953276.png" alt="image-20230511170953276" style="zoom:80%;" />

使用步骤和上面类似

- 自定义一个注入器，在 methodList 中添加 `methodList.add(new InsertBatchSomeColumn());`
- 在配置类中注入
- 修改Mapper的继承，调用



2、对于自定义 saveBatch、updateBatch，操作步骤和上面一样，只是在具体实现部分有所不同，例如批量插入只需要 prepareFieldSql、prepareModelValueSql 这两部分的逻辑，sql 语句拼接也不需要 `ON DUPLICATE KEY UPDATE %s` 部分

>  其实上面的 批量插入或更新就是批量插入的特殊情况，即 MySQL 插入时指定策略为重复 key 更新

具体的操作逻辑网上很多，可以搜索后套用一下



2、Mybatis-Plus 的 saveBatch、saveOrUpdateBatch 操作上已经进行了优化，一般情况是够用的。要注意 saveOrUpdate、saveOrUpdateBatch 方法，判断是 save 还是 update 的逻辑要用到表主键信息，表中有列名为 id 的、或者在实体类对于主键字段上添加了 @TableId 注解，才能被解析，不然会报错找不到

