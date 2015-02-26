# carousel.js

A responsive carousel script that's easy as pie, for use in HTML5 applications. The **carousel.js** script is:

- Touch-friendly
- Responsive
- Accessible
- Lightweight
- Highly configurable

## Getting started
The easiest way to get started with **carousel.js** is to attach the required JavaScript and CSS stylesheet to your HTML document. Once attached, simply format your HTML and run the script to create a carousel.

### Prerequisites
1. Attach the [jQuery library](http://jquery.com/) version 1.7.0 or higher to your HTML document
2. Attach the [carousel.js](https://github.com/oldrivercreative/carousel/blob/master/carousel.js) script to your HTML document, or copy the contents of this file into an existing JS file
3. Attach the [carousel.css](https://github.com/oldrivercreative/carousel/blob/master/carousel.css) file to your HTML document, or copy the contents of this file into an existing CSS file

### Making carousels
With all prerequisites in place, you're ready to start creating carousels. Create a container and an unordered list (`<ul>`) in your HTML, and then run the `carousel()` jQuery function on your container. For example:

##### HTML
```html
<div class="my-carousel">
  <ul>
    <li>
      Item one
    </li><li>
      Item two
    </li>
  </ul>
</div>
```

##### JavaScript
```js
$('.my-carousel').carousel();
```

### That's it?
Easy, right!? There's no need to add any special styles to your carousel items, or to set an explicit height on any element within the carousel. We'll handle the animation and transition between carousel items, but the presentation is completely up to you.

## Configuration
There are various ways to configure the **carousel.js** script for different behavior and functionality. Add these options to the `carousel()` function to alter the behavior of your carousels. The default values are shown below, and all configuration settings are optional.

```js
$('.selector').carousel({
  paging: false,           // enable paging buttons
  navigation: false,       // enable navigation buttons
  loop: false,             // enable loop (only works with paging enabled)
  autoplay: false,         // automatically advance to the next slide
  delay: 12000,            // use with autoplay, delay between transitions
  buttons: {
    previous: 'Previous',  // label added to the "previous" paging button
    next: 'Next',          // label added to the "next" paging button
    navigation: '%i'       // label added to navigation buttons ("%i" is replaced with the item number)
  },
  movethreshold: 10,       // threshold (in pixels) before items will move
  swipethreshold: 10,      // threshold (in percent) before items will "swipe"
  oninit: function(){},    // an event that runs after the carousel has been created
  onupdate: function(e){}, // an event that runs each time the carousel moves
  destroy: false           // set to "true" to destroy a previously created carousel
});
```

## Responsive carousels
Multiple carousel items may appear at once using the **carousel.js** script. You can even configure a varying number of columns to appear on different screen sizes. To begin, add one or more CSS classes, such as `xs-2cols`, to your carousel container. For example:
```html
<div class="product-spinner xs-2cols sm-4cols md-5cols lg-6cols">
  <ul>
    <li>
      Product 1
    </li><li>
      Product 2
    </li><li>
      Product 3
    </li>
  </ul>
</div>
```
In this example, two items will appear side-by-side on extra-small screens (`xs-2cols`). Four items will appear on small screens (`sm-4cols`), five items will appear on medium screens (`md-5cols`), and six items will appear on large screens (`lg-6cols`). The [carousel.css](https://github.com/oldrivercreative/carousel/blob/master/carousel.css) stylesheet includes styles for up to twelve columns within your carousels.

Responsive screen sizes, class names, and an example of each class name are shown below. For class names, replace `%` with the number of columns you would like to display.

| Screen size | Class name | Example | Max |
| ----------- | ---------- | ------- | --- |
| Extra-small (`<768px`) | `xs-%cols` | `.xs-3cols` | 12 |
| Small (`≥768px`) | `sm-%cols` | `.sm-4cols` | 12 |
| Medium (`≥992px`) | `md-%cols` | `.md-8cols` | 12 |
| Large (`≥1200px`) | `lg-%cols` | `.lg-12cols` | 12 |

## Concerning white space
What makes **carousel.js** different from other carousel/slideshow scripts is that you don't have to explicity set a height on your carousels. This is great because it will allow content within your carousel to adapt and grow to fit different screen sizes.

In order to achieve this effect, we show each item within the carousel in horizontal orientation using `display:inline-block`. This style is defined in the [carousel.css](https://github.com/oldrivercreative/carousel/blob/master/carousel.css) stylesheet. One side-effect of using this technique is that any whitespace between one list item and another will result in a small gap between items. For example:

#### HTML with whitespace (bad)
```html
<div class="bad-carousel">
  <ul>
    <li>
      Item 1
    </li>
    
    <!-- this is whitespace! bad whitespace! -->
    
    <li>
      Item 2
    </li>
  </ul>
</div>
```

For best results, always remove all whitespace between items. For example:

#### HTML without whitespace (good)
```html
<div class="good-carousel">
  <ul>
    <li>
      Item 1
    </li><li>   <!-- whitespace between items is removed! -->
      Item 2
    </li>
  </ul>
</div>
```

## Browser support
The **carousel.js** script was written to be accessible on all known browsers and operating systems. While accessible everywhere, there may be some differences in functionality and appearance between systems. For example, the script will utilize CSS3 transforms whenever possible to increase fluidity of animations while sliding. If your browser does not support CSS3 transitions, the script falls back to normal CSS2 positioning, which may make the carousel appear slightly choppier while moving when compared to more modern systems.

The script has been tested and is fully supported on the following web browsers:

- Internet Explorer 8+ (CSS2 animation)
- Internet Explorer 10+
- Chrome 31+
- Firefox 34+
- Safari 7.1+
- iOS/Safari 7.1+
- Android/Chrome 4.1+
