---
title: MyBatis-plus基本使用
tags: [MyBatis-plus, Java]
categories: Java
date: 2021-01-27 15:14:29



---



![](https://i.loli.net/2021/01/27/eCxOMS8yGimaYHJ.png)



<!--more-->

前言：MyBatis在持久层框架中还是比较火的，一般项目都是基于SSM。虽然MyBatis可以直接在xml文件中通过SQL语句操作数据库，很是灵活。但正因为其操作都要通过SQL语句进行，就必须写大量的xml文件，很是麻烦。MyBatis-plus作为MyBatis的增强就很好的解决了这个问题。

# 简介

Mybatis-Plus（简称MP）是一个 Mybatis 的增强工具，按照其[官方](https://links.jianshu.com/go?to=http%3A%2F%2Fmp.baomidou.com%2F%23%2F)的定义MP在 Mybatis 的基础上只做增强不做改变，为简化开发、提高效率而生。它的增强方式是依赖于它已经封装好了大量的CRUD方法，一些简单的SQL语句不需要再写xml文件，直接调用这些方法就行，类似于JPA。

## 依赖

```xml
<dependency>
	<groupId>com.baomidou</groupId>
	<artifactId>mybatis-plus-boot-starter</artifactId>
    <version>3.4.2</version>
</dependency>
<!--mysql-->
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
</dependency>

<!--Velocity 模板引擎，mybatis plus代码生成器需要-->
<dependency>
    <groupId>org.apache.velocity</groupId>
    <artifactId>velocity-engine-core</artifactId>
</dependency>
```

## 配置

**Spring Boot工程**

```java
@SpringBootApplication
@MapperScan("项目mapper文件所在位置")
public class Application {

    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }

}
```

**Spring工程**

```xml
<!--配置MapperScan-->
<bean class="org.mybatis.spring.mapper.MapperScannerConfigurer">
    <property name="basePackage" value="com.baomidou.mybatisplus.samples.quickstart.mapper"/>
</bean>

<!--调整 SqlSessionFactory 为 MyBatis-Plus 的 SqlSessionFactory-->
<bean id="sqlSessionFactory" class="com.baomidou.mybatisplus.extension.spring.MybatisSqlSessionFactoryBean">
    <property name="dataSource" ref="dataSource"/>
</bean>
```



## 注解

### **表名注解：**`@TableName`

|       属性       |   类型   | 默认值 |                             描述                             |
| :--------------: | :------: | :----: | :----------------------------------------------------------: |
|      value       |  String  |   ""   |                             表名                             |
|      schema      |  String  |   ""   |                            schema                            |
| keepGlobalPrefix | boolean  | false  | 是否保持使用全局的 tablePrefix 的值(如果设置了全局 tablePrefix 且自行设置了 value 的值) |
|    resultMap     |  String  |   ""   |                    xml 中 resultMap 的 id                    |
|  autoResultMap   | boolean  | false  | 是否自动构建 resultMap 并使用(如果设置 resultMap 则不会进行 resultMap 的自动构建并注入) |
| excludeProperty  | String[] |   {}   |                       需要排除的属性名                       |

### **主键注解：**`@TableId`

| 属性  |  类型  |    默认值     |    描述    |
| :---: | :----: | :-----------: | :--------: |
| value | String |     `""`      | 主键字段名 |
| type  |  Enum  | `IdType.NONE` |  主键类型  |

IdType:

| 值          | 描述                                                         |
| ----------- | ------------------------------------------------------------ |
| AUTO        | 数据库ID自增                                                 |
| NONE        | 无状态，该类型为未设置主键类型                               |
| INPUT       | `insert`前自行进行`set`赋值                                  |
| ASSIGN_ID   | 分配ID(主键类型为Number(Long和Integer)或String)，使用接口`IdentifierGenerator`的`nextId`方法(默认实现类为`DefaultIdentifierGenerator`雪花算法) |
| ASSIGN_UUID | 分配UUID，逐渐类型为String，使用接口`IdentifierGenerator`的`nextUUID`方法 |

### **字段（非主键）注解：**`@TableField`

|       属性       |             类型             |          默认值          |                             描述                             |
| :--------------: | :--------------------------: | :----------------------: | :----------------------------------------------------------: |
|      value       |            String            |            ""            |                         数据库字段名                         |
|        el        |            String            |            ""            | 映射为原生 `#{ ... }` 逻辑,相当于写在 xml 里的 `#{ ... }` 部分 |
|      exist       |           boolean            |           true           |                      是否为数据库表字段                      |
|    condition     |            String            |            ""            | {% raw %}字段 `where` 实体查询比较条件,有值设置则按设置的值为准,没有则为默认全局的 `%s=#{%s}`{% endraw %} |
|      update      |            String            |            ""            | 字段 `update set` 部分注入, 例如：update="%s+1"：表示更新时会set version=version+1(该属性优先级高于 `el` 属性) |
|  insertStrategy  |             Enum             |         DEFAULT          | 举例：NOT_NULL: `insert into table_a(<if test="columnProperty != null">column</if>) values (<if test="columnProperty != null">#{columnProperty}</if>)` |
|  updateStrategy  |             Enum             |         DEFAULT          | 举例：IGNORED: `update table_a set column=#{columnProperty}` |
|  whereStrategy   |             Enum             |         DEFAULT          | 举例：NOT_EMPTY: `where <if test="columnProperty != null and columnProperty!=''">column=#{columnProperty}</if>` |
|       fill       |             Enum             |    FieldFill.DEFAULT     |                       字段自动填充策略                       |
|      select      |           boolean            |           true           |                     是否进行 select 查询                     |
| keepGlobalFormat |           boolean            |          false           |              是否保持使用全局的 format 进行处理              |
|     jdbcType     |           JdbcType           |    JdbcType.UNDEFINED    |           JDBC类型 (该默认值不代表会按照该值生效)            |
|   typeHandler    | Class<? extends TypeHandler> | UnknownTypeHandler.class |          类型处理器 (该默认值不代表会按照该值生效)           |
|   numericScale   |            String            |            ""            |                    指定小数点后保留的位数                    |

**FieldStrategy**

|    值     |                           描述                            |
| :-------: | :-------------------------------------------------------: |
|  IGNORED  |                         忽略判断                          |
| NOT_NULL  |                        非NULL判断                         |
| NOT_EMPTY | 非空判断(只对字符串类型字段,其他类型字段依然为非NULL判断) |
|  DEFAULT  |                       追随全局配置                        |

**FieldFill**

|      值       |         描述         |
| :-----------: | :------------------: |
|    DEFAULT    |      默认不处理      |
|    INSERT     |    插入时填充字段    |
|    UPDATE     |    更新时填充字段    |
| INSERT_UPDATE | 插入和更新时填充字段 |

### **其余注解：**

```java
@Version
描述：乐观锁注解、标记@Version在字段上

@EnumValue
描述：枚举类注解（注解在枚举字段上）

@TableLogic
描述：表字段逻辑处理注解（逻辑删除）
value	String 	""	逻辑未删除值
delval	String	""	逻辑删除值

@KeySequence
描述：序列主键策略
value	String	""
clazz	Class	Long.class	id的类型，可以指定为String.class
```



# 核心功能

## 代码生成器

AutoGenerator 是 MyBatis-Plus 的代码生成器，通过 AutoGenerator 可以快速生成 Entity、Mapper、Mapper XML、Service、Controller 等各个模块的代码，极大的提升了开发效率。

```java
import com.baomidou.mybatisplus.annotation.DbType;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.generator.AutoGenerator;
import com.baomidou.mybatisplus.generator.config.DataSourceConfig;
import com.baomidou.mybatisplus.generator.config.GlobalConfig;
import com.baomidou.mybatisplus.generator.config.PackageConfig;
import com.baomidou.mybatisplus.generator.config.StrategyConfig;
import com.baomidou.mybatisplus.generator.config.rules.DateType;
import com.baomidou.mybatisplus.generator.config.rules.NamingStrategy;
import org.junit.Test;

/**
* MyBatis-plus 代码生成器
*/
public class CodeGenerator {

    @Test
    public void run() {

        // 1、创建代码生成器
        AutoGenerator mpg = new AutoGenerator();

        // 2、全局配置
        GlobalConfig gc = new GlobalConfig();
        String projectPath = System.getProperty("user.dir");
        gc.setOutputDir(projectPath + "/src/main/java"); //设置输出的路径
        gc.setAuthor("hugh"); 
        gc.setOpen(false); //生成后是否打开资源管理器
        gc.setFileOverride(false); //重新生成时文件是否覆盖，建议不要覆盖
        gc.setServiceName("%sService");	//去掉Service接口的首字母I
        gc.setIdType(IdType.ID_WORKER_STR); //主键策略 ID_WORKER_STR表示主键是字符串, ID_WORKER表示是long类型
        gc.setDateType(DateType.ONLY_DATE); //定义生成的实体类中日期类型
        gc.setSwagger2(true); //开启Swagger2模式

        mpg.setGlobalConfig(gc);

        // 3、数据源配置
        DataSourceConfig dsc = new DataSourceConfig();
        dsc.setUrl("jdbc:mysql://localhost:3306/schoolonline?useUnicode=true&characterEncoding=utf8&autoReconnect=true&useSSL=false&serverTimezone=UTC");
        dsc.setDriverName("com.mysql.cj.jdbc.Driver");
        dsc.setUsername("root");
        dsc.setPassword("root");
        dsc.setDbType(DbType.MYSQL); // 数据库格式
        mpg.setDataSource(dsc);

        // 4、包配置
        PackageConfig pc = new PackageConfig();
        pc.setParent("com.hugh");
        pc.setModuleName("edu"); //模块名
        pc.setController("com.hugh.edu.controller");
        pc.setEntity("com.hugh.edu.entity");
        pc.setService("com.hugh.edu.service");
        pc.setMapper("com.hugh.edu.mapper");
        mpg.setPackageInfo(pc);

        // 5、策略配置
        StrategyConfig strategy = new StrategyConfig();
        strategy.setInclude("edu_chapter"); //对应的表的名称
        // strategy.setInclude("","");  多张表时使用逗号分隔
        strategy.setNaming(NamingStrategy.underline_to_camel);//数据库表映射到实体的命名策略
        strategy.setTablePrefix(pc.getModuleName() + "_"); //生成实体时去掉表前缀
        // strategy.setTablePrefix("t" + "_");  去除下划线前的字母t和下划线

        strategy.setColumnNaming(NamingStrategy.underline_to_camel);//数据库表字段映射到实体的命名策略
        strategy.setEntityLombokModel(true); // lombok 模型 @Accessors(chain = true) 开启setter链式操作

        strategy.setRestControllerStyle(true); //restful api风格控制器
        strategy.setControllerMappingHyphenStyle(true); //url中驼峰转连字符
        mpg.setStrategy(strategy);

        // 6、执行
        mpg.execute();
    }
}
```

### 添加依赖

MyBatis-Plus 从 `3.0.3` 之后移除了代码生成器与模板引擎的默认依赖，需要手动添加相关依赖：

- 添加 代码生成器 依赖

  ```xml
  <dependency>
      <groupId>com.baomidou</groupId>
      <artifactId>mybatis-plus-generator</artifactId>
      <version>3.4.2</version>
  </dependency>
  ```

- 添加 模板引擎 依赖，MyBatis-Plus 支持 Velocity（默认）、Freemarker、Beetl，用户可以选择自己熟悉的模板引擎，也可以采用自定义模板引擎。

  Velocity（默认）：

  ```xml
  <dependency>
      <groupId>org.apache.velocity</groupId>
      <artifactId>velocity-engine-core</artifactId>
      <version>2.2</version>
  </dependency>
  ```

  Freemarker：

  ```xml
  <dependency>
      <groupId>org.freemarker</groupId>
      <artifactId>freemarker</artifactId>
      <version>2.3.30</version>
  </dependency>
  ```

  Beetl：

  ```xml
  <dependency>
      <groupId>com.ibeetl</groupId>
      <artifactId>beetl</artifactId>
      <version>3.3.2.RELEASE</version>
  </dependency>
  ```

  **注意！**如果选择了非默认引擎，需要在 AutoGenerator 中 设置模板引擎。

  ```java
  AutoGenerator generator = new AutoGenerator();
  
  // set freemarker engine
  generator.setTemplateEngine(new FreemarkerTemplateEngine());
  
  // set beetl engine
  generator.setTemplateEngine(new BeetlTemplateEngine());
  
  // set custom engine (reference class is your custom engine class)
  generator.setTemplateEngine(new CustomTemplateEngine());
  
  // other config
  ...
  ```

> 自定义模板引擎：继承类`com.baomidou.mybatisplus.generator.engine.AbstractTemplateEngine`

更多自定义详情可以查看[官方文档](https://mp.baomidou.com/guide/generator.html#%E8%87%AA%E5%AE%9A%E4%B9%89%E6%A8%A1%E6%9D%BF%E5%BC%95%E6%93%8E)



## CRUD接口

### Service CRUD 接口

#### Save

```java
// 插入一条记录（选择字段，策略插入）
boolean save(T entity);
// 插入（批量）
boolean saveBatch(Collection<T> entityList);	//Collection<T>	entityList	实体对象集合
// 插入（批量）
boolean saveBatch(Collection<T> entityList, int batchSize);		//int	batchSize	插入批次数量
```

#### SaveOrUpdate

```java
// @TableId 注解锁对应的值在表中存在则更新记录，否则插入一条记录
boolean saveOrUpdate(T entity);
// 根据updateWrapper尝试更新，否继续执行saveOrUpdate(T)方法
boolean saveOrUpdate(T entity, Wrapper<T> updateWrapper);
// 批量修改插入
boolean saveOrUpdateBatch(Collection<T> entityList);
// 批量修改插入
boolean saveOrUpdateBatch(Collection<T> entityList, int batchSize);
```

#### Remove

```java
// 根据 entity 条件，删除记录
boolean remove(Wrapper<T> queryWrapper);
// 根据 ID 删除
boolean removeById(Serializable id);
// 根据 columnMap 条件，删除记录
boolean removeByMap(Map<String, Object> columnMap);		//Map<String, Object>	columnMap	表字段 map 对象
// 删除（根据ID 批量删除）
boolean removeByIds(Collection<? extends Serializable> idList);		
```

#### Update

```java
// 根据 UpdateWrapper 条件，更新记录 需要设置sqlset
boolean update(Wrapper<T> updateWrapper);
// 根据 whereEntity 条件，更新记录
boolean update(T entity, Wrapper<T> updateWrapper);
// 根据 ID 选择修改
boolean updateById(T entity);
// 根据ID 批量更新
boolean updateBatchById(Collection<T> entityList);
// 根据ID 批量更新
boolean updateBatchById(Collection<T> entityList, int batchSize);
```

#### Get

```java
// 根据 ID 查询
T getById(Serializable id);
// 根据 Wrapper，查询一条记录。结果集，如果是多个会抛出异常，随机取一条加上限制条件 wrapper.last("LIMIT 1")
T getOne(Wrapper<T> queryWrapper);
// 根据 Wrapper，查询一条记录
T getOne(Wrapper<T> queryWrapper, boolean throwEx);
// 根据 Wrapper，查询一条记录
Map<String, Object> getMap(Wrapper<T> queryWrapper);
// 根据 Wrapper，查询一条记录
<V> V getObj(Wrapper<T> queryWrapper, Function<? super Object, V> mapper);	//Function<? super Object, V>	mapper	转换函数
```

#### List

```java
// 查询所有
List<T> list();
// 查询列表
List<T> list(Wrapper<T> queryWrapper);
// 查询（根据ID 批量查询）
Collection<T> listByIds(Collection<? extends Serializable> idList);
// 查询（根据 columnMap 条件）
Collection<T> listByMap(Map<String, Object> columnMap);
// 查询所有列表
List<Map<String, Object>> listMaps();
// 查询列表
List<Map<String, Object>> listMaps(Wrapper<T> queryWrapper);
// 查询全部记录
List<Object> listObjs();
// 查询全部记录
<V> List<V> listObjs(Function<? super Object, V> mapper);
// 根据 Wrapper 条件，查询全部记录
List<Object> listObjs(Wrapper<T> queryWrapper);
// 根据 Wrapper 条件，查询全部记录
<V> List<V> listObjs(Wrapper<T> queryWrapper, Function<? super Object, V> mapper);
```

#### Page

```java
// 无条件分页查询
IPage<T> page(IPage<T> page);
// 条件分页查询
IPage<T> page(IPage<T> page, Wrapper<T> queryWrapper);
// 无条件分页查询
IPage<Map<String, Object>> pageMaps(IPage<T> page);
// 条件分页查询
IPage<Map<String, Object>> pageMaps(IPage<T> page, Wrapper<T> queryWrapper);
```

#### Count

```java
// 查询总记录数
int count();
// 根据 Wrapper 条件，查询总记录数
int count(Wrapper<T> queryWrapper);
```

#### Chain

> Query

```java
// 链式查询 
QueryChainWrapper<T> query();
// 链式查询 lambda 式
LambdaQueryChainWrapper<T> lambdaQuery();

// 示例：
query().eq("column", value).one();
lambdaQuery().eq(Entity::getId, value).list();
```

> Update

```java
// 链式更新 
UpdateChainWrapper<T> update();
// 链式更新 lambda 式。
LambdaUpdateChainWrapper<T> lambdaUpdate();

// 示例：
update().eq("column", value).remove();
lambdaUpdate().eq(Entity::getId, value).update(entity);
```



### Mapper CRUD接口

#### Insert

```java
// 插入一条记录
int insert(T entity);
```

#### Delete

```java
// 根据 entity 条件，删除记录
int delete(@Param(Constants.WRAPPER) Wrapper<T> wrapper);
// 删除（根据ID 批量删除）
int deleteBatchIds(@Param(Constants.COLLECTION) Collection<? extends Serializable> idList);
// 根据 ID 删除
int deleteById(Serializable id);
// 根据 columnMap 条件，删除记录
int deleteByMap(@Param(Constants.COLUMN_MAP) Map<String, Object> columnMap);
```

#### Update 

```java
// 根据 whereEntity 条件，更新记录
int update(@Param(Constants.ENTITY) T entity, @Param(Constants.WRAPPER) Wrapper<T> updateWrapper);
// 根据 ID 修改
int updateById(@Param(Constants.ENTITY) T entity);
```

#### select

```java
// 根据 ID 查询
T selectById(Serializable id);
// 根据 entity 条件，查询一条记录
T selectOne(@Param(Constants.WRAPPER) Wrapper<T> queryWrapper);

// 查询（根据ID 批量查询）
List<T> selectBatchIds(@Param(Constants.COLLECTION) Collection<? extends Serializable> idList);
// 根据 entity 条件，查询全部记录
List<T> selectList(@Param(Constants.WRAPPER) Wrapper<T> queryWrapper);
// 查询（根据 columnMap 条件）
List<T> selectByMap(@Param(Constants.COLUMN_MAP) Map<String, Object> columnMap);
// 根据 Wrapper 条件，查询全部记录
List<Map<String, Object>> selectMaps(@Param(Constants.WRAPPER) Wrapper<T> queryWrapper);
// 根据 Wrapper 条件，查询全部记录。注意： 只返回第一个字段的值
List<Object> selectObjs(@Param(Constants.WRAPPER) Wrapper<T> queryWrapper);

// 根据 entity 条件，查询全部记录（并翻页）
IPage<T> selectPage(IPage<T> page, @Param(Constants.WRAPPER) Wrapper<T> queryWrapper);
// 根据 Wrapper 条件，查询全部记录（并翻页）
IPage<Map<String, Object>> selectMapsPage(IPage<T> page, @Param(Constants.WRAPPER) Wrapper<T> queryWrapper);
// 根据 Wrapper 条件，查询总记录数
Integer selectCount(@Param(Constants.WRAPPER) Wrapper<T> queryWrapper);
```

## 条件构造器

### AbstractWrapper

>**说明：**`QueryWrapper(LambdaQueryWrapper)` 和 `UpdateWrapper(LambdaUpdateWrapper)` 的父类。用于生成 sql 的 where 条件。entity 属性也用于生成 sql 的 where 条件，**注意：** entity 生成的 where 条件与 使用各个 api 生成的 where 条件**没有任何关联行为**

```java
/** allEq 全部等于或为null */
allEq(Map<R, V> params)
allEq(Map<R, V> params, boolean null2IsNull) 
allEq(boolean condition, Map<R, V> params, boolean null2IsNull)	
    //null2IsNull : 为true则在map的value为null时调用 isNull 方法,为false时则忽略value为null的参数
// 示例：
allEq({id:1,name:"老王",age:null})	--->id = 1 and name = '老王' and age is null
allEq({id:1,name:"老王",age:null}, false)		--->id = 1 and name = '老王'
    
/** eq 等于 */
eq(R column, Object val)
eq(boolean condition, R column, Object val)
    
/** ne 不等于 */
ne(R column, Object val)
ne(boolean condition, R column, Object val)

/** gt 大于 */
gt(R column, Object val)
gt(boolean condition, R column, Object val)

/** ge 大于等于 */
ge(R column, Object val)
ge(boolean condition, R column, Object val)

/** lt 小于 */
lt(R column, Object val)
lt(boolean condition, R column, Object val)

/** le 小于等于*/
le(R column, Object val)
le(boolean condition, R column, Object val)

/** between 在...之间 */
between(R column, Object val1, Object val2)
between(boolean condition, R column, Object val1, Object val2)

/** notBetween 不在...之间 */
notBetween(R column, Object val1, Object val2)
notBetween(boolean condition, R column, Object val1, Object val2)

/** like 模糊查询 */
like(R column, Object val)
like(boolean condition, R column, Object val)

/** notLike */
notLike(R column, Object val)
notLike(boolean condition, R column, Object val)

/** likeLeft */
likeLeft(R column, Object val)
likeLeft(boolean condition, R column, Object val)

/** likeRight */
likeRight(R column, Object val)
likeRight(boolean condition, R column, Object val)

/** isNull */
isNull(R column)
isNull(boolean condition, R column)

/** isNotNull */
isNotNull(R column)
isNotNull(boolean condition, R column)

/** in */
in(R column, Collection<?> value)
in(boolean condition, R column, Collection<?> value)
in(R column, Object... values)
in(boolean condition, R column, Object... values)
// 示例：
in("age",{1,2,3})	---> age in (1,2,3)
in("age", 1, 2, 3)	---> age in (1,2,3)

/** notIn */
notIn(R column, Collection<?> value)
notIn(boolean condition, R column, Collection<?> value)
notIn(R column, Object... values)
notIn(boolean condition, R column, Object... values)

/** inSql */
inSql(R column, String inValue)
inSql(boolean condition, R column, String inValue)
// 示例：
inSql("age", "1,2,3,4,5,6")		--->age in (1,2,3,4,5,6)
inSql("id", "select id from table where id < 3")	--->id in (select id from table where id < 3)

/** notInSql */
notInSql(R column, String inValue)
notInSql(boolean condition, R column, String inValue)
// 示例：
notInSql("age", "1,2,3,4,5,6")	--->age not in (1,2,3,4,5,6)
notInSql("id", "select id from table where id < 3")	--->id not in (select id from table where id < 3)

/** groupBy 分组 */
groupBy(R... columns)
groupBy(boolean condition, R... columns)

/** orderByAsc */
orderByAsc(R... columns)
orderByAsc(boolean condition, R... columns)
// 示例:
orderByAsc("id", "name")	--->order by id ASC,name ASC

/** orderByDesc 降序排列 */
orderByDesc(R... columns)
orderByDesc(boolean condition, R... columns)

/** orderBy */
orderBy(boolean condition, boolean isAsc, R... columns)
// 示例：
orderBy(true, true, "id", "name")	--->order by id ASC,name ASC

/** having */
having(String sqlHaving, Object... params)
having(boolean condition, String sqlHaving, Object... params)
// 示例:
having("sum(age) > 10")--->having sum(age) > 10
having("sum(age) > {0}", 11)	--->having sum(age) > 11


/** func */
func(Consumer<Children> consumer)
func(boolean condition, Consumer<Children> consumer)
// 示例：
func(i -> if(true) {i.eq("id", 1)} else {i.ne("id", 1)})

/** or 拼接or */
or()
or(boolean condition)
// 示例：
eq("id",1).or().eq("name","老王")		--->id = 1 or name = '老王'

/** or or嵌套 */
or(Consumer<Param> consumer)
or(boolean condition, Consumer<Param> consumer)
// 示例：
or(i -> i.eq("name", "李白").ne("status", "活着"))		--->or (name = '李白' and status <> '活着')

/** and and嵌套 */
and(Consumer<Param> consumer)
and(boolean condition, Consumer<Param> consumer)
// 示例：
and(i -> i.eq("name", "李白").ne("status", "活着"))		--->and (name = '李白' and status <> '活着')

/** nested 正常嵌套不带AND或OR */
nested(Consumer<Param> consumer)
nested(boolean condition, Consumer<Param> consumer)
// 示例:
nested(i -> i.eq("name", "李白").ne("status", "活着"))		--->(name = '李白' and status <> '活着')

/** apply 拼接SQL */
apply(String applySql, Object... params)
apply(boolean condition, String applySql, Object... params)
// 示例：
apply("id = 1")	--->id = 1
apply("date_format(dateColumn,'%Y-%m-%d') = '2008-08-08'")	--->date_format(dateColumn,'%Y-%m-%d') = '2008-08-08'")
apply("date_format(dateColumn,'%Y-%m-%d') = {0}", "2008-08-08")	--->date_format(dateColumn,'%Y-%m-%d') = '2008-08-08'")

/** last 无视优化规则直接拼接SQL到最后 */
last(String lastSql)
last(boolean condition, String lastSql)

/** exist 拼接 EXISTS ( sql语句 ) */
exists(String existsSql)
exists(boolean condition, String existsSql)
// 示例：
exists("select id from table where age = 1")	--->exists (select id from table where age = 1)

/** notExists 拼接 NOT EXISTS ( sql语句 ) */
notExists(String notExistsSql)
notExists(boolean condition, String notExistsSql)
```

### QueryWrapper

>**说明：**继承自`AbstractWrapper` ，自身的内部属性 entity 也用于生成 where 条件及 LambdaQueryWrapper，可以通过`new QueryWrapper().lambda()`方法获取

```java
select(String... sqlSelect)
select(Predicate<TableFieldInfo> predicate)
select(Class<T> entityClass, Predicate<TableFieldInfo> predicate)
    
// 示例
select("id", "name", "age")
select(i -> i.getProperty().startsWith("test"))
```



### UpdateWrapper

>**说明：**继承自 `AbstractWrapper` ,自身的内部属性 `entity` 也用于生成 where 条件及 `LambdaUpdateWrapper`, 可以通过 `new UpdateWrapper().lambda()` 方法获取!

```java
set(String column, Object val)
set(boolean condition, String column, Object val)
// 示例
set("name", "老李头")
set("name", "")--->数据库字段值变为空字符串
set("name", null)--->数据库字段值变为null


setSql(String sql) 
// 设置 SET 部分 SQL，示例
setSql("name = '老李头'")
```



### 使用 Wrapper 自定义SQL

>**注意事项：**`mybatis-plus`版本 >= `3.0.7` param 参数名要么叫`ew`，要么加上注解`@Param(Constants.WRAPPER)` 使用`${ew.customSqlSegment}` 。不支持 `Wrapper` 内的entity生成where语句

```java
// 使用注解自定义SQL
@Select("select * from mysql_data ${ew.customSqlSegment}")
List<MysqlData> getAll(@Param(Constants.WRAPPER) Wrapper wrapper);

// 使用XML自定义SQL
List<MysqlData> getAll(Wrapper ew);
<select id="getAll" resultType="MysqlData">
	SELECT * FROM mysql_data ${ew.customSqlSegment}
</select>
```



# 拓展

## 逻辑删除

很多时候需要表的数据虽然删除了，但是还是希望不是真正删除数据，数据还是留在数据库中，只需要使用一个字段来做标志为即可，这时候就需要逻辑删除功能。

SpringBoot 配置方式：

```yaml
# application.yml 加入配置(如果你的默认值和mp默认的一样,该配置可无):

mybatis-plus:
  global-config:
    db-config:
      logic-delete-value: 1 # 逻辑已删除值(默认为 1)
      logic-not-delete-value: 0 # 逻辑未删除值(默认为 0)
```

实体类字段上加上`@TableLogic`注解，`@TableField(select = false)`注解，可以不查询出`deleted`字段



## 自动填充

很多时候表中都需要添加创建时间，创建人，修改时间，修改人来跟踪数据的来源和变动，但每次插入数据和修改数据的时候都要set这几个字段又感觉很麻烦，这个时候就系统系统能自动填充这几个字段了。

字段必须声明`@TableField`注解，属性`fill`选择对应策略，该申明告知 `Mybatis-Plus` 需要预留注入 `SQL` 字段

```java
@TableField(fill = FieldFill.INSERT)
private LocalDateTime createTime;

@TableField(fill = FieldFill.INSERT_UPDATE)
private LocalDateTime updateTime;
```

属性`fill`有四种对应策略，分别为：

```java
public enum FieldFill {
    /**
     * 默认不处理
     */
    DEFAULT,
    /**
     * 插入填充字段
     */
    INSERT,
    /**
     * 更新填充字段
     */
    UPDATE,
    /**
     * 插入和更新填充字段
     */
    INSERT_UPDATE
}
```



# 参考



> [mybatis-plus的使用 ------ 入门](https://www.jianshu.com/p/ceb1df475021)
>
> [mybatis-plus的使用 ------ 进阶](https://www.jianshu.com/p/a4d5d310daf8)
>
> [mybatis-plus思维导图，让mybatis-plus不再难懂](https://www.jianshu.com/p/df543044e8e2)

