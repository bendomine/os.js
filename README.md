# os.js
### A platform for creating in-browser JavaScript operating systems
os.js is a simple way to quickly create beautiful window-based operating systems.

**Getting Started**  
os.js consists of two files: `os.js` and `os.css`. Link these two files to your HTML in the following way.
```html
<link rel="stylesheet" href="os.css">
<script src="os.js"></script>
```
You can now use os.js functions in your own JS files.

**Syntax**  
os.js works through the OSWindow class. Each window in the OS is its own instance of the class.

Constructor:
```javascript
new OSWindow(string id, int x, int y, int width, int height, boolean keepRatio);
```
`id`: the id the created window will have. It must be unique from all other elements and windows, or an error will be thrown.  
`x`: the initial x position of the created window, using the top-left corner as (0, 0).  
`y`: the initial y position of the created window, using the top-left corner as (0, 0).  
`width`: the initial width of the created window.  
`height`: the initial height of the created window.  
`keepRatio`: defaults to `false`. When true, the window will keep its inital ratio when resized. Not recommended for most applications.

Methods:
```javascript
createWindow(DOMelement windowTarget);
```
Creates the window, displaying it on the screen. This should only be done once per window; continuing to use it will cause an error.
`target`: the DOM element the window should be a child of. Returns the 'content' element, to which all window content should be added.  


```javascript
close();
```
Closes the window if it is currently open. When the `createWindow` method is used, the window starts as open. This function should not be used if the window hasn't been created yet or if the window is already closed.  


```javascript
open();
```
Opens the window if it is currently closed. This function should not be used if the window hasn't been created yet or if the window is already open.  

Properties:
`x (set, get)`: Sets or gets the window's x position, using the top left corner of the screen as (0, 0).  
`y (set, get)`: Sets or gets the window's y position, using the top left corner of the screen as (0, 0).  
`width (set, get)`: Sets or gets the window's width.  
`height (set, get)`: Sets or gets the window's height.  
`created (get)`: Is `true` if the window has been created, `false` otherwise.  
`opened (get)`: Is `true` if the window is open, `false` if the window is closed or hasn't been created.  
`id (get)`: Gets the window's id.  
`element (get)`: Gets the DOM element of the window.  


**Tips:**
1. In order to get a window's content element, use this:
```javascript
_window.element.getElementsByClassName('windowContent')[0]
```  

2. In order to add content to a window, use the `appendChild()` method on the window's content element.
3. Windows have a drag bar, resize tab, and close button all by default, no need to add them.
