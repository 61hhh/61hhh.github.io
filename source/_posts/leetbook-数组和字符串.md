---
title: leetbook-数组和字符串
date: 2020-12-06 17:27:41
tags: leetcode
categories: 基础
---

`leetcode`上的探索专栏很不错，顺着他的顺序去刷题能比较系统的清晰的锻炼一下。

`leetbook`-->数组和字符串

> PS: 玩了一个月啥也没干。。。还是要找点事做，免得焦虑

<!--more-->

# 数组和字符串

## 数组简介

### 寻找数组的中心索引

**思路**：前缀和——中心索引左右两边和相等，所以先sum求出总和，然后计算右边是否等于左边`left == sum-left-nums[i]`，满足就返回，不满足就右移，直到结束。时间复杂度O(N)空间复杂度O(1)

完整代码：

```java
class Solution {
    public int pivotIndex(int[] nums) {
        int sum=0,left=0;
        for(int s:nums) sum+=s;
        for(int i=0;i<nums.length;i++){
            if(left== sum-left-nums[i]){
                return i;
            }
            left+=nums[i];
        }
        return -1;
    }
}
```



### 搜索插入位置

**思路**：简单的二分查找代码。（当然由于数组已经有序了，直接遍历一遍也行）

完整代码：

```java
class Solution {
    public int searchInsert(int[] nums, int target) {
        int left=0,right=nums.length-1;
        while(left<=right){
            int mid = left+(right-left)/2;
            if(nums[mid]==target)
                return mid;
            else if(nums[mid]<target)
                left = mid+1;
            else 
                right = mid-1;            
        }
        return right+1;
    }
}
```



### 合并区间

思路：题目是要判断重叠区间，类似算法笔记贪心

完整代码：

```java
//参考算法笔记 区间贪心，寻找不相交区间
class Solution {
    public int[][] merge(int[][] intervals) {
        //按起始位置由小到大排序
        Arrays.sort(intervals,(v1,v2)-> v1[0]-v2[0] );
        //存放每一个内部的数组
        int[][] ans = new int[intervals.length][2];
        int index = -1;
        for(int[] interval:intervals){
            //当前数组起始位置 > ans最后数组的结束位置
            //将当前数组加入ans
            if(index==-1 || interval[0]>ans[index][1])
                ans[++index] = interval;
            //否则将当前区间加到ans最后数组
            else
                ans[index][1] = Math.max(ans[index][1],interval[1]);
        }
        return Arrays.copyOf(ans, index + 1);
    }
}
```



## 二维数组简介

### 旋转矩阵

对于矩阵中第 i 行的第 j 个元素，在旋转后，它出现在倒数第 i 列的第 j 个位置。

matrix [row] [col] --> matrix [col] [n-1-row]

思路一：用辅助数组存储临时旋转的结果

复杂度：时间O(N^2) 空间O(N^2)



思路二：原地旋转，前一个的列是旋转结果的行，前一个的行倒数过来是结果的列

一次旋转交换四个位置

[row,col] --> [col,n-1-row] --> [n-1-row,n-1-col] --> [n-1-col,row] --> [row,col]

n为偶数：n^2/4 = n/2 * n/2，左上角四分之一区域

n为奇数：(n^2-1)/4 = (n-1)/2 * (n+1)/2，左上角(n-1)/2,(n+1)/2区域

注：赋值的时候反过来



思路三：用翻转代替旋转，做两次翻转结果也是一样

水平翻转   ：matrix [row] [col] = matrix [n-1-row] [col]

+主对角线翻转  ：matrix [row] [col] = matrix [col] [row]

= 联立结果    ：matirx [row] [col] = matrix [col] [n-1-row]

注：水平+对角线-->顺时针 对角线+水平-->逆时针

