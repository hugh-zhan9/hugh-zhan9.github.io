---

title: LeetCode 刷题指南
tags: LeetCode
categories: LeetCode笔记与总结
date: 2021-05-31 20:10:00



---



![](https://images.pexels.com/photos/167699/pexels-photo-167699.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260)

<!--more-->

LeetCode 刷题

26. remove-duplicates-from-sorted-array（[删除有序数组中的重复项](https://leetcode-cn.com/problems/remove-duplicates-from-sorted-array/)）
27. remove-element（[移除元素](https://leetcode-cn.com/problems/remove-element/)）

35. search-insert-position（[搜索插入位置](https://leetcode-cn.com/problems/search-insert-position) ）

53. maximum-subarray（[最大子序和](https://leetcode-cn.com/problems/maximum-subarray/)）



这居然是easy题

```java

```





双指针解法

二分法查找

分治法







## 什么是双指针（对撞指针、快慢指针）

**双指针**，指的是在遍历对象的过程中，不是普通的使用单个指针进行访问，而是使用两个相同方向（*快慢指针*）或者相反方向（*对撞指针*）的指针进行扫描，从而达到相应的目的。

换言之，双指针法充分使用了数组有序这一特征，从而在某些情况下能够简化一些运算。

在`LeetCode`题库中，关于**双指针**的问题还是挺多的。[双指针](https://link.zhihu.com/?target=https%3A//leetcode-cn.com/tag/two-pointers/)



![img](https://pic4.zhimg.com/80/v2-b5d11ae2b4ede2046abd0a98bec0b6f7_720w.jpg)截图来之LeetCode中文官网



## 用法

### 对撞指针

**对撞指针**是指在有序数组中，将指向最左侧的索引定义为`左指针(left)`，最右侧的定义为`右指针(right)`，然后从两头向中间进行数组遍历。

> 对撞数组适用于**有序数组**，也就是说当你遇到题目给定有序数组时，应该第一时间想到用对撞指针解题。

伪代码大致如下：

```js
function fn (list) {
  var left = 0;
  var right = list.length - 1;

  //遍历数组
  while (left <= right) {
    left++;
    // 一些条件判断 和处理
    ... ...
    right--;
  }
}
```

举个LeetCode上的例子：

以**LeetCode 881[救生艇](https://link.zhihu.com/?target=https%3A//leetcode-cn.com/problems/boats-to-save-people/)**问题为例

由于本题只要求计算出`最小船数`，所以原数组是否被改变，和元素索引位置都不考虑在内，所以可以先对于给定数组进行排序，再从数组两侧向中间遍历。所以解题思路如下：

1. 对给定数组进行升序排序
2. 初始化左右指针
3. 每次都用一个”最重的“和一个”最轻的“进行配对，如果二人重量小于`Limit`，则此时的”最轻的“上船，即（`left++`）。不管”最轻的“是否上船，”最重的“都要上船，即（`right--`）并且所需船数量加一，即（`num++`）

代码如下：

```js
var numRescueBoats = function(people, limit) {
  people.sort((a, b) => (a - b));
  var num = 0
  let left = 0
  let right = people.length - 1
  while (left <= right) {
    if ((people[left] + people[right]) <= limit) {
      left++
    }
    right--
    num++
  }
  return num
};
```

------

### 快慢指针

**快慢指针**也是双指针，但是两个指针从同一侧开始遍历数组，将这两个指针分别定义为`快指针（fast）`和`慢指针（slow）`，两个指针以不同的策略移动，直到两个指针的值相等（或其他特殊条件）为止，如`fast`每次增长两个，`slow`每次增长一个。

以[LeetCode 141.环形链表](https://link.zhihu.com/?target=https%3A//leetcode-cn.com/problems/linked-list-cycle/)为例,，判断给定链表中是否存在环，可以定义快慢两个指针，快指针每次增长一个，而慢指针每次增长两个，最后两个指针指向节点的值相等，则说明有环。就好像一个环形跑道上有一快一慢两个运动员赛跑，如果时间足够长，跑地快的运动员一定会赶上慢的运动员。

解题代码如下：

```js
/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */

/**
 * @param {ListNode} head
 * @return {boolean}
 */
var hasCycle = function(head) {
  if (head === null || head.next === null) {
    return false
  }

  let slow = head
  let fast = head.next

  while (slow !== fast) {
    if (fast === null || fast.next === null) {
      return false
    }
    slow = slow.next
    fast = fast.next.next
  }
  return true
};
```

再比如[LeetCode 26 删除排序数组中的重复项](https://link.zhihu.com/?target=https%3A//leetcode-cn.com/problems/remove-duplicates-from-sorted-array/)，这里还是定义快慢两个指针。快指针每次增长一个，慢指针只有当快慢指针上的值不同时，才增长一个（由于是有序数组，快慢指针值不等说明找到了新值）。

真实代码：

```java
class Solution {
    public int removeDuplicates(int[] nums) {
        int fast = 1;
        int slow = 0;
        while(fast<nums.length){
            if(nums[slow] == nums[fast]){
                fast++;
            }else{
                slow++;
                nums[slow] = nums[fast];
                fast++; 
            }
        }
        return slow+1;   
    }
}
```

### 滑动窗口法

两个指针，一前一后组成滑动窗口，并计算滑动窗口中的元素的问题。

这类问题一般包括

1、字符串匹配问题

2、子数组问题

## 总结

当遇到有序数组时，应该优先想到`双指针`来解决问题，因两个指针的同时遍历会减少空间复杂度和时间复杂度。



一些大佬的方法：

--------------------

# leetcode刷题最强指南（版本1.0）

## 为什么会有这篇刷题指南

很多刚开始刷题的同学都有一个困惑：面对leetcode上近两千道题目，从何刷起。

其实我之前在知乎上回答过这个问题，回答内容大概是按照如下类型来刷 **数组-> 链表-> 哈希表->字符串->栈与队列->树->回溯->贪心->动态规划->图论->高级数据结构**，再从简单刷起，做了几个类型题目之后，再慢慢做中等题目、困难题目。

但我能设身处地的感受到：即使有这样一个整体规划，对于一位初学者甚至算法老手寻找合适自己的题目也是很困难，时间成本很高，而且题目还不一定就是经典题目。

对于刷题，我们都是想用最短的时间把经典题目都做一篇，这样效率才是最高的！

所以我整理了这篇leetcode刷题最强指南：一个超级详细的刷题顺序，**每道题目都是我精心筛选，都是经典题目高频面试题**，大家只要按照这个顺序刷就可以了，**你没看错，就是题目顺序都排好了，文章顺序就是刷题顺序！挨个刷就可以，不用自己再去题海里选题了！**

而且每道题目我都写了的详细题解（图文并茂，难点配有视频），力扣上我的题解都是排在对应题目的首页，质量是有目共睹的。

**那么今天我把这个刷题顺序整理出来，是为了帮助更多的学习算法的同学少走弯路！**

如果你在刷leetcode，强烈建议先按照本篇刷题顺序来刷，**刷完了你会发现对整个知识体系有一个质的飞跃，不用在题海茫然的寻找方向**。

## 如何使用该刷题指南

大家在看下面题目文章的时候，就会发现有很多录友（代码随想录的朋友们）在文章下留言打卡，**这份刷题顺序和题解已经陪伴了上万录友了，同时也说明文章的质量是经过上万人的考验！**

**欢迎每一位学习算法的小伙伴加入到这个学习阵营来！**

如果你是算法老手，这篇攻略也是复习的最佳资料，**如果把每个系列对应的总结篇，快速过一遍，整个算法知识体系以及各种解法就重现脑海了**。

在按照如下顺序刷题的过程中，每一道题解一定要看对应文章下面的留言（留言目前只能在手机端查看）。

如果你有疑问或者发现文章哪里有不对的地方，都可以在留言区都能找到答案，还有很多录友的总结非常赞，看完之后也很有收获。

目前「代码随想录」刷题指南更新了：**140篇文章，精讲了100道经典算法题目，每个系列开始都有对应的理论基础讲解，系列结束都有对应的总结篇，部分难点题目还搭配了20分钟左右的视频讲解**。

## leetcode最强刷题指南

### 编程素养

- [看了这么多代码，谈一谈代码风格！](https://mp.weixin.qq.com/s?__biz=MzUxNjY5NTYxNA==&mid=2247485724&idx=1&sn=2bd20fce2daccd53a05dcc4bce633f73&scene=21#wechat_redirect)

### 求职

- [程序员的简历应该这么写！！（附简历模板）](https://mp.weixin.qq.com/s?__biz=MzUxNjY5NTYxNA==&mid=2247485960&idx=1&sn=37cbdb8fc7d5ce102d20f75982a9e404&scene=21#wechat_redirect)
- [互联网大厂技术面试流程和注意事项](https://mp.weixin.qq.com/s?__biz=MzUxNjY5NTYxNA==&mid=2247485194&idx=2&sn=945ec14a48c18c315dc0fd8370e0f268&scene=21#wechat_redirect)

### 算法性能分析

- [关于时间复杂度，你不知道的都在这里！](https://mp.weixin.qq.com/s?__biz=MzUxNjY5NTYxNA==&mid=2247485980&idx=1&sn=88a44d270b1361611996281446c4f7b6&scene=21#wechat_redirect)
- [O(n)的算法居然超时了，此时的n究竟是多大？](https://mp.weixin.qq.com/s?__biz=MzUxNjY5NTYxNA==&mid=2247486000&idx=1&sn=c97a3f1157a0e06dbc933b5ad9b7808c&scene=21#wechat_redirect)
- [通过一道面试题目，讲一讲递归算法的时间复杂度！](https://mp.weixin.qq.com/s?__biz=MzUxNjY5NTYxNA==&mid=2247486013&idx=1&sn=c35108a573d85e0bd4ef2c8c4393d70d&scene=21#wechat_redirect)

### 数组

- [关于数组，你该了解这些！](https://mp.weixin.qq.com/s?__biz=MzUxNjY5NTYxNA==&mid=2247483956&idx=1&sn=2e63f2ed9d6711fb3485533c178a4ad0&scene=21#wechat_redirect)
- [数组：每次遇到二分法，都是一看就会，一写就废](https://mp.weixin.qq.com/s?__biz=MzUxNjY5NTYxNA==&mid=2247484289&idx=1&sn=929fee0ac9f308a863a4fc4e2e44506e&scene=21#wechat_redirect)
- [数组：就移除个元素很难么？](https://mp.weixin.qq.com/s?__biz=MzUxNjY5NTYxNA==&mid=2247484304&idx=1&sn=ad2e11d171f74ad772fd23b10142e3f3&scene=21#wechat_redirect)
- [数组：滑动窗口拯救了你](https://mp.weixin.qq.com/s?__biz=MzUxNjY5NTYxNA==&mid=2247484315&idx=1&sn=414b885abba34abfd8d9f35c9f61b857&scene=21#wechat_redirect)
- [数组：这个循环可以转懵很多人！](https://mp.weixin.qq.com/s?__biz=MzUxNjY5NTYxNA==&mid=2247484331&idx=1&sn=dc41b2ba53227743f6a1b0433f9db6ef&scene=21#wechat_redirect)
- [数组：总结篇](https://mp.weixin.qq.com/s?__biz=MzUxNjY5NTYxNA==&mid=2247484347&idx=1&sn=3fa859bbe348bf796945b91f92c9ba27&scene=21#wechat_redirect)

### 链表

- [关于链表，你该了解这些！](https://mp.weixin.qq.com/s?__biz=MzUxNjY5NTYxNA==&mid=2247484053&idx=1&sn=5d7c0b0f924055c94e7afc12a314d048&scene=21#wechat_redirect)
- [链表：听说用虚拟头节点会方便很多？](https://mp.weixin.qq.com/s?__biz=MzUxNjY5NTYxNA==&mid=2247484132&idx=1&sn=032d3d00bdfb7179941306a2aa50c9f1&scene=21#wechat_redirect)
- [链表：一道题目考察了常见的五个操作！](https://mp.weixin.qq.com/s?__biz=MzUxNjY5NTYxNA==&mid=2247484144&idx=1&sn=d2783ac63a1e93f7fc7d174308f6b400&scene=21#wechat_redirect)
- [链表：听说过两天反转链表又写不出来了？](https://mp.weixin.qq.com/s?__biz=MzUxNjY5NTYxNA==&mid=2247484158&idx=1&sn=60a756f681e2edeab28962c70b603ef9&scene=21#wechat_redirect)
- [链表：环找到了，那入口呢？](https://mp.weixin.qq.com/s?__biz=MzUxNjY5NTYxNA==&mid=2247484171&idx=1&sn=72ba729f2f4b696dfc4987e232f1ad2d&scene=21#wechat_redirect)
- [链表：总结篇！](https://mp.weixin.qq.com/s?__biz=MzUxNjY5NTYxNA==&mid=2247485318&idx=1&sn=86d2162af64348f965397725206a5277&scene=21#wechat_redirect)

### 哈希表

- [关于哈希表，你该了解这些！](https://mp.weixin.qq.com/s?__biz=MzUxNjY5NTYxNA==&mid=2247483949&idx=1&sn=9b524f7bc34088304cbf853542d39f7a&scene=21#wechat_redirect)
- [哈希表：可以拿数组当哈希表来用，但哈希值不要太大](https://mp.weixin.qq.com/s?__biz=MzUxNjY5NTYxNA==&mid=2247484183&idx=1&sn=d76b01a1a888b24ff71adccec7324061&scene=21#wechat_redirect)
- [哈希表：哈希值太大了，还是得用set](https://mp.weixin.qq.com/s?__biz=MzUxNjY5NTYxNA==&mid=2247484194&idx=1&sn=83d9434be10c040908e5a8b838b91fe6&scene=21#wechat_redirect)
- [哈希表：今天你快乐了么？](https://mp.weixin.qq.com/s?__biz=MzUxNjY5NTYxNA==&mid=2247484202&idx=1&sn=f07d1166d61887007c2aa8c076a07365&scene=21#wechat_redirect)
- [哈希表：map等候多时了](https://mp.weixin.qq.com/s?__biz=MzUxNjY5NTYxNA==&mid=2247484214&idx=1&sn=0dc1cba149de626db52189c684f353e5&scene=21#wechat_redirect)
- [哈希表：其实需要哈希的地方都能找到map的身影](https://mp.weixin.qq.com/s?__biz=MzUxNjY5NTYxNA==&mid=2247484222&idx=1&sn=6d8227272e21c08d6b43250a4a1e0799&scene=21#wechat_redirect)
- [哈希表：赎金信](https://mp.weixin.qq.com/s?__biz=MzUxNjY5NTYxNA==&mid=2247484230&idx=1&sn=997df88a39bbf96f832a7d6398d900cc&scene=21#wechat_redirect)
- [哈希表：解决了两数之和，那么能解决三数之和么？](https://mp.weixin.qq.com/s?__biz=MzUxNjY5NTYxNA==&mid=2247484250&idx=1&sn=223e601c74ac9690cf523fba81529df1&scene=21#wechat_redirect)
- [双指针法：一样的道理，能解决四数之和](https://mp.weixin.qq.com/s?__biz=MzUxNjY5NTYxNA==&mid=2247484258&idx=1&sn=137560e16725e9e7e39f5c420c3bcd7e&scene=21#wechat_redirect)
- [哈希表：总结篇！（每逢总结必经典）](https://mp.weixin.qq.com/s?__biz=MzUxNjY5NTYxNA==&mid=2247485421&idx=1&sn=7f176ebc2ff7fab85812250b38ee7a5e&scene=21#wechat_redirect)

### 字符串

- [字符串：这道题目，使用库函数一行代码搞定](https://mp.weixin.qq.com/s?__biz=MzUxNjY5NTYxNA==&mid=2247484360&idx=1&sn=8082140e81c1fbfbcf31505df302cc4a&scene=21#wechat_redirect)
- [字符串：简单的反转还不够！](https://mp.weixin.qq.com/s?__biz=MzUxNjY5NTYxNA==&mid=2247484369&idx=1&sn=41e25d81dd834dd6073b263c8106e963&scene=21#wechat_redirect)
- [字符串：替换空格](https://mp.weixin.qq.com/s?__biz=MzUxNjY5NTYxNA==&mid=2247484380&idx=1&sn=71d65b4c34c1c78d497115f109773343&scene=21#wechat_redirect)
- [字符串：花式反转还不够！](https://mp.weixin.qq.com/s?__biz=MzUxNjY5NTYxNA==&mid=2247484396&idx=1&sn=a11d77384e0baebc9967e304453ff45d&scene=21#wechat_redirect)
- [字符串：反转个字符串还有这个用处？](https://mp.weixin.qq.com/s?__biz=MzUxNjY5NTYxNA==&mid=2247484405&idx=1&sn=5b30d31cc55eb9123b58a86b0b6736ca&scene=21#wechat_redirect)
- [视频来了！！带你学透KMP算法（理论篇&代码篇）](https://mp.weixin.qq.com/s?__biz=MzUxNjY5NTYxNA==&mid=2247485941&idx=1&sn=abc2fb60a31102eff919ad208185c3d2&scene=21#wechat_redirect)
- [字符串：都来看看KMP的看家本领！](https://mp.weixin.qq.com/s?__biz=MzUxNjY5NTYxNA==&mid=2247484438&idx=1&sn=52cd12bec41d3b150d9e2651e1df0418&scene=21#wechat_redirect)
- [字符串：KMP算法还能干这个！](https://mp.weixin.qq.com/s?__biz=MzUxNjY5NTYxNA==&mid=2247484461&idx=1&sn=193610f2ab9adacef0c6e0649e3f836c&scene=21#wechat_redirect)
- [字符串：总结篇！](https://mp.weixin.qq.com/s?__biz=MzUxNjY5NTYxNA==&mid=2247484482&idx=1&sn=e00a229ab993837e56f848ca113fd1c7&scene=21#wechat_redirect)

### 双指针法

- [数组：就移除个元素很难么？](https://mp.weixin.qq.com/s?__biz=MzUxNjY5NTYxNA==&mid=2247484304&idx=1&sn=ad2e11d171f74ad772fd23b10142e3f3&scene=21#wechat_redirect)
- [字符串：这道题目，使用库函数一行代码搞定](https://mp.weixin.qq.com/s?__biz=MzUxNjY5NTYxNA==&mid=2247484360&idx=1&sn=8082140e81c1fbfbcf31505df302cc4a&scene=21#wechat_redirect)
- [字符串：替换空格](https://mp.weixin.qq.com/s?__biz=MzUxNjY5NTYxNA==&mid=2247484380&idx=1&sn=71d65b4c34c1c78d497115f109773343&scene=21#wechat_redirect)
- [字符串：花式反转还不够！](https://mp.weixin.qq.com/s?__biz=MzUxNjY5NTYxNA==&mid=2247484396&idx=1&sn=a11d77384e0baebc9967e304453ff45d&scene=21#wechat_redirect)
- [链表：听说过两天反转链表又写不出来了？](https://mp.weixin.qq.com/s?__biz=MzUxNjY5NTYxNA==&mid=2247484158&idx=1&sn=60a756f681e2edeab28962c70b603ef9&scene=21#wechat_redirect)
- [链表：环找到了，那入口呢？](https://mp.weixin.qq.com/s?__biz=MzUxNjY5NTYxNA==&mid=2247484171&idx=1&sn=72ba729f2f4b696dfc4987e232f1ad2d&scene=21#wechat_redirect)
- [哈希表：解决了两数之和，那么能解决三数之和么？](https://mp.weixin.qq.com/s?__biz=MzUxNjY5NTYxNA==&mid=2247484250&idx=1&sn=223e601c74ac9690cf523fba81529df1&scene=21#wechat_redirect)
- [双指针法：一样的道理，能解决四数之和](https://mp.weixin.qq.com/s?__biz=MzUxNjY5NTYxNA==&mid=2247484258&idx=1&sn=137560e16725e9e7e39f5c420c3bcd7e&scene=21#wechat_redirect)
- [双指针法：总结篇！](https://mp.weixin.qq.com/s?__biz=MzUxNjY5NTYxNA==&mid=2247484612&idx=1&sn=6769e88ea95e05423fe9cc6594411da6&scene=21#wechat_redirect)

### 栈与队列

- [关于栈与队列，你该了解这些！](https://mp.weixin.qq.com/s?__biz=MzUxNjY5NTYxNA==&mid=2247484494&idx=1&sn=c85ccee4bf5a795cffc448ed73ca0c6c&scene=21#wechat_redirect)
- [栈与队列：我用栈来实现队列怎么样？](https://mp.weixin.qq.com/s?__biz=MzUxNjY5NTYxNA==&mid=2247484505&idx=1&sn=1cd88bacb0c4df18bc1cbed5434c632d&scene=21#wechat_redirect)
- [栈与队列：用队列实现栈还有点别扭](https://mp.weixin.qq.com/s?__biz=MzUxNjY5NTYxNA==&mid=2247484515&idx=1&sn=445b8ac6657ee096525f79a3a53deb13&scene=21#wechat_redirect)
- [栈与队列：系统中处处都是栈的应用](https://mp.weixin.qq.com/s?__biz=MzUxNjY5NTYxNA==&mid=2247484531&idx=1&sn=448cab9a64c6cd00ed55dee847db0c4c&scene=21#wechat_redirect)
- [栈与队列：匹配问题都是栈的强项](https://mp.weixin.qq.com/s?__biz=MzUxNjY5NTYxNA==&mid=2247484545&idx=1&sn=1011751367be8e3fbc60d12669d70b53&scene=21#wechat_redirect)
- [栈与队列：有没有想过计算机是如何处理表达式的？](https://mp.weixin.qq.com/s?__biz=MzUxNjY5NTYxNA==&mid=2247484558&idx=1&sn=5fe244d6128b37fa249ecddfe9480348&scene=21#wechat_redirect)
- [栈与队列：滑动窗口里求最大值引出一个重要数据结构](https://mp.weixin.qq.com/s?__biz=MzUxNjY5NTYxNA==&mid=2247484570&idx=1&sn=805aea4d77060374e8a311e6b6b2c072&scene=21#wechat_redirect)
- [栈与队列：求前 K 个高频元素和队列有啥关系？](https://mp.weixin.qq.com/s?__biz=MzUxNjY5NTYxNA==&mid=2247484582&idx=1&sn=ea396af48f31e649f30405b75d2ed7d1&scene=21#wechat_redirect)
- [栈与队列：总结篇！](https://mp.weixin.qq.com/s?__biz=MzUxNjY5NTYxNA==&mid=2247484603&idx=1&sn=3db71711def3a3eea6f58b0b3a3824f2&scene=21#wechat_redirect)

### 二叉树

- [关于二叉树，你该了解这些！](https://mp.weixin.qq.com/s?__biz=MzUxNjY5NTYxNA==&mid=2247484643&idx=1&sn=a8b3878fe8c72309145acaa50bf8fa4e&scene=21#wechat_redirect)
- [二叉树：一入递归深似海，从此offer是路人](https://mp.weixin.qq.com/s?__biz=MzUxNjY5NTYxNA==&mid=2247484654&idx=1&sn=0c22c8b8771acc2387bf37ac255749f0&scene=21#wechat_redirect)
- [二叉树：听说递归能做的，栈也能做！](https://mp.weixin.qq.com/s?__biz=MzUxNjY5NTYxNA==&mid=2247484677&idx=1&sn=e04b4a5baa7a3f6b090947bfa8aea97a&scene=21#wechat_redirect)
- [二叉树：前中后序迭代方式的写法就不能统一一下么？](https://mp.weixin.qq.com/s?__biz=MzUxNjY5NTYxNA==&mid=2247484687&idx=1&sn=85cd297b3c9927467e4048b1f50aa938&scene=21#wechat_redirect)
- [二叉树：层序遍历登场！](https://mp.weixin.qq.com/s?__biz=MzUxNjY5NTYxNA==&mid=2247484713&idx=1&sn=2072608d432def7457fdfa27b73d8193&scene=21#wechat_redirect)
- [二叉树：你真的会翻转二叉树么？](https://mp.weixin.qq.com/s?__biz=MzUxNjY5NTYxNA==&mid=2247484731&idx=1&sn=aa7da461e9c03eb00b3fdbfbfe17e7dc&scene=21#wechat_redirect)
- [本周小结！（二叉树）](https://mp.weixin.qq.com/s?__biz=MzUxNjY5NTYxNA==&mid=2247484747&idx=1&sn=ab09764328827941cf951a8d9a417bbb&scene=21#wechat_redirect)
- [二叉树：我对称么？](https://mp.weixin.qq.com/s?__biz=MzUxNjY5NTYxNA==&mid=2247484775&idx=1&sn=8acc987b8e87f2f322c26bba47bb4867&scene=21#wechat_redirect)
- [二叉树：看看这些树的最大深度](https://mp.weixin.qq.com/s?__biz=MzUxNjY5NTYxNA==&mid=2247484791&idx=1&sn=2e9f1308520a74441c66fe60691ce241&scene=21#wechat_redirect)
- [二叉树：看看这些树的最小深度](https://mp.weixin.qq.com/s?__biz=MzUxNjY5NTYxNA==&mid=2247484806&idx=1&sn=a643f2a63896706e0cc12a2db6d4fe85&scene=21#wechat_redirect)
- [二叉树：我有多少个节点？](https://mp.weixin.qq.com/s?__biz=MzUxNjY5NTYxNA==&mid=2247484827&idx=1&sn=5b784b8814bc971451c86492e74e5fbb&scene=21#wechat_redirect)
- [二叉树：我平衡么？](https://mp.weixin.qq.com/s?__biz=MzUxNjY5NTYxNA==&mid=2247484841&idx=1&sn=fd1380e74ed46c7267b069f3578e2d3a&scene=21#wechat_redirect)
- [二叉树：找我的所有路径？](https://mp.weixin.qq.com/s?__biz=MzUxNjY5NTYxNA==&mid=2247484854&idx=1&sn=bbe5222821da342cae923b1e36bb160c&scene=21#wechat_redirect)
- [本周小结！（二叉树）](https://mp.weixin.qq.com/s?__biz=MzUxNjY5NTYxNA==&mid=2247484874&idx=1&sn=1aeed8b839a37457d17a71d6a241aa88&scene=21#wechat_redirect)
- [二叉树：以为使用了递归，其实还隐藏着回溯](https://mp.weixin.qq.com/s?__biz=MzUxNjY5NTYxNA==&mid=2247484885&idx=1&sn=590b824ec73eb65de22a7dcc98134d26&scene=21#wechat_redirect)
- [二叉树：做了这么多题目了，我的左叶子之和是多少？](https://mp.weixin.qq.com/s?__biz=MzUxNjY5NTYxNA==&mid=2247484897&idx=1&sn=fbf25da0459ebaec7cc550109fd106b4&scene=21#wechat_redirect)
- [二叉树：我的左下角的值是多少？](https://mp.weixin.qq.com/s?__biz=MzUxNjY5NTYxNA==&mid=2247484911&idx=1&sn=d493e4c5465aa59192ab58d336e588f9&scene=21#wechat_redirect)
- [二叉树：递归函数究竟什么时候需要返回值，什么时候不要返回值？](https://mp.weixin.qq.com/s?__biz=MzUxNjY5NTYxNA==&mid=2247484927&idx=1&sn=476c0cfc2b04d14fe5c32605a2676b9f&scene=21#wechat_redirect)
- [二叉树：构造二叉树登场！](https://mp.weixin.qq.com/s?__biz=MzUxNjY5NTYxNA==&mid=2247484950&idx=1&sn=3900f9433d36dd5406fc1ccb1df07703&scene=21#wechat_redirect)
- [二叉树：构造一棵最大的二叉树](https://mp.weixin.qq.com/s?__biz=MzUxNjY5NTYxNA==&mid=2247484963&idx=1&sn=f0e1e21dc5cda3e6223ba6e4b46593c7&scene=21#wechat_redirect)
- [本周小结！（二叉树系列三）](https://mp.weixin.qq.com/s?__biz=MzUxNjY5NTYxNA==&mid=2247484972&idx=1&sn=e962d5c12c373f38837be1b045c68fa1&scene=21#wechat_redirect)
- [二叉树：合并两个二叉树](https://mp.weixin.qq.com/s?__biz=MzUxNjY5NTYxNA==&mid=2247484988&idx=1&sn=03bc66ed9af4f5ddf7891d06b0a850f3&scene=21#wechat_redirect)
- [二叉树：二叉搜索树登场！](https://mp.weixin.qq.com/s?__biz=MzUxNjY5NTYxNA==&mid=2247485012&idx=1&sn=971ad48e3be136ed9e8d10c1e8a25111&scene=21#wechat_redirect)
- [二叉树：我是不是一棵二叉搜索树](https://mp.weixin.qq.com/s?__biz=MzUxNjY5NTYxNA==&mid=2247485028&idx=1&sn=87e2fe177dd794c0c27d57cb1169f3ce&scene=21#wechat_redirect)
- [二叉树：搜索树的最小绝对差](https://mp.weixin.qq.com/s?__biz=MzUxNjY5NTYxNA==&mid=2247485040&idx=1&sn=5076aed483d61d710eaf3db626df9c4e&scene=21#wechat_redirect)
- [二叉树：我的众数是多少？](https://mp.weixin.qq.com/s?__biz=MzUxNjY5NTYxNA==&mid=2247485055&idx=1&sn=0f3064622d80255348bfec1d8f222dd3&scene=21#wechat_redirect)
- [二叉树：公共祖先问题](https://mp.weixin.qq.com/s?__biz=MzUxNjY5NTYxNA==&mid=2247485072&idx=1&sn=1e6c6d28a70ad0f6986ca5f850b74abe&scene=21#wechat_redirect)
- [本周小结！（二叉树系列四）](https://mp.weixin.qq.com/s?__biz=MzUxNjY5NTYxNA==&mid=2247485083&idx=1&sn=19b76fd4743765c92ed31b79f108a3e4&scene=21#wechat_redirect)
- [二叉树：搜索树的公共祖先问题](https://mp.weixin.qq.com/s?__biz=MzUxNjY5NTYxNA==&mid=2247485103&idx=1&sn=9cd0d08e1c52497b80c1dea395c63d1d&scene=21#wechat_redirect)
- [二叉树：搜索树中的插入操作](https://mp.weixin.qq.com/s?__biz=MzUxNjY5NTYxNA==&mid=2247485117&idx=1&sn=8f34c86fb6e8adea26189c7beb1ffafc&scene=21#wechat_redirect)
- [二叉树：搜索树中的删除操作](https://mp.weixin.qq.com/s?__biz=MzUxNjY5NTYxNA==&mid=2247485135&idx=1&sn=57d1de0ec50e5ccbd4cfd7703de59a8d&scene=21#wechat_redirect)
- [二叉树：修剪一棵搜索树](https://mp.weixin.qq.com/s?__biz=MzUxNjY5NTYxNA==&mid=2247485155&idx=1&sn=0ceeecc5ca1385049b39a81bedcaecfa&scene=21#wechat_redirect)
- [二叉树：构造一棵搜索树](https://mp.weixin.qq.com/s?__biz=MzUxNjY5NTYxNA==&mid=2247485194&idx=1&sn=5d28e786feca7c956763269e9ed00f50&scene=21#wechat_redirect)
- [二叉树：搜索树转成累加树](https://mp.weixin.qq.com/s?__biz=MzUxNjY5NTYxNA==&mid=2247485212&idx=1&sn=8f88ae1db8680f906489cbef942f23f8&scene=21#wechat_redirect)
- [二叉树：总结篇！（需要掌握的二叉树技能都在这里了）](https://mp.weixin.qq.com/s?__biz=MzUxNjY5NTYxNA==&mid=2247485225&idx=1&sn=c6c97ea1234aa671287c6a4fe8392dba&scene=21#wechat_redirect)

### 回溯算法

- [关于回溯算法，你该了解这些！](https://mp.weixin.qq.com/s?__biz=MzUxNjY5NTYxNA==&mid=2247485237&idx=1&sn=1bae4c3d0d3965af44878093a5a49f58&scene=21#wechat_redirect)
- [视频来了！！带你学透回溯算法（理论篇）](https://mp.weixin.qq.com/s?__biz=MzUxNjY5NTYxNA==&mid=2247485579&idx=1&sn=0bf73304bffb7c2fbbaee2bf6b9fc5d0&scene=21#wechat_redirect)
- [回溯算法：求组合问题！](https://mp.weixin.qq.com/s?__biz=MzUxNjY5NTYxNA==&mid=2247485253&idx=1&sn=8332edaabc9bf43e45835bce7964ce88&scene=21#wechat_redirect)
- [视频来了！！回溯算法：组合问题](https://mp.weixin.qq.com/s?__biz=MzUxNjY5NTYxNA==&mid=2247485751&idx=1&sn=2e1e5ceeaaa86a6c1dc7b3170a8370cd&scene=21#wechat_redirect)
- [回溯算法：组合问题再剪剪枝](https://mp.weixin.qq.com/s?__biz=MzUxNjY5NTYxNA==&mid=2247485264&idx=1&sn=860006efeb344db329b555a8b2711769&scene=21#wechat_redirect)
- [视频来了！！回溯算法：组合问题的剪枝操作](https://mp.weixin.qq.com/s?__biz=MzUxNjY5NTYxNA==&mid=2247485846&idx=1&sn=42ccc48a7b46ec3b92da2c16e9d1c41c&scene=21#wechat_redirect)
- [回溯算法：求组合总和！](https://mp.weixin.qq.com/s?__biz=MzUxNjY5NTYxNA==&mid=2247485277&idx=1&sn=0553db6b5c5952094d536ae2b8c18124&scene=21#wechat_redirect)
- [回溯算法：电话号码的字母组合](https://mp.weixin.qq.com/s?__biz=MzUxNjY5NTYxNA==&mid=2247485295&idx=1&sn=35bd6c240a5a59d7ea6d9f98c09e7dbd&scene=21#wechat_redirect)
- [本周小结！（回溯算法系列一）](https://mp.weixin.qq.com/s?__biz=MzUxNjY5NTYxNA==&mid=2247485330&idx=1&sn=86d963c0cf3db8568217aed1760181dc&scene=21#wechat_redirect)
- [回溯算法：求组合总和（二）](https://mp.weixin.qq.com/s?__biz=MzUxNjY5NTYxNA==&mid=2247485343&idx=1&sn=2c7e259454411002d2c6e0e39cc0b939&scene=21#wechat_redirect)
- [视频来了！！回溯算法：组合总和](https://mp.weixin.qq.com/s?__biz=MzUxNjY5NTYxNA==&mid=2247486047&idx=1&sn=6fa0a42e581aec8644d11407cdbd7034&scene=21#wechat_redirect)
- [回溯算法：求组合总和（三）](https://mp.weixin.qq.com/s?__biz=MzUxNjY5NTYxNA==&mid=2247485360&idx=1&sn=2256a0f01a304d82a2b59252327f3edb&scene=21#wechat_redirect)
- [回溯算法：分割回文串](https://mp.weixin.qq.com/s?__biz=MzUxNjY5NTYxNA==&mid=2247485372&idx=1&sn=29cc3421fb742faa57824b9a626342ad&scene=21#wechat_redirect)
- [回溯算法：复原IP地址](https://mp.weixin.qq.com/s?__biz=MzUxNjY5NTYxNA==&mid=2247485390&idx=1&sn=e95ad5b1c40f06fc18cd3fec54fd1cbc&scene=21#wechat_redirect)
- [回溯算法：求子集问题！](https://mp.weixin.qq.com/s?__biz=MzUxNjY5NTYxNA==&mid=2247485402&idx=1&sn=6963af3e2aa8d58e41b71d73d53ea8f6&scene=21#wechat_redirect)
- [本周小结！（回溯算法系列二）](https://mp.weixin.qq.com/s?__biz=MzUxNjY5NTYxNA==&mid=2247485435&idx=1&sn=6db97ae35adf8e983aa41102dc68dca8&scene=21#wechat_redirect)
- [回溯算法：求子集问题（二）](https://mp.weixin.qq.com/s?__biz=MzUxNjY5NTYxNA==&mid=2247485446&idx=1&sn=ef48986a30c3ed0e8e116dfd8fca93db&scene=21#wechat_redirect)
- [回溯算法：递增子序列](https://mp.weixin.qq.com/s?__biz=MzUxNjY5NTYxNA==&mid=2247485466&idx=1&sn=2b5420bca9b66356d777bc4530a224c5&scene=21#wechat_redirect)
- [回溯算法：排列问题！](https://mp.weixin.qq.com/s?__biz=MzUxNjY5NTYxNA==&mid=2247485493&idx=1&sn=2b5a4e977fb2a2635859bd0cc831db64&scene=21#wechat_redirect)
- [回溯算法：排列问题（二）](https://mp.weixin.qq.com/s?__biz=MzUxNjY5NTYxNA==&mid=2247485514&idx=1&sn=29aa5828c0847fe39d2ea90804fba69e&scene=21#wechat_redirect)
- [本周小结！（回溯算法系列三）](https://mp.weixin.qq.com/s?__biz=MzUxNjY5NTYxNA==&mid=2247485532&idx=1&sn=d341f09725185a6a21e5241e44bd955b&scene=21#wechat_redirect)
- [本周小结！（回溯算法系列三）续集](https://mp.weixin.qq.com/s?__biz=MzUxNjY5NTYxNA==&mid=2247485561&idx=1&sn=872812aad2a973bbd6260e9aeeb82e0e&scene=21#wechat_redirect)
- [回溯算法：重新安排行程](https://mp.weixin.qq.com/s?__biz=MzUxNjY5NTYxNA==&mid=2247485596&idx=1&sn=4a6ab3905fb1076cbb7f78673ef8afad&scene=21#wechat_redirect)
- [回溯算法：N皇后问题](https://mp.weixin.qq.com/s?__biz=MzUxNjY5NTYxNA==&mid=2247485624&idx=1&sn=d560c3a277e1badedc0fa05b8effae87&scene=21#wechat_redirect)
- [回溯算法：解数独](https://mp.weixin.qq.com/s?__biz=MzUxNjY5NTYxNA==&mid=2247485641&idx=1&sn=defa346970f61bbaddb17045e0b83bc7&scene=21#wechat_redirect)
- [一篇总结带你彻底搞透回溯算法！](https://mp.weixin.qq.com/s?__biz=MzUxNjY5NTYxNA==&mid=2247485710&idx=1&sn=feafefbf9e5b656832999b70df6cb321&scene=21#wechat_redirect)

### 贪心

- [关于贪心算法，你该了解这些！](https://mp.weixin.qq.com/s?__biz=MzUxNjY5NTYxNA==&mid=2247485767&idx=1&sn=38e1b8e7b9f59f4a8dcaa0ffed545925&scene=21#wechat_redirect)
- [贪心算法：分发饼干](https://mp.weixin.qq.com/s?__biz=MzUxNjY5NTYxNA==&mid=2247485783&idx=1&sn=8cbdef0e8e7ebe4e53f5e943ae3bebeb&scene=21#wechat_redirect)
- [贪心算法：摆动序列](https://mp.weixin.qq.com/s?__biz=MzUxNjY5NTYxNA==&mid=2247485801&idx=1&sn=b9d69b9df171995701540c18d671a12b&scene=21#wechat_redirect)
- [贪心算法：最大子序和](https://mp.weixin.qq.com/s?__biz=MzUxNjY5NTYxNA==&mid=2247485816&idx=1&sn=ff4b2a495e67a6b16d41c03f48f3710b&scene=21#wechat_redirect)
- [本周小结！（贪心算法系列一）](https://mp.weixin.qq.com/s?__biz=MzUxNjY5NTYxNA==&mid=2247485825&idx=1&sn=ff9a2f8a296d27b32a07dcc552277323&scene=21#wechat_redirect)
- [贪心算法：买卖股票的最佳时机II](https://mp.weixin.qq.com/s?__biz=MzUxNjY5NTYxNA==&mid=2247485859&idx=1&sn=88df4905582a9a3e9280ed58632ebb0d&scene=21#wechat_redirect)
- [贪心算法：跳跃游戏](https://mp.weixin.qq.com/s?__biz=MzUxNjY5NTYxNA==&mid=2247485873&idx=1&sn=1f9bb0dec9132986fb7805644e5e7e87&scene=21#wechat_redirect)
- [贪心算法：跳跃游戏II](https://mp.weixin.qq.com/s?__biz=MzUxNjY5NTYxNA==&mid=2247485894&idx=1&sn=61d54f00879831daf3aae3a2206f6c4e&scene=21#wechat_redirect)
- [贪心算法：K次取反后最大化的数组和](https://mp.weixin.qq.com/s?__biz=MzUxNjY5NTYxNA==&mid=2247485903&idx=1&sn=dad129af4ef5e9ea9a2592698ddadec4&scene=21#wechat_redirect)
- [本周小结！（贪心算法系列二）](https://mp.weixin.qq.com/s?__biz=MzUxNjY5NTYxNA==&mid=2247485920&idx=1&sn=f73e4df546f09daf5df1e77ff484b58d&scene=21#wechat_redirect)
- [贪心算法：加油站](https://mp.weixin.qq.com/s?__biz=MzUxNjY5NTYxNA==&mid=2247486064&idx=1&sn=3903b6ac8f012434137d8c727bfa3f50&scene=21#wechat_redirect)
- [贪心算法：分发糖果](https://mp.weixin.qq.com/s?__biz=MzUxNjY5NTYxNA==&mid=2247486077&idx=1&sn=2c29600af216bd9bcc38b91282f2b401&scene=21#wechat_redirect)
- [贪心算法：柠檬水找零](https://mp.weixin.qq.com/s?__biz=MzUxNjY5NTYxNA==&mid=2247486087&idx=1&sn=2be1a9e0a09e9907a782b830e01d9c79&scene=21#wechat_redirect)
- [贪心算法：根据身高重建队列](https://mp.weixin.qq.com/s?__biz=MzUxNjY5NTYxNA==&mid=2247486113&idx=1&sn=e252599f78d28e7c88d21bcaa19fbba6&scene=21#wechat_redirect)
- [本周小结！（贪心算法系列三）](https://mp.weixin.qq.com/s?__biz=MzUxNjY5NTYxNA==&mid=2247486136&idx=1&sn=dca8c1d8ba6e7e7ef165de7f16f4f360&scene=21#wechat_redirect)
- [贪心算法：根据身高重建队列（续集）](https://mp.weixin.qq.com/s?__biz=MzUxNjY5NTYxNA==&mid=2247486151&idx=1&sn=bae78c8b74b3ac74e6c8c1ee6b44b9a9&scene=21#wechat_redirect)
- [贪心算法：用最少数量的箭引爆气球](https://mp.weixin.qq.com/s?__biz=MzUxNjY5NTYxNA==&mid=2247486176&idx=1&sn=20950b34749df919a2d2119abd1d32ec&scene=21#wechat_redirect)
- [贪心算法：无重叠区间](https://mp.weixin.qq.com/s?__biz=MzUxNjY5NTYxNA==&mid=2247486198&idx=1&sn=45e3c0d0d98657f47196fa5b8e4914fc&scene=21#wechat_redirect)
- [贪心算法：划分字母区间](https://mp.weixin.qq.com/s?__biz=MzUxNjY5NTYxNA==&mid=2247486211&idx=1&sn=14a6164648d7ac32a157bd4b3049cc3b&scene=21#wechat_redirect)
- [贪心算法：合并区间](https://mp.weixin.qq.com/s?__biz=MzUxNjY5NTYxNA==&mid=2247486227&idx=1&sn=d79f71ba0e779f7982ed19a8347d2842&scene=21#wechat_redirect)
- [本周小结！（贪心算法系列四）](https://mp.weixin.qq.com/s?__biz=MzUxNjY5NTYxNA==&mid=2247486244&idx=1&sn=ef61230dd737f32c5750d56d7c4879c5&scene=21#wechat_redirect)

目前在公众号「代码随想录」正在讲解贪心算法系列，持续更新中！

### 动态规划

贪心 -> 动态规划

### 图论

贪心 -> 动态规划 -> 图论

## 总结

这里我重点强调一下：**经典题目不是刷一遍就完事的，要刷很多遍**，因为大家在刷某个专题的时候，一定会忘一些之前的知识，例如刷到了贪心，可能回溯就已经有点想不起来了。

**所以一定要多刷，加深记忆，然后面试之前一段时间就开始看各个专题的总结篇，进行快速回顾**。







-------------------------------------

# 知乎

> 作者：[胖君](https://www.zhihu.com/question/280279208/answer/499663699)
> 来源：知乎

从第一题`Two Sum`开始，默默刷了一年多，算不上经验吧，就是我自己的一点碎碎念。没什么条理，想到哪儿写到哪儿。

刷题我见过两种流派，一种**【兔系】**，一种**【龟系】**。

## 龟篇

我自己是比较偏“龟系”的刷法【传送 >[ciaoshen.com](https://link.zhihu.com/?target=http%3A//ciaoshen.com/)】**。**从一开始为了找工作，每天4，5题，到后来慢慢变成一种习惯，每天早上起来，喝两口咖啡先来一发。我个人比较信奉Peter Norvig的 “**十年理论**”。之前Dave Thomas提出的 ”Code Kata“ 也是类似的概念，核心理念就是 “**刻意训练**” 。现在刷leetcode就是我坚持的“刻意训练”的一部分。日常工作里调调参数，修修Bug，用用框架实际上达不到”刻意训练“的标准。像leetcode这样的OJ正好提供了这样一个”道场“不是很好吗。

我们有的时候过分注重了算法题的“算法意义”，而忽略了”**工程意义**“。题刷多了就知道，常用套路其实来来回回就那么几个。但明确了算法，能不能准确地实现，做到bug free又是另一回事。再进一步，数据结构用的合不合理，也会影响最终效率。代码写出来，别人好不好懂，又是另一个层面的要求。最后要参加面试，又必须在规定时间里完成，不但要写的快，代码还要干净，符合工程规范。

所以**”龟系“刷法的精髓就是每个题目要做干净**。不要满足于一种解法，各种解法都写一写。我现在accept了350+题，用了1000多种方法。平均每题2~3个Solution。基本每题都做到`beats 90+%`。 

![](https://pic4.zhimg.com/50/v2-15fd47d56efcae3a9b4d3984a845c757_hd.jpg?source=1940ef5c)![img](https://pic4.zhimg.com/80/v2-15fd47d56efcae3a9b4d3984a845c757_720w.jpg?source=1940ef5c)350+Problems / 1000+Solutions

最好不要满足于accept，要追求最高效率。做一题就要杀死一题。leetcode不是给了运行时间的分布吗，基本上每个波峰都代表了一种特定复杂度的算法，中间的起伏体现的就是具体实现细节的差距。每次都要向最前面的波峰努力啊>.<。追逐最前一个波峰的过程不但锻炼算法，还锻炼数据结构，锻炼对库函数的熟悉程度。经常比较不同数据结构不同库函数的效率，时间久了能产生一种直觉，以后一出手就是最优选择。（小贴士：点开竖直的分布条，是可以看到对应代码的，对学习高手的解法很有帮助。）

![](https://pic2.zhimg.com/50/v2-d4223261525870a4c77f1e550ccc5bc8_hd.jpg?source=1940ef5c)![img](https://pic2.zhimg.com/80/v2-d4223261525870a4c77f1e550ccc5bc8_720w.jpg?source=1940ef5c)

但“龟系”不是说在一道题上耗死。越是龟系越要注意时间上要掌握好分寸，能解出来最好，解不出来也不要倔强。我觉得比较好的一个平衡点差不多是“**一个小时”**。如果一个小时还是解决不了可以点开右边`Related Topics`链接看提示。还是不能解决就看讨论区。 

现在一年多坚持下来，最大的收获不是知道了多少算法套路，而是代码硬能力上的进步。之前经常会卡在一些实现细节的地方，现在只要整体方向确定下来业务逻辑捋清楚，具体实现编码反而是最轻松的工作。这就是为什么大厂面试要考算法。功底好的工程师才有精力腾出来考虑工程，产品方面的问题。

## 兔篇

“兔系“更加符合”刷题“的说法，就是按标签刷，按公司刷。今天做`binary tree`就一下子做10，20题。很多人可能对这个做法有点抵触，觉得太功利，没有思考的过程。当初我也有这个偏见。但后来发现很多最后拿到FLAG offer的大神都这么干。而且过程之暴力令人发指。记得有个大神刷到第三遍，每天可以做80+题。拿到题根本不思考，直接在自带编辑框开始码，而且还基本做到bug free。

我也不知道他是不是在吹，但**“兔系”的精髓就是要暴力，天马流星拳，大力出奇迹**。有的人提倡”不要看答案“。这种观点我觉得是对的，像我自己就很少看答案。但作为兔系选手，讲求的就是要疯，**不如一上来就看答案，就照着答案写。**这个做法看起来不靠谱，其实它有内在的合理性：**大部分算法都不是我们发明的**。什么动态规划，二叉树，线段树，并查集，贪心算法，到后来所谓的不看答案自己做出来，其实都是在用固定套路。到最后你看那些acmer高手，看似思路很快，其实就是知道的套路比你多，而且不是多一点。所以既然明确了是为了找工作的目标，那就放下矜持，放下承见，拿到offer比什么都强，哪怕是以一种羊癫疯的姿势。



最后，刷题呢工具一定要用起来。比如我用Java刷，什么`ant`, `gradle`, `junit`, `log4j`, `slf4j`都用起来。可以省去很多搭环境，搭框架的时间，把精力都集中在解决算法上。leetcode 最近出了一个`Playground`我就觉得很好呀，直接在网页上写代码省去了很多麻烦。但我也提个小意见，就是如果能更完整地支持 vim 就更好了。现阶段我还是不得不自己开编辑器。这里给大家安利一个一键生成 "Solution/Test" 框架的小工具`leetcode-helper`。 

[helloShen/leetcode-helpergithub.com](https://link.zhihu.com/?target=https%3A//github.com/helloShen/leetcode-helper)

> 下载地址（最新v0.55）:
>
> - 【[leetcode-helper-v0.55.tar](https://link.zhihu.com/?target=https%3A//github.com/helloShen/leetcode-helper/releases/download/v0.55/leetcode-helper-v0.55.tar)】
> - 【[leetcode-helper-v0.55.tar.gz](https://link.zhihu.com/?target=https%3A//github.com/helloShen/leetcode-helper/releases/download/v0.55/leetcode-helper-v0.55.tar.gz)】
> - 【[leetcode-helper-v0.55.zip](https://link.zhihu.com/?target=https%3A//github.com/helloShen/leetcode-helper/releases/download/v0.55/leetcode-helper-v0.55.zip)】

一行命令`ant generate`，生成支持`Junit`和`log4j/slf4j`的 `**Solution/Test/TestRunner**` 骨架类，

<video class="ztext-gif GifPlayer-gif2mp4" src="https://vdn1.vzuu.com/SD/b10f3f84-23ac-11eb-a57f-e6c48c183865.mp4?disable_local_cache=1&amp;auth_key=1622520513-0-0-58277ed3e8cadf898c346793b871d5e4&amp;f=mp4&amp;bu=pico&amp;expiration=1622520513&amp;v=hw" data-thumbnail="https://pic1.zhimg.com/50/v2-d0b6e9e0bfa8c421e3b0a9dc7603393d_hd.jpg?source=1940ef5c" poster="https://pic1.zhimg.com/50/v2-d0b6e9e0bfa8c421e3b0a9dc7603393d_hd.jpg?source=1940ef5c" data-size="normal" preload="metadata" loop="" playsinline=""></video>

![img](https://pic1.zhimg.com/50/v2-d0b6e9e0bfa8c421e3b0a9dc7603393d_hd.jpg?source=1940ef5c)

一行命令生成Solution以及Junit单元测试骨架

一行命令`ant compile test`，实现编译以及JUnit单元测试。 

<video class="ztext-gif GifPlayer-gif2mp4" src="https://vdn1.vzuu.com/SD/722beee0-236e-11eb-a9bc-fec7f4fa9e0f.mp4?disable_local_cache=1&amp;auth_key=1622520513-0-0-61787cd13a0474681156bcdf5e7a0c59&amp;f=mp4&amp;bu=pico&amp;expiration=1622520513&amp;v=hw" data-thumbnail="https://pic1.zhimg.com/50/v2-75912eaa385c4d3f65c18234b02aa298_hd.jpg?source=1940ef5c" poster="https://pic1.zhimg.com/50/v2-75912eaa385c4d3f65c18234b02aa298_hd.jpg?source=1940ef5c" data-size="normal" preload="metadata" loop="" playsinline=""></video>

![img](https://pic1.zhimg.com/50/v2-75912eaa385c4d3f65c18234b02aa298_hd.jpg?source=1940ef5c)

一行命令编译，运行JUnit单元测试

而且附带了一个leetcode常用数据结构包`com.ciaoshen.leetcode.util`。 像常用的比如`ListNode`，`TreeNode`的基本实现都有了。

现在每天早上拿着我的煎饼果子和咖啡，一键生成骨架，开编辑器就坐下来写算法，然后一键测试，提交。然后该干嘛干嘛。leetcode真的成了我的一种生活方式。不求名，不求利，但求无愧于心，干一行爱一行。



>基础差的如果想刷题当做快速提升，可以照着兔系快速积累套路，然后再重回龟系磨炼？





-----

> 作者：[匿名用户](https://www.zhihu.com/question/280279208/answer/553161466)
> 来源：知乎



下面是之前的回答：

\--------

lz在加拿大。

先贴一个自己的刷题的进度吧：

![](https://pic2.zhimg.com/50/v2-2f1577e507fa7b8ad12ac882c2124d1b_hd.jpg?source=1940ef5c)![img](https://pic2.zhimg.com/80/v2-2f1577e507fa7b8ad12ac882c2124d1b_720w.jpg?source=1940ef5c)

到目前为止，一共刷了539题 (更新于2021年1月)。

通过刷题，拿了很多公司（IBM, Google, Amazon, Microsoft, Zenefits, Splunk, Facebook）的面试以及offer。这500+题不是简单的刷一遍就过去的，而是反复练习，直到代码最优，解法最优（有时候甚至觉得自己的代码精简到一个符号都无法减少的地步）。所以有时候面试官问问题，问题还没说完，我就知道应该如何表述自己的心路历程，然后慢慢地给出最优解。

而这一切的关键就在于：做笔记！

下面是我的笔记截图：

![](https://pic1.zhimg.com/50/v2-3461589c1227f699fa351c80dcf8ce87_hd.jpg?source=1940ef5c)

![](https://pic1.zhimg.com/80/v2-3461589c1227f699fa351c80dcf8ce87_720w.jpg?source=1940ef5c)

对于遇到的每个题目，事后我都做上标记：普通题目，难题、好题。此外，每个题目都分为以下几个步骤做好详细的笔记：

1. 原题目

2. 自己的第一遍解法

3. 网上好的解法

4. 自己可以改进的地方

5. 进一步精简优化自己的代码直至代码简无可简（**这是非常关键的一步，到达这一步，才会发现获得能力的提升远远要超过简单地把题目解出来**）

6. 获得的思考（或者学习到的地方，可以是算法、数据结构或者Java的特性—例如Stream等等）

   

每一个题目都经过至少一遍这样的迭代。这样几遍下来，我对于每个题目都有了更加深刻的理解，大部分的题目我都有自信能够写出最优解甚至代码都是最优化的（至少比论坛回复里面的最高票答案还要精简）。



举个例子，[Two Sum](https://link.zhihu.com/?target=https%3A//leetcode.com/problems/two-sum/)问题。

我最早的解法是暴力搜索。当时的代码(C++)是这样的：

```cpp
class Solution {
public:
  vector<int> twoSum(vector<int> &numbers, int target) {
    // Start typing your C/C++ solution below
    // DO NOT write int main() function
    vector<int> index(2, 0);
    if (numbers.empty() || numbers.size() == 1)
      return index;
    
    for (int i = 0; i < numbers.size()-1; ++i) {
      // j should start from i+1
      for (int j = i+1; j < numbers.size(); ++j) {
        if (numbers[i] + numbers[j] == target) {
          index.clear();
          index.push_back(i+1);
          index.push_back(j+1);
          break;
        }
      }
    }
    return index;
  }
}
```

这个解法不仅复杂度高，而且代码冗长繁琐。



后来看了网上高票答案的解法，知道了用hashmap来做，于是写出了优化的代码(Java)：

```java
public int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> map = new HashMap<>(); 
    int[] result = {-1, -1};  
    for (int i = 0; i < nums.length; ++i) { 
        if (map.containsKey(target - nums[i])) {   
            result[0] = map.get(target - nums[i]); 
            result[1] = i; 
            break; 
        }  
        map.put(nums[i], i); 
    }  
    return result; 
}
```

再后来，对代码进行了一些细节的简化：

```java
public class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap();
        
        for (int i = 0; i < nums.length; ++i) {
            if (map.containsKey(target- nums[i])) {
                return new int[]{map.get(target- nums[i]), i};
            }
            map.put(nums[i], i);
        }
        return int[]{-1, -1};
    }
}
```

至此，代码几乎达到最精简状态。（中间有略去几次迭代）总之，**不断地学习别人的代码，改进自己的代码，不断地锤炼自己的代码，直至算法最优化，代码最简洁**！潜移默化中，不仅对题目解法有了更深刻的理解（什么是最优解），而且也知道如何用最简洁的代码实现这个最优解。

再举个**极端的例子**吧，179. Largest Number，这个题目我最后精简成的代码如下：

```java
public String largestNumber(int[] nums) { 
    return Arrays.stream(nums) 
    .mapToObj(String::valueOf) 
    .sorted((s1, s2) -> (s2 + s1).compareTo(s1 + s2)) 
    .reduce((s1, s2) -> s1.equals("0") ? s2 : s1 + s2).get(); 
}
```

我本人不是算法高手，算是勤能补拙类型。这样长期坚持下来，慢慢地感觉自己编程能力提升了很多。不仅面试的时候得心应手，而且在工作中提交code review的时候，往往有自信说自己的代码是简单，干净与优雅的。

---------------------------



> 相关链接：
>
> [GitHub - Carl Sun](https://github.com/youngyangyang04)	---- 代码随想录号主
>
> [大家都是如何刷 LeetCode 的？ - lucifer的回答 - 知乎](https://www.zhihu.com/question/280279208/answer/824585814)
>
> [图解算法 - GitHub](https://github.com/MisterBooo/LeetCodeAnimation)
>
> https://github.com/azl397985856/leetcode
>
> https://leetcode-solution-leetcode-pp.gitbook.io/leetcode-solution/



