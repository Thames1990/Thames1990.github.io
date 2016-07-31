---
layout: post
title: Markdown Test
subtitle: 404
---
# Überschrift 1
Dies ist Text.

**Tabelle**

| Nummer | Nächste Nummer | Vorhergehende Nummer |
| :------ |:--- | :--- |
| Fünf | Sechs | Vier |
| Zehn | Elf | Neun |
| Sieben | Acht | Sechs |
| Zwei | Drei | Eins |

## Bild

![Crêpe](http://s3-media3.fl.yelpcdn.com/bphoto/cQ1Yoa75m2yUFFbY2xwuqw/348s.jpg)

### Code

~~~
var foo = function(x) {
  return(x + 5);
}
foo(3)
~~~

#### Code mit Syntax Highlight

```javascript
var foo = function(x) {
  return(x + 5);
}
foo(3)
```

#### Code mit Syntax Highlight und Zeilennummern

{% highlight javascript linenos %}
var foo = function(x) {
  return(x + 5);
}
foo(3)
{% endhighlight %}