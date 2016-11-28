#Multiset-Jaccard

A Jaccard Index calculator supporting multi-set

##Installation
```
  $ npm install --save multiset-jaccard
```

##How to use

Get Jaccard-index between two arrays
```javascript
  var jaccard = require('multiset-jaccard');

  var A = ["Apple","Banana","Apple","Cherry","Mango"]; // multi-set
  var B = ["Apple","Cherry","Melon","Orange"];

  var index = jaccard.index(A, B);
  /*
    result : 0.2857142857142857
  */
  
  // Below is asynchronous method
  jaccard.index(A, B, function (err, index) {
    console.log("result : ", index);
  });
  /*
    result : 0.2857142857132857
  */
```

If you want to make `Counter`, make instances like this.
```javascript
  var A = ["Apple","Banana","Apple","Cherry","Mango"];
  var A_Counter = new jaccard.Counter(A);
  /*
    A_Counter.elements : {{"Apple" : 2}, {"Banana" : 1}, {"Cherry" : 1}, {"Mango" : 1}}
    A_Counter.keys() returns ["Apple","Banana","Cheery","Mango"]
    A_Counter.values() returns [2,1,1,1]
  */

```
And you can get `sum of Counters` and `product of Counters` like this.
```javascript
  var A = ["Apple","Banana","Apple","Cherry","Mango"]; // multi-set
  var B = ["Apple","Cherry","Melon","Orange"];
  var A_Counter = new jaccard.Counter(A);
  var B_Counter = new jaccard.Counter(B);

  var sum = jaccard.sum(A_Counter, B_Counter);
  var product = jaccard.product(A_Counter, B_Counter);

  /*
    sum : {{"Apple": 2}, {"Banana": 1}, {"Cherry": 1}, {"Mango": 1}, {"Melon": 1}, {"Mango": 1}}
    product : {{"Apple": 1}, {"Cherry": 1"}}
  */

```

You can get same result by putting arrays. (0.1.2v)
```javascript
  var sum = jaccard.sum(A, B);
  var product = jaccard.product(A, B);
```
