/*
Copyright (c) 2016, Godof Kim

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

var async = require('async');

module.exports = {
  //use this like : var set1 = new Jaccard.Counter();
  Counter : function(arr) {
    if (!(arr instanceof Array)) {
      console.log("multiset-jaccard : parameter of Counter() must be Array");
      return {"err" : "parameters must be Array"};
    }

    this.elements = {};
    arr.sort();

    var current = null;
    var count = 0;
    for (var i = 0; i < arr.length; i++){
      if (arr[i] !== current){
        current = arr[i];
        count = 1;
      }
      else{
        count++;
      }
      this.elements[arr[i]] = count;
    }
    if (count > 0){
      this.elements[arr[i-1]] = count;
    }

    this.values = function() {
      return Object.values(this.elements);
    };

    this.keys = function() {
      return Object.keys(this.elements);
    };
  },

  sum : function(A, B){
    if (!((A instanceof Array) && (B instanceof Array)) && !((A instanceof this.Counter) && (B instanceof this.Counter))){
      console.log("multiset-jaccard : parameters of sum() must be Counter & Counter OR Array & Array");

      throw new Error({"err" : "multiset-jaccard : parameters must be Counter & Counter OR Array & Array"});
    }

    if ((A instanceof Array) && (B instanceof Array)) {
      A = new this.Counter(A);
      B = new this.Counter(B);
    }

    var result = {};
    var A_keys = Object.keys(A.elements);
    var B_keys = Object.keys(B.elements);

    for (var i = 0; i < A_keys.length; i++){
      result[A_keys[i]] = A.elements[A_keys[i]];

      for (var j = 0; j < B_keys.length; j++){
        if(A_keys[i] === B_keys[j]) {
          var same_key = A_keys[i];
          result[same_key] = A.elements[same_key] > B.elements[same_key]? A.elements[same_key] : B.elements[same_key];
        }
        else {
          if(result[B_keys[j]] < B.elements[B_keys[j]] || result[B_keys[j]] === undefined){
            result[B_keys[j]] = B.elements[B_keys[j]];
          }
        }
      }
    }
    return result;
  },

  product : function(A, B){
    if (!((A instanceof Array) && (B instanceof Array)) && !((A instanceof this.Counter) && (B instanceof this.Counter))){
      console.log("multiset-jaccard : parameters of product() must be Counter & Counter OR Array & Array");

      throw new Error({"err" : "multiset-jaccard : parameters must be Counter & Counter OR Array & Array"});
    }

    if ((A instanceof Array) && (B instanceof Array)) {
      A = new this.Counter(A);
      B = new this.Counter(B);
    }
    var result = {};
    var A_keys = Object.keys(A.elements);
    var B_keys = Object.keys(B.elements);

    for (var i = 0; i < A_keys.length; i++){
      for (var j = 0; j < B_keys.length; j++){
        if(A_keys[i] === B_keys[j]) {
          var same_key = A_keys[i];
          result[same_key] = A.elements[same_key] < B.elements[same_key]? A.elements[same_key] : B.elements[same_key];
        }
      }
    }
    return result;
  },

  index : function (A, B, callback){
    var err = {};
    if (!(A instanceof Array) && !(B instanceof Array) ) {
      console.log("multiset-jaccard : parameters of index() must be Array");
      err = { "err" : "parameters must be Array"};
      return err;
    }

    var A_Cnt = new this.Counter(A);
    var B_Cnt = new this.Counter(B);

    var product = this.product(A_Cnt, B_Cnt);
    var sum = this.sum(A_Cnt, B_Cnt);

    var prd_Values = Object.values(product);
    var sum_Values = Object.values(sum);

    var numerator = 0;
    var denominator = 0;

    if(callback === undefined){
      for(var i = 0; i < prd_Values.length; i++){
        numerator += prd_Values[i];
      }
      for ( i = 0; i < sum_Values.length; i++){
        denominator += sum_Values[i];
      }
      if(denominator === 0)
        denominator = 1;
      return numerator / denominator;
    }
    else {
      async.each(prd_Values, function(pValue, pCallback) {
        numerator += pValue;
        pCallback();
      }, function(err) {
        async.each(sum_Values, function(sValue, sCallback){
          denominator += sValue;
          sCallback();
        }, function(err){
          if(denominator === 0)
            denominator = 1;

          var result = numerator / denominator;
          callback(err, result);
        });
      });
    }
  }
};
