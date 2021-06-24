---
title: JWT
date: 2021-03-29 11:41:34
tags: [Java, JWT]
categories: 后端




---



JWT 全称：JSON Web Token，它主要用于身份认证和信息加密，是目前最流行的跨域认证解决方案；

<!--more-->

# 跨域认证的问题

互联网服务离不开用户认证。一般流程是下面这样。

> 1. 用户向服务器发送用户名和密码。
>2. 服务器验证通过后，在当前对话（`session`）里面保存相关数据，比如用户角色、登录时间等等。
> 3. 服务器向用户返回一个`session_id`，写入用户的`Cookie`。
>4. 用户随后的每一次请求，都会通过 Cookie，将`session_id`传回服务器。
> 5. 服务器收到`session_id`，找到前期保存的数据，由此得知用户的身份。

**传统的session认证**

http 协议本身是一种无状态的协议，而这就意味着如果用户向应用提供了用户名和密码来进行用户认证，那么下一次请求时，用户还要再一次进行用户认证才行，因为根据 http 协议，应用并不能知道是哪个用户发出的请求，所以为了让应用能识别是哪个用户发出的请求，只能在服务器存储一份用户登录的信息，这份登录信息会在响应时传递给浏览器，告诉其保存为`cookie`，以便下次请求时发送给应用，这样应用就能识别请求来自哪个用户了，这就是传统的基于`session`认证。

但是这种基于`session`的认证使应用本身很难得到扩展，随着不同客户端用户的增加，独立的服务器已无法承载更多的用户，而这时候基于`session`认证应用的问题就会暴露出来.

**基于session认证所显露的问题**

- **Session**: 每个用户经过我们的应用认证之后，我们的应用都要在服务端做一次记录，以方便用户下次请求的鉴别，通常而言session都是保存在内存中，而随着认证用户的增多，服务端的开销会明显增大。
- **扩展性**: 用户认证之后，服务端做认证记录，如果认证的记录被保存在内存中的话，这意味着用户下次请求还必须要请求在这台服务器上,这样才能拿到授权的资源，这样在分布式的应用上，相应的限制了负载均衡器的能力。这也意味着限制了应用的扩展能力。
- **CSRF**: 因为是基于cookie来进行用户识别的, cookie如果被截获，用户就会很容易受到跨站请求伪造的攻击。

举例来说，A 网站和 B 网站是同一家公司的关联服务。现在要求，用户只要在其中一个网站登录，再访问另一个网站就会自动登录，请问怎么实现？

一种解决方案是`session`数据持久化，写入数据库或别的持久层。各种服务收到请求后，都向持久层请求数据。这种方案的优点是架构清晰，缺点是工程量比较大。另外，持久层万一挂了，就会单点失败。

另一种方案是服务器索性不保存`session`数据了，所有数据都保存在客户端，每次请求都发回服务器。JWT 就是这种方案的一个代表。

# JWT 的原理

JWT 的原理是，服务器认证以后，生成一个 JSON 对象，发回给用户，就像下面这样。

> ```json
> {
>   "姓名": "张三",
>   "角色": "管理员",
>   "到期时间": "2018年7月1日0点0分"
> }
> ```

以后，用户与服务端通信的时候，都要发回这个 JSON 对象。服务器完全只靠这个对象认定用户身份。为了防止用户篡改数据，服务器在生成这个对象的时候，会加上签名。

这样服务器就不保存任何`session`数据了，也就是说：服务器变成无状态了，从而比较容易实现扩展。

# JWT 的数据结构

实际的 JWT 大概就像下面这样。

```jwt
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.
TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ
```

它是一个很长的字符串，中间用点（`.`）分隔成三个部分。注意，JWT 内部是没有换行的，这里只是为了便于展示，将它写成了几行。

JWT 的三个部分依次如下。

> - Header（头部）
> - Payload（负载）
> - Signature（签名）

写成一行，就是下面的样子。

> ```javascript
> Header.Payload.Signature
> ```

## Header

Header 部分是一个 JSON 对象，描述 JWT 的元数据，通常是下面的样子。

> ```javascript
> {
>   "alg": "HS256",
>   "typ": "JWT"
> }
> ```

上面代码中，`alg`属性表示签名的算法（algorithm），默认是`HMAC SHA256`（写成 HS256）；`typ`属性表示这个令牌（token）的类型（type），JWT 令牌统一写为`JWT`。最后，将上面的 JSON 对象使用 Base64URL 算法转成字符串。

## Payload

Payload 部分也是一个 JSON 对象，称为载荷，用来存放实际需要传递的数据。JWT 规定了7个官方字段，可以选择使用。

> - iss (issuer)：签发人
> - exp (expiration time)：过期时间
> - sub (subject)：jwt所面向的用户
> - aud (audience)：受众
> - nbf (Not Before)：定义在什么时间之前，该jwt都是不可用的.
> - iat (Issued At)：签发时间
> - jti (JWT ID)：jwt的唯一身份标识，主要用来作为一次性 token，从而回避重放攻击。

除了官方字段，你还可以在这个部分定义私有字段，下面就是一个例子。

> ```javascript
> {
>   "sub": "1234567890",
>   "name": "John Doe",
>   "admin": true
> }
> ```

**注意，JWT 默认是不加密的，任何人都可以读到，所以不要把秘密信息放在这个部分。**这个 JSON 对象也要使用 Base64URL 算法转成字符串。

## Signature

Signature 部分是对前两部分的签名，防止数据篡改。这个签证信息由三部分组成：

- header (base64后的)

- payload (base64后的)

- secret

  这个部分需要指定一个密钥（secret）。这个密钥只有服务器才知道，不能泄露给用户。然后将 Base64URL 加密后的`header`和 Base64URL 加密后的`payload`使用`.`连接组成的字符串，然后，使用 Header 里面指定的签名算法（默认是 `HMAC SHA256`），按照r如下的方式产生签名。

```javascript
var signature = HMACSHA256(base64UrlEncode(header) + "." + base64UrlEncode(payload), secret)
// TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ
```

算出签名以后，把 Header、Payload、Signature 三个部分拼成一个字符串，每个部分之间用"点"（`.`）分隔，就可以返回给用户。

## Base64URL

前面提到，Header 和 Payload 串型化的算法是`Base64URL`。这个算法跟`Base64`算法基本类似，但有一些小的不同。