```java
//思路二：原地翻转
class Solution {
    public void rotate(int[][] matrix) {
        int n = matrix.length;
        for(int row=0;row<n/2;row++){
            for(int col=0;col<(n+1)/2;col++){
                int tmp = matrix[row][col];
                matrix[row][col] = matrix[n-1-col][row];
                matrix[n-1-col][row] = matrix[n-1-row][n-1-col];
                matrix[n-1-row][n-1-col] = matrix[col][n-1-row];
                matrix[col][n-1-row] = tmp;
            }
        }
    }
}
//思路三
class Solution {
    public void rotate(int[][] matrix) {
        int n = matrix.length;
        //水平翻转
        for(int i=0;i < n/2;i++){
            for(int j=0;j<n;j++){
                int tmp = matrix[i][j];
                matrix[i][j] = matrix[n-1-i][j];
                matrix[n-1-i][j] = tmp;
            }
        }
        //对角线翻转
        for(int i=0;i<n;i++){
            for(int j=0;j<i;j++){
                int tmp = matrix[i][j];
                matrix[i][j] = matrix[j][i];
                matrix[j][i] = tmp;
            }
        }
    }
}
```



### 零矩阵

思路：数组中只要某个位置`matrix[i][j] = 0`那么对应`i`行`j`列全置0，所以可以用两个数组记录行列中出现0的情况，遍历二维数组做处理

```java
class Solution {
    public void setZeroes(int[][] matrix) {
        boolean[] row = new boolean[matrix.length];
        boolean[] col = new boolean[matrix[0].length];
        //记录0出现的行列值
        for(int i=0;i<matrix.length;i++){
            for(int j=0;j<matrix[0].length;j++){
                if(matrix[i][j]==0){
                    row[i] = true;
                    col[j] = true;
                }
            }
        }
        //清理行
        for(int i=0;i<matrix.length;i++){
            if(row[i]){
                for(int j=0;j<matrix[0].length;j++)
                    matrix[i][j] = 0;
            }
        }
        //清理列
        for(int i=0;i<matrix[0].length;i++){
            if(col[i]){
                for(int j=0;j<matrix.length;j++)
                    matrix[j][i] = 0;
            }
        }
    }
}
```



## 字符串简介

### 最长公共前缀

思路一：横向扫描方式，一次遍历比较字符串，更新前缀prefix，遍历完后就可以得到最长前缀。

时间复杂度O(mn)，m是字符串平均长度，n是字符串数量；空间复杂度O(1)

思路二：纵向扫描，从前往后遍历所有字符串的第一列，相同列上字符相同就继续，否则就返回

还有其他方法例如分治、二分查找等

```java
class Solution {
    public String longestCommonPrefix(String[] strs) {
        if(strs == null || strs.length ==0){
            return "";
        }
        String prefix = strs[0];
        int count = strs.length;
        for(int i=1;i<count;i++){
            prefix = lcp(prefix,strs[i]);
            if(prefix.length() == 0)
                break;
        }
        return prefix;
    }

    //获取两个字符串的lcp
    public String lcp(String s1,String s2){
        int len = Math.min(s1.length(),s2.length());
        int index = 0;
        while(index<len && s1.charAt(index)==s2.charAt(index))
            index++;
        return s1.substring(0,index);
    }
}

class Solution {
    public String longestCommonPrefix(String[] strs) {
        if (strs == null || strs.length == 0) {
            return "";
        }
        int length = strs[0].length();//字符串长度
        int count = strs.length;//字符串数量
        //每个字符串逐列进行比较
        for (int i = 0; i < length; i++) {
            char c = strs[0].charAt(i);
            for (int j = 1; j < count; j++) {
                //第j个字符串长度即为i || 对应位置字符不同
                if (i == strs[j].length() || strs[j].charAt(i) != c) {
                    return strs[0].substring(0, i);
                }
            }
        }
        return strs[0];
    }
}
```



### 最长回文子串

思路：暴力法枚举所有子串，验证是否为回文串，可以添加剪枝`j-i+1>maxLen`，只有串长比maxLen大才判断。时间复杂度O(N^3)，这个暴力法自己写的都有问题。。参考一下别人的改出来

```java
class Solution {
    public String longestPalindrome(String s){
        int len = s.length();
        if(len<2){
            return s;
        }
        int maxLen = 1;
        int begin = 0;
        //s.charAt(i)每次都会检查数组下标越界，因此先转换成字符数组
        char[] charArray = s.toCharArray();
        //枚举所有长度达于1的子串charArray[i...j]
        for(int i=0;i<len-1;i++){
            for(int j=i+1;j<len;j++){
                if(j-i+1>maxLen && validPalindromic(charArray,i,j)){
                    maxLen = j-i+1;
                    begin = i;
                }
            }
        }
        return  s.substring(begin,begin+maxLen);
    }
    /*
    * 验证子串s[left...right]是否为回文串
     */
    private boolean validPalindromic(char[] charArray,int left,int right){
        while(left<right){
            if(charArray[left]!=charArray[right]){
                return false;
            }
            left++;
            right--;
        }
        return true;
    }
}
```

