![Node.js CI](https://github.com/freddiefujiwara/dtdt/workflows/Node.js%20CI/badge.svg)[![npm version](https://badge.fury.io/js/dtdt.svg)](https://badge.fury.io/js/dtdt)

# Dtdt
This is a Dtdt class. It's a A test case generator from a "D"ecision "T"ree to "D"ecision "T"able.

Try it in your browser! [TRY IT NOW](https://freddiefujiwara.github.io/dtdt/#inputscript)

Document is [here](https://github.com/freddiefujiwara/dtdt/blob/master/DOCS.md)

# install

``` shell
$ npm i -g dtdt
```

# Usage
## command line
``` shell
# -h:help
# <file>:inputscript
dtdt [-h] <file>
```
## sample data
``` shell
$ cat __tests__/testDataa.yml
7+ items?:
  'y':
    buy shirts?:
      'y':
        buy ties?:
          'y': 12%
          'n': 7%
      'n': 7%
  'n':
    buy shirts?:
      'y':
        buy ties?:
          'y': 5%
          'n': 0%
      'n': 0%
```

## Decision table
```shell
$ dtdt __tests__/testData.yml
```

||1|2|3|4|5|6|
|:--|:--|:--|:--|:--|:--|:--|
|7+ items?|y|y|y|n|n|n|
|buy shirts?|y|y|n|y|y|n|
|buy ties?|y|n|-|y|n|-|
|12%|x|-|-|-|-|-|
|7%|-|x|x|-|-|-|
|5%|-|-|-|x|-|-|
|0%|-|-|-|-|x|x|

## Test cases
```shell
$ dtdt __tests__/testData.yml -t c
```

|#|Conditions|Action|
|:--|:--|:--|
|0|7+ items? equals y and buy shirts? equals y and buy ties? equals y|12%|
|1|7+ items? equals y and buy shirts? equals y and buy ties? equals n|7%|
|2|7+ items? equals y and buy shirts? equals n|7%|
|3|7+ items? equals n and buy shirts? equals y and buy ties? equals y|5%|
|4|7+ items? equals n and buy shirts? equals y and buy ties? equals n|0%|
|5|7+ items? equals n and buy shirts? equals n|0%|

{% include form.html %}