JWT 作为一个令牌（token），有些场合可能会放到 URL（比如`api.example.com/?token=xxx`）。**Base64 有三个字符`+`、`/`和`=`，在 URL 里面有特殊含义，所以要被替换掉：`=`被省略、`+`替换成`-`，`/`替换成`_` 。**这就是 Base64URL 算法。

# JWT 的使用方式

客户端收到服务器返回的 JWT，可以储存在`Cookie`里面，也可以储存在 localStorage。

此后，客户端每次与服务器通信，都要带上这个 JWT。你可以把它放在`Cookie`里面自动发送，但是这样不能跨域，所以更好的做法是放在 HTTP 请求的头信息`Authorization`字段里面。

> ```javascript
> fetch('api/user/1', {
>   headers: {
>     'Authorization': 'Bearer ' + token
>   }
> })
> ```

另一种做法是，跨域的时候，JWT 就放在 POST 请求的数据体里面。

使用JWT进行验证的整个流程如下：

![](https://upload-images.jianshu.io/upload_images/1821058-2e28fe6c997a60c9.png?imageMogr2/auto-orient/strip|imageView2/2/w/1200/format/webp)

# JWT 的几个特点

1. JWT 默认是不加密，但也是可以加密的。生成原始 Token 以后，可以用密钥再加密一次。JWT 不加密的情况下，不能将秘密数据写入 JWT。
2. JWT 不仅可以用于认证，也可以用于交换信息。有效使用 JWT，可以降低服务器查询数据库的次数。
3. JWT 的最大缺点是，由于服务器不保存 session 状态，因此无法在使用过程中废止某个 token，或者更改 token 的权限。也就是说，一旦 JWT 签发了，在到期之前就会始终有效，除非服务器部署额外的逻辑。
4. JWT 本身包含了认证信息，一旦泄露，任何人都可以获得该令牌的所有权限。为了减少盗用，JWT 的有效期应该设置得比较短。对于一些比较重要的权限，使用时应该再次对用户进行认证。
5. 为了减少盗用，JWT 不应该使用 HTTP 协议明码传输，要使用 HTTPS 协议传输。



JWT工具类

```java
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.util.StringUtils;

import javax.servlet.http.HttpServletRequest;
import java.util.Date;


public class JwtUtils {

    /* 过期时间 */
    public static final long EXPIRE = 1000 * 60 * 60 * 24;
    /* 密钥，加密操作 */
    public static final String APP_SECRET = "ukc8BDbRigUDaY6pZFfWus2jZWLPHO";


    /**
     * 生成Token字符串
     * @param id
     * @param nickname
     * @return
     */
    public static String getJwtToken(String id, String nickname){

        String JwtToken = Jwts.builder()
                // JWT头
                .setHeaderParam("typ", "JWT")
                .setHeaderParam("alg", "HS256")

                // 过期时间
                .setSubject("guli-user")
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRE))

                // Token主体部分
                .claim("id", id)
                .claim("nickname", nickname)

                // 签名哈希
                .signWith(SignatureAlgorithm.HS256, APP_SECRET)
                .compact();

        return JwtToken;
    }

    /**
     * 判断token是否存在与有效
     * @param jwtToken
     * @return
     */
    public static boolean checkToken(String jwtToken) {
        if(StringUtils.isEmpty(jwtToken)) return false;
        try {
            Jwts.parser().setSigningKey(APP_SECRET).parseClaimsJws(jwtToken);
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
        return true;
    }

    /**
     * 判断token是否存在与有效
     * @param request
     * @return
     */
    public static boolean checkToken(HttpServletRequest request) {
        try {
            String jwtToken = request.getHeader("token");
            if(StringUtils.isEmpty(jwtToken)) return false;
            Jwts.parser().setSigningKey(APP_SECRET).parseClaimsJws(jwtToken);
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
        return true;
    }

    /**
     * 根据token获取会员id
     * @param request
     * @return
     */
    public static String getMemberIdByJwtToken(HttpServletRequest request) {
        String jwtToken = request.getHeader("token");
        if(StringUtils.isEmpty(jwtToken)) return "";
        Jws<Claims> claimsJws = Jwts.parser().setSigningKey(APP_SECRET).parseClaimsJws(jwtToken);
        Claims claims = claimsJws.getBody();
        return (String) claims.get("id");
    }
}
```



# JJWT的使用

JJWT是纯 Java 实现，完全基于[JWT](https://links.jianshu.com/go?to=https%3A%2F%2Ftools.ietf.org%2Fhtml%2Frfc7519)， [JWS](https://links.jianshu.com/go?to=https%3A%2F%2Ftools.ietf.org%2Fhtml%2Frfc7515)，[JWE](https://links.jianshu.com/go?to=https%3A%2F%2Ftools.ietf.org%2Fhtml%2Frfc7516)， [JWK](https://links.jianshu.com/go?to=https%3A%2F%2Ftools.ietf.org%2Fhtml%2Frfc7517)和[JWA](https://links.jianshu.com/go?to=https%3A%2F%2Ftools.ietf.org%2Fhtml%2Frfc7518) RFC规范以及[Apache 2.0许可](https://links.jianshu.com/go?to=http%3A%2F%2Fwww.apache.org%2Flicenses%2FLICENSE-2.0)条款下的[开源](https://links.jianshu.com/go?to=http%3A%2F%2Fwww.apache.org%2Flicenses%2FLICENSE-2.0)。该依赖由[Okta的](https://links.jianshu.com/go?to=http%3A%2F%2Fwww.okta.com%2F)高级建筑师[Les Hazlewood](https://links.jianshu.com/go?to=https%3A%2F%2Fgithub.com%2Flhazlewood)创建， 由一个贡献者[社区](https://links.jianshu.com/go?to=https%3A%2F%2Fgithub.com%2Fjwtk%2Fjjwt%2Fgraphs%2Fcontributors)支持和维护。[Okta](https://links.jianshu.com/go?to=https%3A%2F%2Fdeveloper.okta.com%2F)是一个面向开发人员的完整身份验证和用户管理API。

## 使用步骤

**引入依赖**

```xml
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-api</artifactId>
    <version>0.10.5</version>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-impl</artifactId>
    <version>0.10.5</version>
    <scope>runtime</scope>	<!--注意：scope必须是runtime-->
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-jackson</artifactId>
    <version>0.10.5</version>
    <scope>runtime</scope>		<!--注意：scope必须是runtime-->
</dependency>
<!-- rassa-pss (PS256, PS384, PS512)算法依赖
<dependency>
    <groupId>org.bouncycastle</groupId>
    <artifactId>bcprov-jdk15on</artifactId>
    <version>1.60</version>
    <scope>runtime</scope>
</dependency>
-->
```

## 快速开始

### 快速创建一个jws

- 项目代码中编写：

  

  ```java
  Key key = Keys.secretKeyFor(SignatureAlgorithm.HS256); 
  String jws = Jwts.builder().setSubject("Joe").signWith(key).compact();
  ```

- 分析代码

  代码中都做了些什么？

  1. 创建了一个秘钥，这个key使用的是`HMAC-SHA-256`加密算法
  2. 构建一个JWT，将注册的ClaimSub(Subject)设置为Joe
  3. 使用秘钥加密并压缩形成最后的字符串，一个签名的`jwt`成为`jws`。This is called a 'JWS' - short for *signed* JWT.

- 最终的结果

  ```css
  eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJKb2UifQ.1KP0SsvENi7Uz1oQc07aXTL7kpQG5jBNIybqr60AlD4
  ```

- 验证`jws`

  ```java
  try {
      Jwts.parser().setSigningKey(key).parseClaimsJws(compactJws);
      //OK, we can trust this JWT
  } catch (JwtException e) {
      //don't trust the JWT!
  }
  ```

  **注意事项**：`parseClaimsJws`有很多相似的方法，别用错了，如果用错了会抛出`UnsuptedJwtException`异常

## 签名 jwts

### 如何签名一个jwt

1. 假如我们有一个jwt如下

   **header**

   ```json
   {
     "alg": "HS256"
   }
   ```

   **body**

   ```json
   {
     "sub": "Joe"
   }
   ```

2. 去除多余的空白字符

   ```java
   String header = '{"alg":"HS256"}';
   String claims = '{"sub":"Joe"}';
   ```

3. 获取字符串的UTF-8字节数组，并使用BASE64转码

   ```java
   String encodedHeader = base64URLEncode(header.getBytes("UTF-8"));
   String encodedClaims = base64URLEncode(claims.getBytes("UTF-8"));
   ```

4. 使用句号`.`连接两个字符串

   ```java
   String concatenated = encodedHeader + '.' + encodedClaims;
   ```

5. 使用足够强壮的秘钥，结合加密算法，对连接的字符串进行加密

   ```java
   Key key = getMySecretKey();
   byte[] signature = hmacSha256(concatenated, key);
   ```

6. 对签名数组进行BASE64转码并使用句号`.`连接之前的字符串

   ```java
   String jws = concatenated + '.' + base64URLEncode(signature);
   ```

   最终的字符串如下:

   ```java
   eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJKb2UifQ.1KP0SsvENi7Uz1oQc07aXTL7kpQG5jBNIybqr60AlD4
   ```

   这些生成步骤不需要我们自己写，jjwt 已经帮我封装好了这些方法，包括生成 jws(signed JWT) 和验证 jws

## 加密算法

#### 算法列表

JWT规范识别12种标准的签名算法，包括**3种秘钥算法**和**9种非对称加密算法**：

```java
HS256: HMAC using SHA-256
HS384: HMAC using SHA-384
HS512: HMAC using SHA-512
    
ES256: ECDSA using P-256 and SHA-256
ES384: ECDSA using P-384 and SHA-384
ES512: ECDSA using P-521 and SHA-512
    
RS256: RSASSA-PKCS-v1_5 using SHA-256
RS384: RSASSA-PKCS-v1_5 using SHA-384
RS512: RSASSA-PKCS-v1_5 using SHA-512
PS256: RSASSA-PSS using SHA-256 and MGF1 with SHA-256
PS384: RSASSA-PSS using SHA-384 and MGF1 with SHA-384
PS512: RSASSA-PSS using SHA-512 and MGF1 with SHA-512
```

他们所在的位置：`io.jsonwebtoken.SignatureAlgorithm`的枚举中，为了安全起见，JJWT强制你必须使用足够强壮的秘钥进行加密，否则JJWT就会拒绝并抛出异常

#### 算法要求

##### HMAC-SHA

该算法包括 `HS256`, `HS384 HS512`

```java
HS256 表示 HMAC-SHA-256, 它生成256位(32字节)长的摘要，所以HS256需要使用至少32字节长的密钥。
HS384 表示 HMAC-SHA-384, 它生成384位(48字节)长的摘要，所以HS384需要使用至少48字节长的密钥。
HS512 表示 HMAC-SHA-512, 它生成512位(64字节)长的摘要，所以HS512需要使用至少64字节长的密钥。
```

##### RSA

该算法包括`RS256`, `RS384`, `RS512`, `PS256`, `PS384` and `PS512`

JWT RSA签名算法RS 256、RS 384、RS 512、PS 256、PS 384和PS 512每RFC 7512段3.3和3.5都需要2048位的最小密钥长度(也就是RSA模数位长)。任何小于此值的内容(如1024位)都会被InvalidKeyException拒绝。

尽管如此，为了与最佳实践和安全寿命，JJWT建议我们使用

```java
at least 2048 bit keys with RS256 and PS256 
at least 3072 bit keys with RS384 and PS384
at least 4096 bit keys with RS512 and PS512
```

这些只是JJWT的建议，而不是强制要求。JJWT只强制JWT规范要求，对于任何RSA密钥，要求是以位为单位的RSA密钥(模数)长度必须>=2048位。

##### Elliptic Curve

该算法包括 `ES256`, `ES384`, and `ES512`

```java
ES 256要求您使用至少256位(32字节)长的私钥。
ES 384要求您使用至少384位(48字节)长的私钥。 
ES 512要求您使用至少512位(64字节)长的私钥。
```

#### 创建一个安全的秘钥

##### 加密秘钥

JJWT提供了一个类`io.jsonwebtoken.security.Keys`可以对指定的算法生成一个足够安全的秘钥

eg:



```java
SecretKey key = Keys.secretKeyFor(SignatureAlgorithm.HS256); //or HS384 or HS512
```

如果我们有已存在的字节数组，可以使用下列方法生成秘钥



```java
byte[] keyBytes = getSigningKeyFromApplicationConfiguration();//实现该方法，从配置中获取秘钥
SecretKey key = Keys.hmacShaKeyFor(keyBytes);
```

##### 非对称秘钥

use the `Keys.keyPairFor(SignatureAlgorithm)` helper

```java
KeyPair keyPair = Keys.keyPairFor(SignatureAlgorithm.RS256); //or RS384, RS512, PS256, PS384, PS512, ES256, ES384, ES512
```

使用私钥`keyPair.getPrivate()`创建JWS，使用公钥`keyPair.getPublic()`解析/验证JWS



**注意：PS256、PS384和PS512算法需要在运行时类路径中使用JDK 11或兼容的JCA提供程序(如BouncyCastle)。如果你正在使用JDK 10或更早的版本，你想使用它们，请参阅安装部分，了解如何启用BouncyCastle。其他所有算法都是JDK本地支持的。**

## 创建JWS

You create a JWS as follows:

1. Use the `Jwts.builder()` method to create a `JwtBuilder` instance.
2. Call `JwtBuilder` methods to add header parameters and claims as desired.
3. Specify the `SecretKey` or asymmetric `PrivateKey` you want to use to sign the JWT.
4. Finally, call the `compact()` method to compact and sign, producing the final jws.

For example:



```java
String jws = Jwts.builder() // (1)

    .setSubject("Bob")      // (2) 

    .signWith(key)          // (3)
     
    .compact();             // (4)
```

#### Header参数

JWT报头提供与JWT声明相关的内容、格式和加密操作的元数据。

如果您需要设置一个或多个JWT头参数，例如 `kid` [(Key ID) header parameter](https://links.jianshu.com/go?to=https%3A%2F%2Ftools.ietf.org%2Fhtml%2Frfc7515%23section-4.1.4), 则可以根据需要调用JwtBuilder setHeaderParameter一次或多次：



```java
String jws = Jwts.builder()

    .setHeaderParameter("kid", "myKeyId")
    
    // ... etc ...
```

**==注意事项==** 设置的头信息有可能会被覆盖，不需要设置alg或zip头参数，因为jjWT将根据使用的签名算法或压缩算法自动设置它们。

还有一种方法时我们可以一次性设置头信息



```java
Header header = Jwts.header();

populate(header); //书写该方法

String jws = Jwts.builder()

    .setHeader(header)
    
    // ... etc ...
```

**==注意==**：调用setHeader将用可能已经设置的相同名称覆盖任何现有的标题名称/值对。然而，在所有情况下，JJWT仍然会设置(并覆盖)任何alg和zip头，不管这些标头是否位于指定的标头对象中。

#### 声明（claims）

声明是JWT的“主体”，包含JWT创建者希望提供给JWT收件人的信息。

1. Standard Claims

   

   ```java
   The JwtBuilder provides convenient setter methods for standard registered Claim names defined in the JWT specification. They are:
   
   setIssuer: sets the iss (Issuer) Claim
   setSubject: sets the sub (Subject) Claim
   setAudience: sets the aud (Audience) Claim
   setExpiration: sets the exp (Expiration Time) Claim
   setNotBefore: sets the nbf (Not Before) Claim
   setIssuedAt: sets the iat (Issued At) Claim
   setId: sets the jti (JWT ID) Claim
   ```

   For example:

   

   ```java
   String jws = Jwts.builder()
   
       .setIssuer("me")
       .setSubject("Bob")
       .setAudience("you")
       .setExpiration(expiration) //a java.util.Date
       .setNotBefore(notBefore) //a java.util.Date 
       .setIssuedAt(new Date()) // for example, now
       .setId(UUID.randomUUID()) //just an example id
       
       /// ... etc ...
   ```

2. Custom Claims

   If you need to set one or more custom claims that don't match the standard setter method claims shown above, you can simply call `JwtBuilder` `claim` one or more times as needed:

   

   ```java
   String jws = Jwts.builder()
   
       .claim("hello", "world")
       
       // ... etc ...
   ```

   Each time `claim` is called, it simply appends the key-value pair to an internal `Claims` instance, potentially overwriting any existing identically-named key/value pair.

   Obviously, you do not need to call `claim` for any [standard claim name](https://links.jianshu.com/go?to=https%3A%2F%2Fgithub.com%2Fjwtk%2Fjjwt%23jws-create-claims-standard) and it is recommended instead to call the standard respective setter method as this enhances readability.

3. Claims Instance

   If you want to specify all claims at once, you can use the `Jwts.claims()` method and build up the claims with it:

   

   ```java
   Claims claims = Jwts.claims();
   
   populate(claims); //implement me
   
   String jws = Jwts.builder()
   
       .setClaims(claims)
       
       // ... etc ...
   ```

   **NOTE**: Calling `setClaims` will overwrite any existing claim name/value pairs with the same names that might have already been set.

4. Claims Map

   If you want to specify all claims at once and you don't want to use `Jwts.claims()`, you can use `JwtBuilder` `setClaims(Map)`method instead:

   

   ```java
   Map<String,Object> claims = getMyClaimsMap(); //implement me
   
   String jws = Jwts.builder()
   
       .setClaims(claims)
       
       // ... etc ...
   ```

   **NOTE**: Calling `setClaims` will overwrite any existing claim name/value pairs with the same names that might have already been set.

#### 签名秘钥（Signing Key）

- 官网建议我们使用`JwtBuilder`的`signWith`方法来设置签名秘钥，然后让JJWT决定使用最安全的加密算法。

  

  ```java
  String jws = Jwts.builder()
  
     // ... etc ...
     
     .signWith(key) // <---不指定加密算法
     
     .compact();
  ```

  例如，如果您使用一个长256位(32字节)的秘钥调用signWith，那么它对HS384或HS512不够强，因此JJWT将自动使用`HS256`对JWT进行签名。

  在使用`signWith`时，JJWT还将使用相关的算法标识符自动设置所需的alg标头。

  类似地，如果使用4096位长的RSA私钥调用`signWith`，JJWT将使用`RS 512`算法并自动将alg报头设置为RS 512。

  同样的选择逻辑也适用于椭圆曲线私钥。

  **==注意事项==** **不能使用公钥对JWTs进行签名，因为不安全.** JJWT拒绝任何公钥加密并会抛出异常`InvalidKeyException`.

- 加密算法覆盖（SignatureAlgorithm Override）

  如果需要指定JJWT的加密算法时使用如下方法

  

  ```java
   .signWith(privateKey, SignatureAlgorithm.RS512) // <---
   .compact();//压缩
  ```

  这是允许的，因为JWT规范允许任何RSA密钥的RSA算法强度>=2048位。JJWT更倾向于秘钥>=4096位的RS 512，其次是秘钥>=3072位的RS 384，最后是秘钥>=2048位的RS 256。

- JWS压缩（JWS Compression）

  如果您的JWT声明集很大(包含大量数据)，并且JJWT 读取/解析都是使用JWS的同一个库，那么您可能需要压缩JWS以缩小其大小。**注意，这不是JWS的标准特性，其他JWT库不太可能支持它**

## 读取JWS（Reading a JWS）

解析JWS需要遵循以下几个步骤：

1. 使用 `Jwts.parser()` 方法创建 `JwtParser` 实例.
2. 指定需要验证JWS签名的 `SecretKey` or asymmetric `PublicKey`
3. 最终调用 `parseClaimsJws(String)` 方法，入参是签名的 `String`, 最终得到原始的 JWS.
4. 整个调用将被包装在try/catch块中。我们稍后将讨论异常和失败的原因。
5. If you don't which key to use at the time of parsing, you can look up the key using a `SigningKeyResolver` which we'll cover later.

举例如下：

```java
Jws<Claims> jws;
try {
    jws = Jwts.parser()         // (1)
    .setSigningKey(key)         // (2)
    .parseClaimsJws(jwsString); // (3)   
catch (JwtException ex) {       // (4)
    // we cannot use the JWT as intended by its creator
}
```

#### 验证秘钥（Verification Key）

在读取JWS时，最重要的是指定用于验证JWS密码签名的密钥。如果签名验证失败，则不能安全地信任JWT，因此应该丢弃JWT。

- If the jws was signed with a `SecretKey`, the same `SecretKey` should be specified on the `JwtParser`. For example:

  

  ```java
  Jwts.parser()
      
    .setSigningKey(secretKey) // <----
    
    .parseClaimsJws(jwsString);
  ```

- If the jws was signed with a `PrivateKey`, that key's corresponding `PublicKey` (not the `PrivateKey`) should be specified on the `JwtParser`. For example:

  

  ```java
  Jwts.parser()
      
    .setSigningKey(publicKey) // <---- publicKey, not privateKey
    
    .parseClaimsJws(jwsString);
  ```

还有一点我们要注意如果签名是使用的不是单一秘钥或 公/私秘钥，或者是两者的结合， 我们不能使用`JwtParser`'s `setSigningKey`方法而要使用`SigningKeyResolver`来代替

#### Signing Key Resolver

如果您的应用程序期望使用不同的密钥签名的JWS，则不能使用`setSigningKey`方法。而应该实现`SigningKeyResolver`接口，并通过`setSigningKeyResolver`方法在`JwtParser`上指定一个实例。

For example:



```java
SigningKeyResolver signingKeyResolver = getMySigningKeyResolver();

Jwts.parser()

    .setSigningKeyResolver(signingKeyResolver) // <----
    
    .parseClaimsJws(jwsString);
```

您可以通过继承`SigningKeyResolverAdapter`实现`theresolveSigningKey(JwsHeader，Claims)`方法来稍微简化一些事情。例如：



```java
public class MySigningKeyResolver extends SigningKeyResolverAdapter {
    
    @Override
    public Key resolveSigningKey(JwsHeader jwsHeader, Claims claims) {
        // implement me
    }
}
```

`JwtParser` 将在解析JWSJSON之后，但在验证JWS签名之前，调用`resolveSigningKey` 方法。这允许您检查`JwsHeader` 和`Claims` 中的任何信息，这些信息可以帮助您查找用于验证特定JWS的密钥。这对于具有更复杂的安全模型的应用程序非常强大，因为它可以在不同的时间或用户或客户时使用不同的秘钥。

我们需要检查哪些数据呢？

在JWS创建时允许创建一个ID标识

for example:



```java
Key signingKey = getSigningKey();

String keyId = getKeyId(signingKey); //any mechanism you have to associate a key with an ID is fine

String jws = Jwts.builder()
    
    .setHeaderParam(JwsHeader.KEY_ID, keyId) // 1
    
    .signWith(signingKey)                    // 2
    
    .compact();
```

在解析过程中你的`SigningKeyResolver` 可以检查`JwsHeader`并获取`kid`，然后利用这个id查找一些信息例如数据库等等。。

For example:



```java
public class MySigningKeyResolver extends SigningKeyResolverAdapter {
    
    @Override
    public Key resolveSigningKey(JwsHeader jwsHeader, Claims claims) {
        
        //inspect the header or claims, lookup and return the signing key
        
        String keyId = jwsHeader.getKeyId(); //or any other field that you need to inspect
        
        Key key = lookupVerificationKey(keyId); //implement me
        
        return key;
    }
}
```

**注意**，检查`jwsHeader.getKeyId()`只是查找密钥的最常见方法-您可以检查任意数量的头字段或声明，以确定如何查找验证密钥。这一切都是基于JWS是如何创建的。

#### 声明断言(Claim Assertions)

我们可以强制要求我们解析的JWS符合我们所期望的格式，比如我们希望JWS中包含 特定的`subject`的值，如果没有则该jws就扔掉，我们可以通过`JwtParser`上的`require*`方法



```java
try {
    Jwts.parser().requireSubject("jsmith").setSigningKey(key).parseClaimsJws(s);
} catch(InvalidClaimException ice) {
    // the sub field was missing or did not have a 'jsmith' value
}
```

如果该值是否丢失对我们很重要，那么我们可以不捕获`InvalidClaimException`，我们可以捕获  `MissingClaimException` or `IncorrectClaimException`



```java
try {
    Jwts.parser().requireSubject("jsmith").setSigningKey(key).parseClaimsJws(s);
} catch(MissingClaimException mce) {
    // the parsed JWT did not have the sub field
} catch(IncorrectClaimException ice) {
    // the parsed JWT had a sub field, but its value was not equal to 'jsmith'
}
```

我们也可以使用`require(fieldName, requiredFieldValue)`来要求JWS中包含某个字段并且该字段指定的值是我们指定的值



```java
try {
    Jwts.parser().require("myfield", "myRequiredValue").setSigningKey(key).parseClaimsJws(s);
} catch(InvalidClaimException ice) {
    // the 'myfield' field was missing or did not have a 'myRequiredValue' value
    //注意是固定值，值必须是 myRequiredValue
}   
```

#### 计算时钟偏差（Accounting for Clock Skew）

在解析JWT时，您可能会发现exp或NBF断言失败(抛出异常)，因为解析机器上的时钟与创建JWT的机器上的时钟不完全同步。这可能会出现一些明显的问题，因为exp和nbf是基于时间的断言，对于共享断言，时钟时间需要可靠地同步。

您可以在使用`JwtParser`'s`setAllowedClockSkewSeconds`进行解析时说明这些差异(通常不超过几分钟)。

例如



```java
long seconds = 3 * 60; //3 minutes

Jwts.parser()
    
    .setAllowedClockSkewSeconds(seconds) // <----
    
    // ... etc ...
    .parseClaimsJws(jwt);
```

这样可以确保两个不同的机器上的始终问题可以忽略，一般2到3分钟就足够了，如果一台生产环境的机器的时钟与世界上大多数原子钟相差5分钟以上，那将是相当少见的

##### Custom Clock Support

如果上面的`setalloningClockSkewSecond`不足以满足您的需要，那么在解析时间戳比较时创建的时间戳可以通过自定义的时间源获得。使用`io.jsonwebToken.Clock`接口的实现调用`JwtParser`的`setClock`方法。

例如：



```java
Clock clock = new MyClock();

Jwts.parser().setClock(myClock) //... etc ...
```

JwtParser的默认时钟实现只是返回新的Date()，以反映解析发生的时间，正如大多数人所期望的那样。但是，提供自己的时钟可能很有用，特别是在编写测试用例以保证确定性行为时。

#### JWS Decompression

如果使用`JJWT`压缩`JWS`并使用自定义压缩算法，则需要告诉`JwtParser`如何解析`CompressionCodec`来解压缩`JWT`。参看压缩章节

# Compression

JWT规范只是针对`JWEs(Encrypted JWTs)`进行标准化，而不支持`JWSs (Signed JWTs)`,而JJWT两个都支持，如果你确定使用JJWT进行创建JWS并且使用JJWT解析它，那么你可以使用这个功能，否则它应该只用在JWEs上

如果JWT的`Claims`集合很大大-也就是说，它包含许多名称/值对，或者单个值非常大或冗长-您可以通过压缩`Claims`的体积来缩小创建的JWS的大小。

如果在URL中使用结果JWS，这对您可能很重要，因为由于浏览器、用户邮件代理或HTTP网关兼容性问题，URL最好保持在4096个字符以下。较小的JWT还有助于降低带宽利用率，这可能是重要的，也可能不重要，这取决于您的应用程序的数量或需求。

eg:



```java
   Jwts.builder()
   
   .compressWith(CompressionCodecs.DEFLATE) // or CompressionCodecs.GZIP
   
   // .. etc ...
```

如果你使用的是`DEFLATE` or `GZIP`压缩编解码器-仅此而已，你就完事了。在解析或配置JwtParser进行压缩时你不需要做任何事情-JJWT将按照预期自动解压主体。

### 自定义压缩编解码器 (Custom Compression Codec)

如果我们在创建JWT（通过`JwtBuilder` `compressWith`）时使用的是自定义的压缩编码解码器，那我们需要通过 `setCompressionCodecResolver`提供一个编码解码器给 `JwtParser`

eg:



```java
CompressionCodecResolver ccr = new MyCompressionCodecResolver();

Jwts.parser()

    .setCompressionCodecResolver(ccr) // <----
    
    // .. etc ...
```

通常，`CompressionCodecResolver`实现将检查`zip`头，以确定使用了什么算法，然后返回支持该算法的`codec`实例。

例如：



```java
public class MyCompressionCodecResolver implements CompressionCodecResolver {
        
    @Override
    public CompressionCodec resolveCompressionCodec(Header header) throws CompressionException {
        
        String alg = header.getCompressionAlgorithm();
            
        CompressionCodec codec = getCompressionCodec(alg); //implement me
            
        return codec;
    }
}
```

# JSON处理器

```
JwtBuilder` 将使用`Serializer<Map<String, ?>>`实例将`Header` 和`Claims` 映射(以及可能包含的任何Java对象)序列化为JSON。类似地，`JwtParser` 将使用`Deserializer<Map<String, ?>>`实例将JSON反序列化为`Header` 和`Claims
```

如果没有显式配置JwtBuilder的序列化程序或JwtParser的反序列化器，如果在运行时类路径中找到以下JSON实现，JJWT将自动尝试发现和使用以下JSON实现。它们是按顺序检查的，并使用了第一个发现的方法：

1. Jackson：如果您将`io.jsonwebToken：jjwt-Jackson`指定为项目运行时依赖项，这将自动使用。Jackson支持POJO作为声明，并在必要时进行完全封送/解封处理。
2. json-java(org.json)：如果您将`io.jsonwebToken：jjwt-orgjson`指定为项目运行时依赖项，这将自动使用。

注意：`org.jsonAPI`是在Android环境中原生启用的，因此这是推荐的用于Android应用程序的JSON处理器，除非您希望使用POJO作为声明。`org.json`库支持简单的对象到JSON封送处理，但它不支持JSON到对象的解组。

**如果希望使用POJO作为`claims`值，请使用`io.jsonwebToken：jjwt-Jackson`依赖项**(如果需要，可以实现自己的序列化程序和反序列化程序)。但是请注意，Jackson将强制Android应用程序依赖大量(>1MB)的应用程序，从而增加了移动用户的应用程序下载大小。

### 自定义JSON处理器

如果您不想使用JJWT的运行时依赖方法，或者只想自定义JSON序列化和反序列化的工作方式，那么可以在JwtBuilder和JwtParser上分别实现序列化器和反序列化器接口并指定它们的实例。

例如：

When creating a JWT:



```java
Serializer<Map<String,?>> serializer = getMySerializer(); //implement me

Jwts.builder()

    .serializeToJsonWith(serializer)
    
    // ... etc ...
```

When reading a JWT:



```java
Deserializer<Map<String,?>> deserializer = getMyDeserializer(); //implement me

Jwts.parser()

    .deserializeJsonWith(deserializer)
    
    // ... etc ...
```

### Jackson JSON 处理器

如果您有一个应用程序范围的Jackson `ObjectMapper`(通常是大多数应用程序推荐的)，则可以通过使用您的ObjectMapper来消除JJWT构建自己的ObjectMapper的开销。

为此，您可以使用编译作用域声明`io.jsonwebToken：jjwt-Jackson`依赖项(而不是运行时范围，这是典型的JJWT默认值)。即：

**Maven**



```java
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-jackson</artifactId>
    <version>0.10.5</version>
    <scope>compile</scope> <!-- Not runtime -->
</dependency>
```

然后可以在`JwtBuilder`上使用自己的`ObjectMapper`指定`JacksonSeriizer`：



```java
ObjectMapper objectMapper = getMyObjectMapper(); //implement me

String jws = Jwts.builder()

    .serializeToJsonWith(new JacksonSerializer(objectMapper))
    
    // ... etc ...
```

以及在`JwtParser`上使用`ObjectMapper`的`JacksonDeseriizer`



```cpp
ObjectMapper objectMapper = getMyObjectMapper(); //implement me

Jwts.parser()

    .deserializeJsonWith(new JacksonDeserializer(objectMapper))
    
    // ... etc ...
```

# Base64支持

JJWT使用了非常快速的纯Java Base 64编解码器，用于Base 64和Base64Url编码和解码，保证在所有JDK和Android环境中都能确定地工作。

您可以使用`io.jsonwebToken.io.Encoders`和`io.jsonwebToken.io.Decodersuency`类访问JJWT的编码器和解码器。

`io.jsonwebtoken.io.Encoders`:

- `BASE64` is an RFC 4648 [Base64](https://links.jianshu.com/go?to=https%3A%2F%2Ftools.ietf.org%2Fhtml%2Frfc4648%23section-4) encoder
- `BASE64URL` is an RFC 4648 [Base64URL](https://links.jianshu.com/go?to=https%3A%2F%2Ftools.ietf.org%2Fhtml%2Frfc4648%23section-5) encoder

`io.jsonwebtoken.io.Decoders`:

- `BASE64` is an RFC 4648 [Base64](https://links.jianshu.com/go?to=https%3A%2F%2Ftools.ietf.org%2Fhtml%2Frfc4648%23section-4) decoder
- `BASE64URL` is an RFC 4648 [Base64URL](https://links.jianshu.com/go?to=https%3A%2F%2Ftools.ietf.org%2Fhtml%2Frfc4648%23section-5) decoder

### 定制Base64

如果出于某种原因要指定自己的Base64Url编码器和解码器，可以使用`JwtBuilderBase` `64UrlEncodeWith`方法设置编码器：



```java
Encoder<byte[], String> base64UrlEncoder = getMyBase64UrlEncoder(); //implement me

String jws = Jwts.builder()

    .base64UrlEncodeWith(base64UrlEncoder)
    
    // ... etc ...
```

and the `JwtParser`'s `base64UrlDecodeWith` method to set the decoder:



```java
Decoder<String, byte[]> base64UrlDecoder = getMyBase64UrlDecoder(); //implement me

Jwts.parser()

    .base64UrlDecodeWith(base64UrlEncoder)
    
    // ... etc ...
```

# 优劣势

优：减少服务器压力

劣：一旦签名的jws无法销毁

# Learn More

- [JSON Web Token for Java and Android](https://links.jianshu.com/go?to=https%3A%2F%2Fstormpath.com%2Fblog%2Fjjwt-how-it-works-why%2F)
- [How to Create and Verify JWTs in Java](https://links.jianshu.com/go?to=https%3A%2F%2Fstormpath.com%2Fblog%2Fjwt-java-create-verify%2F)
- [Where to Store Your JWTs - Cookies vs HTML5 Web Storage](https://links.jianshu.com/go?to=https%3A%2F%2Fstormpath.com%2Fblog%2Fwhere-to-store-your-jwts-cookies-vs-html5-web-storage%2F)
- [Use JWT the Right Way!](https://links.jianshu.com/go?to=https%3A%2F%2Fstormpath.com%2Fblog%2Fjwt-the-right-way%2F)
- [Token Authentication for Java Applications](https://links.jianshu.com/go?to=https%3A%2F%2Fstormpath.com%2Fblog%2Ftoken-auth-for-java%2F)
- [JJWT Changelog](https://links.jianshu.com/go?to=https%3A%2F%2Fgithub.com%2Fjwtk%2Fjjwt%2Fblob%2Fmaster%2FCHANGELOG.md)

# Author

Maintained by Les Hazlewood & [Okta](https://links.jianshu.com/go?to=https%3A%2F%2Fokta.com%2F)

# License

This project is open-source via the [Apache 2.0 License](https://links.jianshu.com/go?to=http%3A%2F%2Fwww.apache.org%2Flicenses%2FLICENSE-2.0).

> 以下总结摘自[https://blog.csdn.net/qq_28165595/article/details/80214994](https://links.jianshu.com/go?to=https%3A%2F%2Fblog.csdn.net%2Fqq_28165595%2Farticle%2Fdetails%2F80214994) 的博客
>
> ## JWT应用场景
>
> ##### 一次性验证
>
> 比如用户注册后需要发一封邮件让其激活账户，通常邮件中需要有一个链接，这个链接需要具备以下的特性：能够标识用户，该链接具有时效性（通常只允许几小时之内激活），不能被篡改以激活其他可能的账户…这种场景就和 jwt 的特性非常贴近，jwt 的 payload 中固定的参数：iss 签发者和 exp 过期时间正是为其做准备的。
>
> ##### restful api 的无状态认证
>
> 使用 jwt 来做 restful api 的身份认证也是值得推崇的一种使用方案。客户端和服务端共享 secret；过期时间由服务端校验，客户端定时刷新；签名信息不可被修改…spring security oauth jwt 提供了一套完整的 jwt 认证体系，以笔者的经验来看：使用 oauth2 或 jwt 来做 restful api 的认证都没有大问题，oauth2 功能更多，支持的场景更丰富，后者实现简单。
>
> ##### 使用 jwt 做单点登录+会话管理(不推荐)
>
> 在《八幅漫画理解使用JSON Web Token设计单点登录系统》一文中提及了使用 jwt 来完成单点登录，本文接下来的内容主要就是围绕这一点来进行讨论。如果你正在考虑使用 jwt+cookie 代替 session+cookie ，我强力不推荐你这么做。
>  首先明确一点：使用 jwt 来设计单点登录系统是一个不太严谨的说法。首先 cookie+jwt 的方案前提是非跨域的单点登录(cookie 无法被自动携带至其他域名)，其次单点登录系统包含了很多技术细节，至少包含了身份认证和会话管理，这还不涉及到权限管理。如果觉得比较抽象，不妨用传统的 session+cookie 单点登录方案来做类比，通常我们可以选择 spring security（身份认证和权限管理的安全框架）和 spring session（session 共享）来构建，而选择用 jwt 设计单点登录系统需要解决很多传统方案中同样存在和本不存在的问题。以下一一详细罗列。
>  jwt token泄露了怎么办？
>  前面的文章下有不少人留言提到这个问题，我则认为这不是问题。传统的 session+cookie 方案，如果泄露了 sessionId，别人同样可以盗用你的身份。[扬汤止沸]不如[釜底抽薪]，不妨来[追根溯源]一下，什么场景会导致你的 jwt 泄露。
>  遵循如下的实践可以尽可能保护你的 jwt 不被泄露：使用 https 加密你的应用，返回 jwt 给客户端时设置 httpOnly=true 并且使用 cookie 而不是 LocalStorage 存储 jwt，这样可以防止 XSS 攻击和 CSRF 攻击（对这两种攻击感兴趣的童鞋可以看下 spring security 中对他们的介绍CSRF,XSS）
>  secret如何设计
>  jwt 唯一存储在服务端的只有一个 secret，个人认为这个 secret 应该设计成和用户相关的属性，而不是一个所有用户公用的统一值。这样可以有效的避免一些注销和修改密码时遇到的窘境。
>  注销和修改密码
>  传统的 session+cookie 方案用户点击注销，服务端清空 session 即可，因为状态保存在服务端。但 jwt 的方案就比较难办了，因为 jwt 是无状态的，服务端通过计算来校验有效性。没有存储起来，所以即使客户端删除了 jwt，但是该 jwt 还是在有效期内，只不过处于一个游离状态。分析下痛点：注销变得复杂的原因在于 jwt 的无状态。我提供几个方案，视具体的业务来决定能不能接受。
>  \- 仅仅清空客户端的 cookie，这样用户访问时就不会携带 jwt，服务端就认为用户需要重新登录。这是一个典型的假注销，对于用户表现出退出的行为，实际上这个时候携带对应的 jwt 依旧可以访问系统。
>  \- 清空或修改服务端的用户对应的 secret，这样在用户注销后，jwt 本身不变，但是由于 secret 不存在或改变，则无法完成校验。这也是为什么将 secret 设计成和用户相关的原因。
>  \- 借助第三方存储自己管理 jwt 的状态，可以以 jwt 为 key，实现去 redis 一类的缓存中间件中去校验存在性。方案设计并不难，但是引入 redis 之后，就把无状态的 jwt 硬生生变成了有状态了，违背了 jwt 的初衷。实际上这个方案和 session 都差不多了。
>  修改密码则略微有些不同，假设号被到了，修改密码（是用户密码，不是 jwt 的 secret）之后，盗号者在原 jwt 有效期之内依旧可以继续访问系统，所以仅仅清空 cookie 自然是不够的，这时，需要强制性的修改 secret。在我的实践中就是这样做的。
>  续签问题
>  续签问题可以说是我抵制使用 jwt 来代替传统 session 的最大原因，因为 jwt 的设计中我就没有发现它将续签认为是自身的一个特性。传统的 cookie 续签方案一般都是框架自带的，session 有效期 30 分钟，30 分钟内如果有访问，session 有效期被刷新至 30 分钟。而 jwt 本身的 payload 之中也有一个 exp 过期时间参数，来代表一个 jwt 的时效性，而 jwt 想延期这个 exp 就有点[身不由己]了，因为 payload 是参与签名的，一旦过期时间被修改，整个 jwt 串就变了，jwt 的特性天然不支持续签！
>  如果你一定要使用 jwt 做会话管理（payload 中存储会话信息），也不是没有解决方案，但个人认为都不是很[令人满意]
>  1.每次请求刷新 jwt
>  jwt 修改 payload 中的 exp 后整个 jwt 串就会发生改变，那…就让它变好了，每次请求都返回一个新的 jwt 给客户端。太暴力了，不用我赘述这样做是多么的不优雅，以及带来的性能问题。但，至少这是最简单的解决方案。
>  2.只要快要过期的时候刷新 jwt
>  一个上述方案的改造点是，只在最后的几分钟返回给客户端一个新的 jwt。这样做，触发刷新 jwt 基本就要看运气了，如果用户恰巧在最后几分钟访问了[服务器]，触发了刷新，[万事大吉]；如果用户连续操作了 27 分钟，只有最后的 3 分钟没有操作，导致未刷新 jwt，无疑会令用户抓狂。
>  3.完善 refreshToken
>  借鉴 oauth2 的设计，返回给客户端一个 refreshToken，允许客户端主动刷新 jwt。一般而言，jwt 的过期时间可以设置为数小时，而 refreshToken 的过期时间设置为数天。我认为该方案并可行性是存在的，但是为了解决 jwt 的续签把整个流程改变了，为什么不考虑下 oauth2 的 password 模式和 client 模式呢？
>  4.使用 redis 记录独立的过期时间
>  实际上我的项目中由于历史遗留问题，就是使用 jwt 来做登录和会话管理的，为了解决续签问题，我们在 redis 中单独会每个 jwt 设置了过期时间，每次访问时刷新 jwt 的过期时间，若 jwt 不存在与 redis 中则认为过期。
>  同样改变了 jwt 的流程，不过嘛，世间安得两全法。我只能奉劝各位还未使用 jwt 做会话管理的朋友，尽量还是选用传统的 session+cookie 方案，有很多成熟的分布式 session 框架和安全框架供你开箱即用。