---
title: JAVA 远程读取服务器文件
tags: [Java, SSH]
categories: Java
date: 2021-04-10 15:06:28





---





![](https://images7.alphacoders.com/411/thumb-1920-411820.jpg)

[](https://count.getloli.com/get/@:FastDFS?theme=gelbooru)

<!--more-->



前两天在公司遇到一个需要，需要使用到SSH解决这个问题。在网上发现了这个包，记录以下使用及API

Maven过程引入依赖：

```xml
<!--ssh-->
<dependency>
    <groupId>ch.ethz.ganymed</groupId>
    <artifactId>ganymed-ssh2</artifactId>
    <version>build250</version>
</dependency>
```

使用常用的API设计一个工具类：

```java
public class SSHUtil {
    public boolean login() {
        // 创建远程连接，默认连接端口为22，如果不使用默认，可以使用方法
        // new Connection(ip)创建对象
        Connection conn = new Connection(ip);
        try {
            // 连接远程服务器
            conn.connect();
            // 使用用户名和密码登录
            return conn.authenticateWithPassword(usr, psword);
        } catch (IOException e) {
            System.err.printf("用户%s密码%s登录服务器%s失败！", usr, psword, ip);
            e.printStackTrace();
        }
        return false;
    }

    /**
     * 上传本地文件到服务器目录下
     * 
     * @param conn       Connection对象
     * @param fileName   本地文件
     * @param remotePath 服务器目录
     */
    public void uploadFile(Connection conn, String fileName, String remotePath) {
        SCPClient sc = new SCPClient(conn);
        try {
            // 将本地文件放到远程服务器指定目录下，默认的文件模式为 0600，即 rw，
            // 如要更改模式，可调用方法 put(fileName, remotePath, mode),模式须是4位数字且以0开头
            sc.put(fileName, remotePath);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    /**
     * 下载服务器文件到本地目录
     * 
     * @param fileName  服务器文件
     * @param localPath 本地目录
     */
    public void downloadFile(Connection conn, String fileName, String localPath) {
        SCPClient sc = new SCPClient(conn);
        try {
            sc.get(fileName, localPath);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    /**
     * 在远程LINUX服务器上，在指定目录下，获取文件各个属性
     * 
     * @param[in] conn Conncetion对象
     * @param[in] remotePath 远程主机的指定目录
     */
    public void getFileProperties(Conncetion conn, String remotePath) {
        try {
            SFTPv3Client sft = new SFTPv3Client(conn);
            Vector<?> v = sft.ls(remotePath);

            for (int i = 0; i < v.size(); i++) {
                SFTPv3DirectoryEntry s = new SFTPv3DirectoryEntry();
                s = (SFTPv3DirectoryEntry) v.get(i);
                // 文件名
                String filename = s.filename;
                // 文件的大小
                Long fileSize = s.attributes.size;
            }

            sft.close();

        } catch (Exception e1) {
            e1.printStackTrace();
        }
    }

/**
 * 在远程LINUX服务器上，在指定目录下，删除指定文件
 * @param[in] fileName 文件名
 * @param[in] remotePath 远程主机的指定目录
 * @return
 */
public void deleteFile(String remotePath, String fileName){
	try {
		SFTPv3Client sft = new SFTPv3Client(conn);
		//获取远程目录下文件列表
		Vector<?> v = sft.ls(remotePath);
   
		for(int i=0;i<v.size();i++){
			SFTPv3DirectoryEntry s = new SFTPv3DirectoryEntry();
			s = (SFTPv3DirectoryEntry) v.get(i);
			//判断列表中文件是否与指定文件名相同
			if(s.filename.equals(fileName)){
				//rm()方法中，须是文件绝对路径+文件名称
				sft.rm(remotePath + s.filename);
			}
		sft.close();
	} catch (Exception e1) {
		e1.printStackTrace();
	}
}

    /**
     * 执行脚本
     * 
     * @param conn Connection对象
     * @param cmds 要在linux上执行的指令
     */
    public int exec(Connection conn, String cmds) {
        InputStream stdOut = null;
        InputStream stdErr = null;
        int ret = -1;
        try {
            // 在connection中打开一个新的会话
            Session session = conn.openSession();
            // 在远程服务器上执行linux指令
            session.execCommand(cmds);
            // 指令执行结束后的输出
            stdOut = new StreamGobbler(session.getStdout());
            // 指令执行结束后的错误
            stdErr = new StreamGobbler(session.getStderr());
            // 等待指令执行结束
            session.waitForCondition(ChannelCondition.EXIT_STATUS, TIME_OUT);
            // 取得指令执行结束后的状态
            ret = session.getExitStatus();
           
        } catch (Exception e) {
            e.printStackTrace();
        }finally{
            conn.close();
        }
        return ret;
    }

}
```

使用Ganymed SSH2实现Web版本 XShell

```java
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.PrintWriter;

import ch.ethz.ssh2.Connection;
import ch.ethz.ssh2.Session;
import ch.ethz.ssh2.StreamGobbler;

public class ConnectionSSH {
    public static void main(String[] args) {
        try {
            Connection conn = new Connection("127.0.0.1");
            conn.connect();
            boolean isAuthenticated = conn.authenticateWithPassword("root", "123456");

            if (isAuthenticated == false) {
                throw new IOException("Authentication failed");
            }
            final Session sess = conn.openSession();
            sess.requestPTY("bash");
            sess.startShell();

            Thread thread = new Thread(new Runnable() {
                @Override
                public void run() {
                    OutputStream out = sess.getStdin();
                    String temp = "";
                    try {
                        out.write(temp.getBytes(StandardCharsets.UTF_8));
                        out.flush();
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }
            });

            Thread thread1 = new Thread(new Runnable() {
                @Override
                public void run() {
                    try {
                        InputStream stdout = new StreamGobbler(sess.getStdout());
                        byte[] bytes = new byte[1024];
                        int i;
                        while ((i = stdout.read(bytes)) != -1) {
                            System.out.println(new String(bytes, 0, i, StandardCharsets.UTF_8));
                        }
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }
            });

            Thread thread2 = new Thread(new Runnable() {
                @Override
                public void run() {
                    Scanner scanner = new Scanner(System.in);
                    scanner.useDelimiter("\n");
                    while (scanner.hasNext()) {
                        try {
                            String cmd = scanner.next() + "\r";
                            OutputStream out = sess.getStdin();
                            out.write(cmd.getBytes(StandardCharsets.UTF_8));
                            out.flush();
                        } catch (IOException e) {
                            e.printStackTrace();
                        }
                    }
                }
            });
            thread.start();
            thread1.start();
            thread2.start();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```



> 参考：
>
> https://www.jianshu.com/p/513c72dfee1b
>
> [Ganymed SSH2 模拟类似FileZilla远程传输文件（基于SCP协议）](https://blog.csdn.net/doctor_who2004/article/details/47322801)
>
> [Ganymed SSH-2 for Java学习笔记]([Ganymed SSH-2 for Java学习笔记_独特的弧度的博客-CSDN博客](https://blog.csdn.net/weixin_43674919/article/details/112182306))