别人的思路：动态规划。回文串具有天然的状态转移性质——一个回文串去掉首尾两个字符还是回文串。所以可以从两端判断：两端不等必然不是，相等再看里面

1. 定义状态：`dp[i][j]`表示`s[i...j]`是否为回文子串

2. 状态转移方程:`dp[i][j]==(s[i]==s[j]) and dp[i+1][j-1]`

   动态规划就是填二维表，由于`i<=j`所以只看对角线以上

   还要考虑`dp[i+1][j-1]`可能存在边界情况。边界条件：`(j-1)-(i+1)+1<2 --> j-i<3`即字符串长度为2或3的时候直接判断

3. 判断结论：如果子串 `s[i+1..j-1]` 只有 1 个字符，即去掉两头，剩下中间部分只有1个字符，显然是回文；如果子串`s[i+1..j-1]`为空串，那么子串`s[i, j]`一定是回文子串。

4. 初始化：单个字符肯定是回文串，所以对角线即`dp[i][i]=true`，不过但单个字符也不会被其他状态值参考，基本可以去除

5. 输出：只要得到`dp[i][j]=true`就记录字串长度和起始位置

```java
class Solution {
    public String longestPalindrome(String s) {
        int len = s.length();
        if(len>2)	return s;
        int manLen = 1;
        int begin = 0;
        //dp[i][j]
        boolean[][] dp = new boolean[len][len];
        char[] charArray = s.toCharArray();
        for(int i=0;i<len;i++)
            do[i][i] = true;
        for(int j=1;j<len;j++){
            for(int i=0;i<j;i++){
                if(charArray[i]!=charArray[j])
                    dp[i][j] = false;
        		else{
                    if(j-i<3)	dp[i][j]=true;
                    else		dp[i][j]=dp[i+1][j-1];
                }
                //dp[i][j]==true表示子串s[i...j]是回文串，记录长度和起始位置
                if(dp[i][j]&&j-i+1>maxLen){
                    maxLen = j-i+1;
                    begin = i;
                }
            }
        }
        return s.substring(begin,begin+maxLen);
    }
}
```

别人的思路：中心扩散。除了从左右两端来判断，回文串也可以从中间往两边扩散。基本想法是遍历每一个索引，以该索引为中心利用回文串对称的特点往两边扩散  





### 翻转字符串里的单词

思路：一开始没想到用库函数，想着直接遍历s，开一个String数组存放单词，遇到空格就表示一个单词结束，所以只要`s.charAt(i)!=' '`的话就`word[num]+=s.charAt(i)`，遇到空格单词入栈和`num++`，然后将栈中元素拼接，思路没错，就是太麻烦了，效率也非常低

```java
class Solution {
    public String reverseWords(String s) {
        s+=" ";
        int len = s.length();
        String[] word = new String[10010];
        Stack<String> stack = new Stack<>();
        int num=0;
        for(int i=0;i<10010;i++){
            word[i]="";
        }
        for(int i=0;i<len;i++){
            if(s.charAt(i)!=' '){
                word[num] += s.charAt(i);
            }else{
                stack.push(word[num]);
                num++;
            }
        }
        String ss="";
        while(!stack.isEmpty()){
            ss+=stack.peek();
            if(stack.size()>1&&stack.peek()!=""){
                ss+=" ";
            }
            stack.pop();
        }
        ss=ss.trim();
        return ss;
    }
}
```

问题一：遇到`" hello world!"`会输出`" world! hello "`而不是预期的`"world! hello"`。。。在后面处理一下`ss=ss.trim()`

问题二：遇到`"a good   example"`时，在while循环中把`word[num]=""`加了一次到stack中，所以在拼接ss时多了一个空格，导致输出`"example   good a"`，将判断条件由`stack.size()!=0`改为`stack.size()>1&&stack.peek()!=" " `就行

