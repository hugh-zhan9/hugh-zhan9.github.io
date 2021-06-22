---
title: Swagger2
tags: [Swagger2, SpringBoot]
categories: 后端
date: 2020-11-14 19:09:28





---



[![](https://s3.ax1x.com/2020/11/14/DPcP76.jpg)](https://imgchr.com/i/DPcP76)

<!--more-->

# 在线文档

## 依赖

```xml
<dependency>
	<groupId>io.springfox</groupId>
	<artifactId>springfox-swagger2</artifactId>
	<version>2.9.2</version>
</dependency>
<dependency>
	<groupId>io.springfox</groupId>
	<artifactId>springfox-swagger-ui</artifactId>
	<version>2.9.2</version>
</dependency>
```

## 配置文件

```java
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

@Configuration
@EnableSwagger2
public class Swagger2Config {
    @Bean
    public Docket createRestApi(){
        return new Docket(DocumentationType.SWAGGER_2)
                .apiInfo(apiInfo())
                .select()
                .apis(RequestHandlerSelectors.basePackage("com.xxx.springboot.controller"))
                .paths(PathSelectors.any())
                .build();
    }
    private ApiInfo apiInfo(){
        return new ApiInfoBuilder()
                .title("用户管理接口API文档")
                .version("1.0")
                .build();
    }
}
```

# 常用注解

## @Api

```
@Api：用在请求的类上，说明该类的作用 tags="说明该类的作用"

@Api(tags="app用户注册使用的controller")
```

## @ApiOperation

```
@ApiOperation：用在请求的方法上，说明方法的作用 value="说明方法的作用" notes="方法的备注说明"

@ApiOperation(value="用户注册", notes="手机号、密码都是必填项，年龄时选填项，但必须是数字")
```

## @ApiImplicitParams

```
@ApiImplicitParams：用在请求的方法上，包含一组参数说明
	@ApiImplicitParam：用在@ApiImplicitParams 注解中，指定一个请求参数的配置信息
	name：参数名 value：参数的说明 required：参数是否必须传入 
	paramType：参数放在哪个地方
		·header ——> 请求参数的获取@RequestHeader
		·query ———> 请求参数的获取@RequestParam
		·path （用于restful接口）——> 请求参数的获取@PathVariable
		·body 不常用
		·form 不常用
	dataType：参数类型，默认String，其它值dataType="Integer"	
	defaultValue：参数的默认值
```

```java
@ApiImplicitParams({
    @ApiImplicitParam(name="mobile", value="手机号", required=true, paramType="form"),
    @ApiImplicitParam(name="password", value="密码", required=true, paramType="form"),
    @ApiImplicitParam(name="age", value="年龄", required=false, paramType="form", dataType="Integer")
})
```

## @ApiResponses

```
@ApiResponses：用于请求的方法上，表示一组响应
	@ApiResponse：用在@ApiResponses 注解中，一半用于表达一个错误的响应信息
	code：数字，例如404
	message：信息，例如：“找不到请求资源”
	response：抛出异常的类
```

```java
@ApiOperation(value="select请求"，notes="多个参数，多种查询数据类型")
@ApiResponses({
	ApiResponse(code=400, message="请求参数没填好"),
	ApiResponse(code=404, message="请求路径没有或页面跳转路径不对")
})
```

## @ApiModel

```
@ApiModel：用于实体类上，表示一个返回响应数据的信息（这种一般用在post创建的时候，使用@RequestBody这样的场景，请求参数无法使用@ApiImplicitParams注解进行描述。）
@ApiModelProperty：用在属性上，描述响应类的属性
```

```java
@ApiModel(description="返回响应数据")
public class RestMessage implements Serializable{
    @ApiModelProperty(value="是否成功")
    private boolean success=true;
    @ApiModelProperty(value="返回对象")
    private Object data;
    @ApiModelProperty(value="错误编号")
    private Integer errCode;
    @ApiModelProperty(value="错误信息")
    private String message;
    /* setter/getter */
}
```

访问地址：http://localhost:8088/swagger-ui.html 可以查看API文档信息。

--------

# 离线文档

## 离线文档依赖

```xml
<!--swagger生成离线文档的依赖-->
<dependency>
    <groupId>io.swagger</groupId>
    <artifactId>swagger-core</artifactId>
    <version>1.5.20</version>
</dependency>
<dependency>
    <groupId>org.junit.jupiter</groupId>
    <artifactId>junit-jupiter</artifactId>
</dependency>
<dependency>
    <groupId>org.junit.jupiter</groupId>
    <artifactId>junit-jupiter</artifactId>
</dependency>
```

## 离线文档生成

> **注意：这个文件一般在测试的时候使用**

```java
import io.github.swagger2markup.GroupBy;
import io.github.swagger2markup.Language;
import io.github.swagger2markup.Swagger2MarkupConfig;
import io.github.swagger2markup.Swagger2MarkupConverter;
import io.github.swagger2markup.builder.Swagger2MarkupConfigBuilder;
import io.github.swagger2markup.markup.builder.MarkupLanguage;
import org.junit.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.net.URI;
import java.net.URISyntaxException;
import java.nio.file.Paths;

/**
 * 生成Swagger2离线文档测试
 */
@ExtendWith(SpringExtension.class)
//设定环境为设定的端口
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
public class SwaggerExportTests {
    @Test
    public void generateAsciiDocs() throws URISyntaxException {
        Swagger2MarkupConfig config = new Swagger2MarkupConfigBuilder().
                //设定导出格式，这里为MARKDOWN,还有一个ASCIIDOC
                        withMarkupLanguage(MarkupLanguage.MARKDOWN).
                //自然语言选择为中文
                        withOutputLanguage(Language.ZH).
                //按照TAGS分组
                        withPathsGroupedBy(GroupBy.TAGS).
                //将生成的示例包括到文档中
                        withGeneratedExamples()
                .withoutInlineSchema()
                .build();
        //禁用内联架构,不知道有啥用
        //不知道是不是与java中后端优化中的内联是一个意思

        Swagger2MarkupConverter.from(new URI("http://localhost:8080/v2/api-docs"))
                .withConfig(config)
                .build()
            // 指定文件生成的路径和名称
                .toFile(Paths.get("src/main/resources/docs"));
    }
}
```

