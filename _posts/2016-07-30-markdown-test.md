---
layout: post
title: Markdown Test
subtitle: 404
bigimg: /img/404-southpark.jpg
---

## Überschrift

Dies ist kein HTML, sondern eine andere Sprache.

## Kramdown Klassen und IDs

A simple paragraph with an ID attribute.
{: #para-one}

A simple paragraph with a class attribute.
{: .para-one}

## Tabellen

<div class="table-responsive" markdown="block">
{:.table}
| Nummer | Nächste Nummer | Vorhergehende Nummer |
| :------ |:--- | :--- |
| Fünf | Sechs | Vier |
| Zehn | Elf | Neun |
| Sieben | Acht | Sechs |
| Zwei | Drei | Eins |

</div>

## Referenzen

Dies ist eine Referenz.[^1]

## Bild

![Crêpe](http://s3-media3.fl.yelpcdn.com/bphoto/cQ1Yoa75m2yUFFbY2xwuqw/348s.jpg)

## Code

~~~
var foo = function(x) {
  return(x + 5);
}
foo(3)
~~~

### Code mit Syntax Highlight

```javascript
var foo = function(x) {
  return(x + 5);
}
foo(3)
```

### Code mit Syntax Highlight und Zeilennummern

{% highlight javascript linenos %}
var foo = function(x) {
  return(x + 5);
}
foo(3)
{% endhighlight %}

*[eine andere Sprache]: Markdown
*[HTML]: HyperTextMarkupLanguage

[^1]: Hier steht die passende Referenz.