word数组设大一点，最后有一个输入用例非常多



别人的思路：可以直接用库函数（属实不太熟悉。。。就很致命）trim去首位空格、spilt分割、reverse翻转、join再连接。一波操作带走

```java
class Solution {
    public String reverseWords(String s) {
        String[] words = s.trim().split(" +");
        Collections.reverse(Arrays.asList(words));
        return String.join(" ", words);
    }
}
```

别人的思路二：上面库函数面试可能不会让用，所以参考了一下别人的发现，可以考虑改进我的思路，从后往前遍历就不需要栈了，用一个双指针索引

```java
class Solution {
    public String reverseWords(String s) {
        s=s.trim();
        StringBuilder res = new StringBuilder();
        //start和end用于定位单词的首尾
        int end=s.length()-1,start=end;
        while(start>=0){
            //搜索单词
            while(start>=0&&s.charAt(start)!=' ')	start--;
            //添加单词
            res.append(s.substring(start+1,end+1) +" ");
            //跳过空格
            while(start>0&&s.charAt(start)==' ')	start--;
            //指向下个单词的尾字符
            end = start;
        }
        return res.toString().trim(); 
}
```







### 实现 strStr()

思路一：直接调用库函数indexOf

思路二：双指针暴力遍历检测

思路三：KMP算法

```java
//思路二：双指针
class Solution {
    public int strStr(String haystack, String needle) {
        if(needle.length()==0)
            return 0;
        if(needle.length()>haystack.length())
            return -1;
        int i=0,j=0;
        int index = -1;
        while(i<haystack.length() && j<needle.length()){
            if(haystack.charAt(i) == needle.charAt(j)){//两指针值相等
                if(index == -1)//index是初始值，更新index
                    index = i;
                if(j == needle.length()-1)//如果j是needle的最后一个，即已经遍历完就返回index
                    return index;
                j++;//needle未遍历完，继续
            }else{//指针值不相等
                if(index != -1){//index不是初始值，更新i
                    i = index;
                    j = 0;
                    index = -1;
                }
            }
            i++;//i始终要后移
        }
        return -1;
    }
}
```



## 双指针技巧

常用的有：

- 左右指针：左右两端点开始，反向运动，常用于二分查找之类问题
- 快慢指针：同一起点，通向运动，一快一慢，典型的判定链表中是否包含环

### 反转字符串

【题目要求原地修改输入数组、并用O(1)的额外空间解决问题】

思路：很显然放在双指针下自然想到双指针方法。。这也算是最典型的应用了，双指针left和right从两边往中间靠拢，每次交换对应的s[left]和s[right]即可

```java
class Solution {
    public void reverseString(char[] s) {
        if(s == null || s.length == 0) return;
        int left = 0;
        int right = s.length-1;
        while(left < right){
            char temp = s[left];
            s[left] = s[right];
            s[right] = temp;
            left ++;
            right --;
        }
    }
}
```



### 数组拆分

思路：将长度为2n的数组分成n对，取每队的最小值min相加，使得最后的值sum最大。那我们就应该尽可能的保留大的值——假如最大和最小、第二大和第二小。。。这样每次取min都是小的；应该最大与第二大、第三大与第四大。。。这样才能做到保留大值。【实现上就是排序取奇数位】

```java
class Solution {
    public int arrayPairSum(int[] nums) {
        Arrays.sort(nums);
        int ans = 0;
        for(int i=0;i<nums.length;i+=2){
            ans+=nums[i];
        }
        return ans;
    }
}
```



### 两数之和 II - 输入有序数组

思路：因为数组已经有序了，那这就跟二分查找差不多了，只不过它多了一步——返回是下标

```java
class Solution {
    public int[] twoSum(int[] numbers, int target) {
        int left =0,right=numbers.length-1;
        while(left<right){
            int sum = numbers[left]+numbers[right];
            if(sum==target){//找到了
                return new int[]{left+1,right+1};//数组下标从0开始,返回要补上
            }else if(sum>target){
                right--;//右指针左移
            }else{
                left++;//左指针右移
            }
        }
        return new int[]{-1,-1};//找不到
    }
}
```





