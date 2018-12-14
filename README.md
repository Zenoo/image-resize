# SlickComplete [(Demo)](https://jsfiddle.net/Zenoo0/z5tr4a91/)

![Dependencies](https://david-dm.org/Zenoo/slick-complete.svg)

Autocomplete your inputs.

### Doc

* **Installation**

Simply import SlickComplete into your HTML.
```

<link rel="stylesheet" href="slick-complete.min.css">
<script type="text/javascript" src="slick-complete.min.js"></script>
```
* **How to use**

Create a new [`SlickComplete`](https://zenoo.github.io/slick-complete/SlickComplete.html) object with a query String or an Element as the first parameter :
```
let slickComplete = new SlickComplete('div.with[any="selector"]', options);
// OR
let element = document.querySelector('li.terally[any="thing"]');
let slickComplete = new SlickComplete(element, options);
```
* **Options**

```
{
  icon: false,                                // Use an icon for your items ?
  lang: 'en',                                 // Language
  items: [                                    // Items list
    {
      id: 'yourID',                           // String or Number
      name: {
          'en': 'Test',                       // 'lang': 'translatedName'
          'fr': 'Tester'
      },
      aliases: ['Test2','Test3'],             // Name aliases
      icon: 'https://website.com/iconurl.jpg' // Icon URL
    },
    ...
  ]
}
```
* **Methods**

See the [documentation](https://zenoo.github.io/slick-complete/SlickComplete.html) for the method definitions.  

* **Example**

See this [JSFiddle](https://jsfiddle.net/Zenoo0/z5tr4a91/) for a working example


## Authors

* **Zenoo** - *Initial work* - [Zenoo.fr](http://zenoo.fr)
