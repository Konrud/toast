# Toast Component
Toast component (using HTML, CSS, JS)

## Preview
[You can see it live](https://konrud.github.io/toast/Index.html)


## Summary
Toast component can hold either plain text or any HTML markup and can be called
any time a message should be displayed on the screen.

## How to use
Download [`toast.module.js`](toast.module.js), if you use modules in your code, or [`toast.js`](toast.js) if you use plain JS files approach. Link it in your HTML document, or in case you use modules you can import it in you main entery point file. You don't need to create any HTML markup for this toast in your HTML. When Toast component intialized, by calling Toast constructor, container that holds new Toast components will be automatically created in your HTML page and every time Toast component is being called it will automatically create needed HTML markup and insert into special container on the page. 

**Examples:**

**Using plain Script file approach**
```html
<!DOCTYPE html>
<html lang="en">
<head>...</head>
 <body>
  ....
  <script src="/toast.js"></script>
 </body>
</html>
```
```javascript
// using plain script file approach

// Initialization
const myToast = new window.Toast({ title: "Toast Title", beforeCloseCallback: toastBeforeCloseCallback, closeCallback: toastCloseCallback, direction: "from-bottom", position: "left" });

// Use case
const openToastBtn = document.getElementById("openToast");

// add event listener to the button which opens new Toast
openToastBtn.addEventListener("click", onOpenToastBtnClick);

const toastContent = `<span>I am toast content Very Long One Might Be even too long</span><p style="margin: 0;">I don't know what do you mean by being too long</p><button class="btn-flat toast-action">Undo</button>`;

function onOpenToastBtnClick(e) {
    myToast.show({ content: toastContent, customClasses: ["my-toast", "c-toast--green"]});
}
```
**Using Modules Approach**
```javascript
// in you main entery point file
import Toast from "./toast.module.js";

// Initialization
const myToast = new Toast({ title: "Toast Title", beforeCloseCallback: toastBeforeCloseCallback, closeCallback: toastCloseCallback, direction: "from-bottom", position: "left" });

// Use case
const openToastBtn = document.getElementById("openToast");

// add event listener to the button which opens new Toast
openToastBtn.addEventListener("click", onOpenToastBtnClick);

const toastContent = `<span>I am toast content Very Long One Might Be even too long</span><p style="margin: 0;">I don't know what do you mean by being too long</p><button class="btn-flat toast-action">Undo</button>`;

function onOpenToastBtnClick(e) {
    myToast.show({ content: toastContent, customClasses: ["my-toast", "c-toast--green"]});
}
```

## Initialization Options
  
  **NOTE:** The following options can be passed during the initialization (when Toast constructor is being called) or during each call to the `show` method. Some properties, though, can be set only during initialization as changing them after it will brake the proper behavior of the Toast component.
  
  ### position `[optional]` | `(type: String)` | `[default value: left]`
  Position of the Toast component's container on the page. Should be set only during initialization state (when the `Toast` constructor is called). 
  
  Valid values are: 
  
  - `left` (container appears on the left)
  
  - `right` (container appears on the right) 
  
  **Example**
  ```javascript
  // Set only during initialization
  const myToast = new Toast({ position: "left" });
  ```
  
  ### direction `[optional]` | `(type: String)` | `[default value: from-bottom]`
  Direction from which Toast component will appear. Should be set only during initialization state (when the `Toast` constructor is called). 
  
  Valid values are: 
  
  - `from-bottom` (toast appears from the bottom of the page)
  
  - `from-top` (toast appears from the top of the page)
  
  **Example**
  ```javascript
  // Set only during initialization
  const myToast = new Toast({ direction: "from-bottom" });
  ```
  
  ### title `[optional]` | `(type: String)` | `[default value: ""]`
  String contains title text of the Toast component. Can be set both during initialization and when `show` method is called. 
  
  **Example**
  ```javascript
  // Set during initialization
  const myToast = new Toast({ title: "my title" });
  
  // Set when `show` method is called
  myToast.show({ title: "my title" });
  
  ```
  
  ### content `(type: String)` | `[default value: ""]`
  String contains content for the Toast component, string may contain plain text or HTML markup that will be parsed and displayed. Can be set both during initialization and when `show` method is called. 
  
  **Example**
  ```javascript
  // Set during initialization using plain string text
  const myToast = new Toast({ content: "my content" });
  
  // Set during initialization using HTML markup
  const myToast = new Toast({ content: "<p>my content</p><button>my button</button>" });
  
  /*************************************************************/
  
  // Set when `show` method is called using plain string text
  myToast.show({ content: "my content" });
  
  // Set when `show` method is called using HTML markup
  myToast.show({ content: "<p>my content</p><button>my button</button>" });
  
  ```
  
  ### customClasses `[optional]` | `(type: Array)` | `[default value: undefined]`
  Array contains custom classes (predefined style classes) for the Toast component (e.g. `my-toast c-toast--green...`). Can be set both during initialization and when `show` method is called. 
  
  **Example**
  ```javascript
  // Set during initialization
  const myToast = new Toast({ customClasses: ["my-toast", "c-toast--green"] });
  
  // Set when `show` method is called
  myToast.show({ customClasses: ["my-toast", "c-toast--green"] });
  
  ``` 
  
  ### closeAfterSeconds `[optional]` | `(type: Number)` | `[default value: 10]`
  Duration, in seconds, after which Toast component will be closed, if `isAutoClosed` property is set to `TRUE`. Can be set both during initialization and when `show` method is called. 
  
  **Example**
  ```javascript
  // Set during initialization
  const myToast = new Toast({ closeAfterSeconds: 5 });
  
  // Set when `show` method is called
  myToast.show({ closeAfterSeconds: 5 });
  
  ``` 
  
  ### isAutoClosed `[optional]` | `(type: Boolean)` | `[default value: TRUE]`
  Determines whether Toast component should be auto closed, according to the time set in `closeAfterSeconds` property. Can be set both during initialization and when `show` method is called. 
  
  **Example**
  ```javascript
  // Set during initialization
  const myToast = new Toast({ isAutoClosed: false });
  
  // Set when `show` method is called
  myToast.show({ isAutoClosed: false });
  
  ``` 
  
  ### beforeCloseCallback `[optional]` | `(type: Function)` | `[default value: null]`
  Callback function that will be called when Toast component is going to be closed and removed from the DOM. Can be set both during initialization and when `show` method is called. Toast component instance will be sent as input property. 
  
  **Example**
  ```javascript
  // Define custom handler
  function toastBeforeCloseCallback(toastInstance) {
    // Some actions that needed to be done before Toast component is going to be hidden and removed from the DOM
  }
  
  // Set during initialization
  const myToast = new Toast({ beforeCloseCallback: toastBeforeCloseCallback });
  
  // Set when `show` method is called
  myToast.show({ beforeCloseCallback: toastBeforeCloseCallback });
  
  ``` 

  ### beforeCloseCallback `[optional]` | `(type: Function)` | `[default value: null]`
  Callback function that will be called after Toast component has been closed and removed from the DOM. Can be set both during initialization and when `show` method is called. Toast component instance will be sent as input property.
  
  **Example**
  ```javascript
  // Define custom handler
  function toastCloseCallback(toastInstance) {
    // Some actions that needed to be done before Toast component is going to be hidden and removed from the DOM
  }
  
  // Set during initialization
  const myToast = new Toast({ closeCallback: toastCloseCallback });
  
  // Set when `show` method is called
  myToast.show({ closeCallback: toastCloseCallback });
  
  ``` 

  ### useKeyboardShortcutToClose `[optional]` | `(type: Boolean)` | `[default value: TRUE]`
  Determines whether it is possible to close Toast component using keyboard shortcut. Can be set both during initialization and when `show` method is called. When set to `true`, `keydown` event will be set on the `document.body` HTML element to intercept the defined shortcut and call the `hide` method.
  
  **NOTE:** 
  
  If set to `false` during the initialization state, event handler won't be set on the `document.body`, that is, all subsequent calls via the `show` method won't do/change anything.
  
  If set to `false` using the `show` method, the `keydown` event will be set on the `document.body` (during the initialization state) but won't do anything when shortcut is used. 
  
  **Example**
  ```javascript
  // Set during initialization
  const myToast = new Toast({ useKeyboardShortcutToClose: false });
  
  // Set when `show` method is called
  myToast.show({ useKeyboardShortcutToClose: false });
  
  ``` 

  ### keyboardShortcutKey `[optional]` | `(type: String)` | `[default value: "x"]`
  Key to use to close Toast component, using keyboard. This key will be used in combination with the `Ctrl` key. Can be set both during initialization and when `show` method is called. 
  
  **NOTE:** this key symbol should be the one of the permitted symbols for the `KeyboardEvent.key` property (@see https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key).
  
  **Example**
  ```javascript
  // Set during initialization
  const myToast = new Toast({ keyboardShortcutKey: "x" });
  
  // Set when `show` method is called
  myToast.show({ keyboardShortcutKey: "x" });
  
  ``` 