### 移除元素

【原地移除等于目标值的元素，控制常量空间】

思路：一般思路是遇到不等于目标值的就放入新数组，这样一次遍历得到的新数组即为所需的。现在要求常数空间，那就可以用快慢指针：快指针每次都移动，慢指针只有快指针的值不为目标值val才移动，若相同则停止，等下一个不同的来覆盖。

```java
class Solution {
    public int removeElement(int[] nums, int val) {
        if(nums==null||nums.length==0){
            return 0;
        }
        int slow=0;
        for(int fast=0;fast<nums.length;fast++){
            if(nums[fast]!=val){
                nums[slow] = nums[fast];
                slow++;
            }
        }
        return slow;
    }
}
```





### 最大连续1的个数

思路：由0、1组成的数组中连续1的最大个数。之前没用双指针，感觉差不多

- 原来思路：变量count记录当前连续1的个数，遇到0就将count存入tmp然后count置0，下次再遇到就和tmp比较，遍历一遍得到结果
- 双指针：快指针判断，慢指针只有判断为1才前移

```java
//思路一
class Solution {
    public int findMaxConsecutiveOnes(int[] nums) {
        int count=0,tmp=0;
        for(int i=0;i<nums.length;i++){
            if(nums[i]==1){
                count++;
            }else{
                tmp = Math.max(tmp,count);
                count=0;
            }
        }
        return Math.max(tmp,count);
    }
}
//双指针
class Solution {
    public int findMaxConsecutiveOnes(int[] nums) {
        int slow=0,count=0,fast;
        for(fast=0;fast<nums.length;fast++){
            if(nums[fast]==0){
                count = Math.max(fast-slow,count);
                slow = fast+1;
            }
            if(fast==nums.length-1 && nums[fast]==1)
                count = Math.max(fast-slow+1,count);
        }
        return count;
    }
}
```





### 长度最小的子数组

思路：题目要找出满足和>=s的长度最小的**连续**子数组，我第一反应就是暴力求解，不过复杂度会比较高

- 暴力想法：枚举nums每个元素`nums[i]`，作为子数组的起始，然后从`i`开始往后，直到找到`j`使得`nums[i]到nums[j]`元素之和大于等于s，更新子数组长度。复杂度O(n<sup>2</sup>)
- 题解的双指针方法：双指针start和end，每轮`sum+=nums[end]`，满足大于等于s，就更新长度，然后执行`sum -= nums[start]`【start右移，类似滑动窗口，直到sum<s，其中每次也更新长度】一轮完成后`end++`，开始下一轮

```java
class Solution {
    public int minSubArrayLen(int s, int[] nums) {
        if(nums.length==0){
            return 0;
        }
        int len = 10010;
        int start = 0,end = 0;
        int sum = 0;
        for(end=0;end<nums.length;end++){
            sum += nums[end];
            while(sum>=s){
                len = Math.min(len,end-start+1);
                sum -= nums[start++];
            }
        }
        return len==10010? 0 : len;
    }
}
```





## 小结

### 杨辉三角

思路：打印杨辉三角嘛，两边是1直接`add(1)`，中间是正上面的左上方和。

```java
class Solution {
    public List<List<Integer>> generate(int numRows) {
        List<List<Integer>> res = new ArrayList<List<Integer>>();
        for(int i=0;i<numRows;i++){
            ArrayList<Integer> sub = new ArrayList<Integer>();
            for(int j=0;j<=i;j++){
                if(j==0||j==i){
                    sub.add(1);
                }else{
                    sub.add(res.get(i-1).get(j-1)+res.get(i-1).get(j));
                }
            }
            res.add(sub);
        }
        return res;
    }
}
```



### 杨辉三角 II

思路：上一题返回整个，这个返回杨辉三角的第k行【进阶：空间O(k)】

- 简单的就在k行返回；优化的思路：

  - 杨辉三角具有动态规划的性质，下一行依赖于上一行，且两边固定为1。

    【数组写法】数组表示很直观但是rowIndex未知，那就只能将最后的数组取前rowIndex+1位放到新数组返回

    【ArrayList写法】ArrayList用add会输出所有的元素，变成`1 11 121 1331`；有个set函数可以指定索引元素，但是得先有元素才行，所以最后要删除多的1

  - 可以用组合公式`C(n,i) = n!/(i!*(n-i)!)`

