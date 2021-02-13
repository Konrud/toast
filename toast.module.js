
const _TOAST_DIRECTIONS = {
    FROM_BOTTOM: "from-bottom",
    FROM_TOP: "from-top"
};

const _TOAST_DEFAULT_OPTIONS = { // toast object with predefined options
    containerClass: "c-toasts-container",
    containerID: "toastsContainer",
    toastClass: "c-toast",
    position: "left",  // PUBLIC /// position of the toasts' container
    direction: _TOAST_DIRECTIONS.FROM_BOTTOM,  // PUBLIC /// direction from which toasts will appear (e.g. from-top, from-bottom)
    titleClass: "c-toast__title",
    contentClass: "c-toast__content",
    title: "", // PUBLIC
    content: "", // PUBLIC
    customClasses: undefined, // PUBLIC
    showClass: "c-toast--visible",
    hideClass: "c-toast--hidden",
    closeAfterSeconds: 10, // PUBLIC
    isAutoClose: true, // PUBLIC
    beforeCloseCallback: null, // PUBLIC
    closeCallback: null, // PUBLIC
    useKeyboardShortcutToClose: true, // PUBLIC
    keyboardShortcutKey: "x", // PUBLIC
};

// set time after which element will be given class to reveal it
const _REVEAL_TOAST_DELAY_IN_MILLISECONDS = 5;

class Toast {
    /**
     * @param {Object} opts - Options for the current instance of the Toast element
     *  @property {String} position - Position of the Toast element's container on the page. 
     *  Valid values are: "left" (container appears on the left), "right" (container appears on the right) [default value: `left`]
     *  @property {String} direction - Direction from which Toast element will appear. 
     *  Valid values are: "from-bottom"/"from-top" [default value: `from-bottom`]
     *  @property {String} title - String contains title text of the Toast element.
     *  @property {String} content - String contains content for the Toast element, string may contain plain text or HTML markup that will be parsed and displayed
     *  @property {Array} customClasses - Array contains custom classes or predefined style classes for the toast element (Example: "my-toast c-toast--green my-blue-toast")
     *  @property {Number} closeAfterSeconds - Duration, in seconds, after which Toast element will be closed, if `isAutoClose` property is TRUE. [default value: `10 seconds`]
     *  @property {Boolean} isAutoClose - Determines whether Toast element should be auto closed. [default value: `TRUE`]
     *  @property {Function} beforeCloseCallback - Callback function that will be called when Toast element is going to be closed and removed from the DOM.
     *  @property {Function} closeCallback - Callback function that will be called after Toast element has been closed and removed from the DOM.
     *  @property {Boolean} useKeyboardShortcutToClose - Determines whether it is possible to close Toast element using keyboard shortcut. [default falue: `TRUE`]
     *  @property {String} keyboardShortcutKey - Key to use to close Toast element using keyboard. This key will be used in combination with the `Ctrl` key. [default value: `x`]
     *  NOTE: this key symbol should be the one of the permited symbols for `KeyboardEvent.key` property (@see https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key).
     */
    constructor(opts) {
        const defOptsObj = Object.assign({}, _TOAST_DEFAULT_OPTIONS, opts); // gets option value from received options object or from predefined options

        const positionAndDirectionClasses = _getPositionAndDirectionClasses(defOptsObj.containerClass, defOptsObj.position, defOptsObj.direction);

        // prepend main container class
        positionAndDirectionClasses.unshift(defOptsObj.containerClass);

        const toastsContainer = _getContainer(defOptsObj.containerID, positionAndDirectionClasses);

        document.body.appendChild(toastsContainer);

        // EXTERNAL PROPERTIES for the further use
        this.options = defOptsObj;
        this.toastContainer = toastsContainer;
        
        if (defOptsObj.useKeyboardShortcutToClose) {
            document.body.addEventListener("keydown", this.__closeOnKeyboardShortcutHandler.bind(this), true);
        }
    }
    
