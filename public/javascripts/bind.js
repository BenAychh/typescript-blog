var Bound = (function () {
    function Bound(pId) {
        this.id = pId;
        this.tagName = document.getElementById(pId).tagName;
    }
    Bound.prototype.getId = function () {
        return this.id;
    };
    Bound.prototype.update = function (value) {
        console.log(this.id);
        if (this.tagName.toLowerCase() === "input"
            || this.tagName.toLowerCase() === "textarea"
            || this.tagName.toLowerCase() === "select") {
            document.getElementById(this.id).value = value;
        }
        else {
            document.getElementById(this.id).innerHTML =
                value.split(/[\n\r]/g).join('<br>');
        }
    };
    return Bound;
}());
var Binder = (function () {
    function Binder() {
        var _this = this;
        this.changeHandler = function (event) {
            _this.set(event.target.value);
        };
        this.elementListeners = new Array();
    }
    Binder.prototype.get = function () {
        return this.value;
    };
    Binder.prototype.set = function (newValue) {
        this.value = newValue;
        for (var _i = 0, _a = this.elementListeners; _i < _a.length; _i++) {
            var listener = _a[_i];
            listener.update(this.value);
        }
    };
    Binder.prototype.addListener = function (listener) {
        document.getElementById(listener.getId()).addEventListener('input', this.changeHandler);
        this.elementListeners.push(listener);
    };
    return Binder;
}());