- 或者先本地IDE跑出来，然后直接打表，标准O(1)解答！(因为题目限制k<33)

```java
class Solution {
    public List<Integer> getRow(int rowIndex) {
        ArrayList<Integer> res = new ArrayList<Integer>();
        for(int i=0;i<=rowIndex;i++){
            for(int j=i;j>=0;j--){
                if(j==0||j==i){
                    res.add(1);
                }else{
                    res.set(j,res.get(j)+res.get(j-1));
                }
            }
        }
        int size = res.size();
        for(int j=size-1;j>=size-rowIndex;j--){
            res.remove(j);
        }
        return res;
    }
}
```



### 反转字符串中的单词 III

之前做过反转句子输出：`i love you`输出`you love i`这种，这题是反转每个单词，但是单词间位置不变：`i love you`输出`i evol uoy`

思路：正在刷双指针，所以一下就想到双指针方法，一个slow用于定位每个单词的开始位置，`fast==' '`时前一个就是单词的结束位置，然后将单词的字符反转。

【写完编译不通过，才想起来Java中的String是不可变的。。。改用C++思路不变】

```c++
class Solution {
public: 
    string reverseWords(string s) {
        int fast=0,slow=0;
        for(int fast=0;fast<s.length();fast++){
            if(s[fast]==' '){
                int j = fast-1;
                //exchange
                while(slow<j){
                   swap(s[slow], s[j]);
                   slow++;
                   j--;
                }
                //update
                slow = fast+1;
            }
            if(fast==s.length()-1&&s[fast]!=' '){
                int j = fast;
                while(slow<j){
                    swap(s[slow], s[j]);
                    slow++;
                    j--;
                }
            }
        }
        return s;
    }
};
```





### 寻找旋转排序数组中的最小值

看题目输入输出，好像就是找数组最小值。。。它说在某个点旋转了我也没整明白咋旋转的：`[0,1,2,4,5,6,7]`转成`[4,5,6,7,0,1,2]`。可能是说数组变成了`4,5,6,7`和`0,1,2`两个区域然后旋转了方向，所以数组不再有序了

思路：

- 第一眼就直接遍历一遍：复杂度O(N)
- 改进方式：采用二分优化。但是二分需要数组有序，旋转了之后数组是乱序的，要改进一下，假设两个区域分别叫大区间和小区间
  - 找到中间元素mid，如果`nums[mid]>nums[right]`说明mid是大区间的值，那我们就应该去小区间搜索；反之表示mid是小区间的值，那就缩小范围继续

```java
class Solution {
    public int findMin(int[] nums) {
        int left=0,right=nums.length-1;
        //数组未被旋转
        if(nums[right]>nums[0]){
            return nums[0];
        }
        while(right>left)
        {
            int mid=left+(right-left)/2;
            if(nums[mid]>nums[right])
                left=mid+1;
            else
                right=mid;
        }
        return nums[left];
    }
}
```





### 删除排序数组中的重复项

思路：有序数组去重，也是双指针比较好想

```java
class Solution {
    public int removeDuplicates(int[] nums) {
        if(nums==null||nums.length==1){
            return nums.length;
        }
        int slow=0,fast;
        for(fast=1;fast<nums.length;fast++){
            if(nums[fast] != nums[slow]){
                slow++;
                nums[slow] = nums[fast];
            }
        }
        return slow+1;
    }
}
```



### 移动零

将数组`[0,1,2,0,3]`中0移到最后且保持原数组顺序，即`[1,2,3,0,0]`。

最简单的思路就是再开一个数组遍历，不过题目要求原地操作，所以比较容易想到双指针操作

```java
class Solution {
    public void moveZeroes(int[] nums) {
        //双指针
        int slow=0,fast=0;
        while(fast<nums.length){
            if(nums[fast]!=0){
                swap(nums,slow,fast);
                slow++;
            }
            fast++;
        }
    }
    public void swap(int[] nums,int i,int j){
        int tmp = nums[i];
        nums[i] = nums[j];
        nums[j] = tmp;
    }
}
```