    __closeOnKeyboardShortcutHandler(e) {
        if (!(this.options && this.options.useKeyboardShortcutToClose)) return;
        
        if (e.ctrlKey && e.key === this.options.keyboardShortcutKey) {
            this.hide();
        }
    }

    show(opts) {
        if (this == undefined) { return; } /// we check it against undefined using == equality because we wannt to take into account null which in this case will be equal to undefined. (null == undefined) // --> true
        const defOptsObj = Object.assign({}, this.options, opts); // default options for this instance
        const toastsContainer = this.toastContainer;

        // EXTERNAL PROPERTIES for the further use
        this.options = defOptsObj;

        // TITLE ELEMENT
        const titleElement = _getTitleElement(defOptsObj.title, defOptsObj.titleClass);

        // CONTENT ELEMENT
        const contentElement = _getContentElement(defOptsObj.content, defOptsObj.contentClass);

        let toastClasses = [defOptsObj.toastClass];
        // append custom classes
        if (defOptsObj.customClasses && defOptsObj.customClasses.length) {
            toastClasses = toastClasses.concat(defOptsObj.customClasses);
        }

        const toastElement = _getToastElement(toastClasses);

        this.currentToastElement = toastElement;

        // ADD CHILDREN TO THE TOAST CONTAINER
        toastElement.appendChild(titleElement);

        toastElement.appendChild(contentElement);

        _addAriaLabels(toastElement);

        const lastAddedToastStyleData = toastsContainer.lastToastElem ? window.getComputedStyle(toastsContainer.lastToastElem) : undefined;

        if (lastAddedToastStyleData) { /// set toast's top position (starts with the second Toast in the toast container)       
            const heightValue = parseFloat(lastAddedToastStyleData.height);
            const marginBottomValue = parseFloat(lastAddedToastStyleData.marginBottom);
            const currentOffset = heightValue + (marginBottomValue * 2);

            if (defOptsObj.direction === _TOAST_DIRECTIONS.FROM_BOTTOM) {
                for (let i = toastsContainer.children.length - 1, j = 1; i >= 0; i--, j++) {
                    const toastElem = toastsContainer.children[i];
                    toastElem.style.bottom = (currentOffset * (j)) + "px";
                };
            } else { // from-top
                for (let i = 0; i < toastsContainer.children.length; i++) {
                    const toastElem = toastsContainer.children[i];
                    toastElem.style.top = (currentOffset * (i + 1)) + "px";
                };
            }
        };

        if (defOptsObj.isAutoClose) {
            _hideAndRemoveToast(this);
        };

        if (defOptsObj.direction === _TOAST_DIRECTIONS.FROM_BOTTOM) {
            toastsContainer.appendChild(toastElement);
        } else if (defOptsObj.direction === _TOAST_DIRECTIONS.FROM_TOP) {
            toastsContainer.insertBefore(toastElement, toastsContainer.firstElementChild); // new toast will appear above the last one
        }

        /// saves last Toast element that's been added.
        toastsContainer.lastToastElem = toastElement;

        // reveals Toast element
        window.setTimeout(function () {
            toastElement.classList.add(defOptsObj.showClass);
        }, _REVEAL_TOAST_DELAY_IN_MILLISECONDS);

    }

    hide(hideImmediately) {
        _hideAndRemoveToast(this, { hideImmediately, ignoreCloseDelay: true });
    }

};

/* UTILITY PRIVATE FUNCTIONS */
function _getContainer(containerID, containerClassesArr) {
    const container = document.createElement("div");
    container.id = containerID;
    container.classList.add.apply(container.classList, containerClassesArr);
    return container;
}

function _getToastElement(classValuesArr) {
    const toast = document.createElement("div");
    toast.classList.add.apply(toast.classList, classValuesArr);
    return toast;
};

function _getPositionAndDirectionClasses(prefix, positionClass, directionClass) {
    const resultClasses = [];
    const positionClassValue = `${positionClass ? prefix + "--" + positionClass : ""}`;
    if (positionClassValue) {
        resultClasses.push(positionClassValue);
    }
    const directionClassValue = `${directionClass ? prefix + "--" + directionClass : ""}`;
    if (directionClassValue) {
        resultClasses.push(directionClassValue);
    }
    return resultClasses;
}

