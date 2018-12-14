# ImageResize [(Demo)](https://jsfiddle.net/Zenoo0/t501v3cu/)

Resize your Image object or image inputs easily

### Doc

* **Installation**

Simply import ImageResize into your HTML.
```

<script src="https://gitcdn.link/repo/Zenoo/image-input-preview/master/ImageResize.min.js"></script>
```
* **How to use**

Create a new [`ImageResize`](https://zenoo.github.io/image-resize/ImageResize.html) object:
```
// Empty image processor
const resizer = new ImageResize()
	.maxWidth(200)
	.process('yourImageURL')
	.then(resizedImage => {
		document.body.appendChild(resizedImage);
	});

// OR

// Processor linked to a file input
const resizer = new ImageResize({
	source: document.querySelector('input.image'),
	maxWidth: 50,
	maxHeight: 50,
	onResize: resizedImage => {
		document.body.appendChild(resizedImage);
	}
});
```


* **Options**

```
{
  source: document.querySelector('input.image'), // Your file input (String selector or Element)
  maxWidth: 50,                                  // Max width
  maxHeight: 50,                                 // Max height
  width: 50,                                     // Fixed width (You'll usually use either maxWidth or width)
  height: 50,                                    // Fixed height (You'll usually use either maxHeight or height)
  onResize: resizedImage => {
    document.body.appendChild(resizedImage);
  }
}
```
* **Methods**

See the [documentation](https://zenoo.github.io/image-resize/ImageResize.html) for the method definitions.  

* **Example**

See this [JSFiddle](https://jsfiddle.net/Zenoo0/t501v3cu/) for a working example


## Authors

* **Zenoo** - *Initial work* - [Zenoo.fr](http://zenoo.fr)