function _getTitleElement(text, classValue) {
    const title = document.createElement("h4");
    title.textContent = text || "";
    title.classList.add(classValue);
    return title;
}

function _getContentElement(contentStr, classValue) {
    const contentElem = document.createElement("div");
    contentElem.innerHTML = contentStr || "";
    contentElem.classList.add(classValue);
    return contentElem;
}

function _addAriaLabels(toastElem) {
    toastElem.setAttribute("role", "alert");
    toastElem.setAttribute("aria-live", "assertive");
    toastElem.setAttribute("aria-atomic", "true");
    return toastElem;
}

function _hideAndRemoveToast(toastInstance, { hideImmediately = false, ignoreCloseDelay = false } = {}) {
    const toastElement = toastInstance.currentToastElement;
    if (!toastElement) { console.error("Can not hide toast element as toast instance has invalid value: " + JSON.stringify(toastInstance)); return; }

    const defOptsObj = toastInstance.options;

    if (hideImmediately) {
        requestAnimationFrame(function () {
            invokeBeforeCloseCallback(defOptsObj.beforeCloseCallback, toastInstance);
            _hideToast(toastElement, toastInstance.options);
            requestAnimationFrame(function () {
                _removeToast(toastElement);
                invokeCloseCallback(defOptsObj.closeCallback, toastInstance);
                toastInstance.currentToastElement = _getNextToastElement(toastInstance.toastContainer.children); // get next toast element as a current
            });
        });
        return;
    }

    const closeDelay = ignoreCloseDelay ? 0 : (defOptsObj.closeAfterSeconds * 1000) + _REVEAL_TOAST_DELAY_IN_MILLISECONDS;

    window.setTimeout(function () {
        invokeBeforeCloseCallback(defOptsObj.beforeCloseCallback, toastInstance);
        _hideToast(toastElement, toastInstance.options);

        window.setTimeout(function () {
            _removeToast(toastElement);// removes element entirely from the page
            invokeCloseCallback(defOptsObj.closeCallback, toastInstance);
            toastInstance.currentToastElement = _getNextToastElement(toastInstance.toastContainer.children); // get next toast element as a current
        }, getTransitionDurationAvgTimeInMillSec(toastElement)); // should be larger then transition duration values

    }, closeDelay);
};


function _hideToast(toastElem, options) {
    const toastElement = toastElem;
    const defOptsObj = options;
    toastElement.classList.remove(defOptsObj.showClass); // hides element (with animation) from the page
    toastElement.classList.add(defOptsObj.hideClass);
};

function _removeToast(toastElem) {
    const toastElement = toastElem;
    toastElement.parentNode.removeChild(toastElement);
}

function invokeBeforeCloseCallback(callback, toastData) {
    if (_isFunction(callback)) {
        callback(toastData);
    }
}

function invokeCloseCallback(callback, toastData) {
    if (_isFunction(callback)) {
        callback(toastData);
    }
}

function _getNextToastElement(toastElements) {
    return toastElements.item(toastElements.length - 1);
}

// returns sum of transition duration css property values, for the element, in milliseconds (i.e. each value multiply by 1000)
/// <param name="el" type="HTMLElement">Element from which transitionDuration, css property, should be read</param>
function getTransitionDurationAvgTimeInMillSec(el) {
    const resultArr = window.getComputedStyle(el).transitionDuration.match(/(\d+.\d+)/gi); // gets only numbers from property e.g. "0.7s, 0.6s" 
    let resultNum = 0;
    if (resultArr) {
        for (let i = 0, len = resultArr.length; i < len; i++) {
            const num = resultArr[i];
            resultNum += (parseFloat(num) * 1000); /// e.g. from 0.7 to 700
        }
        resultNum /= resultArr.length;
    }
    return resultNum;
};

function _isFunction(param) {
    return typeof param === "function";
};


export default Toast;
