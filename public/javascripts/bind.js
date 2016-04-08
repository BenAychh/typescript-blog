var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Bound = (function () {
    function Bound(pId) {
        this.id = pId;
        this.tagName = document.getElementById(pId).tagName;
    }
    Bound.prototype.getId = function () {
        return this.id;
    };
    Bound.prototype.update = function (value) {
        if (this.tagName.toLowerCase() === 'input'
            || this.tagName.toLowerCase() === 'textarea'
            || this.tagName.toLowerCase() === 'select') {
            document.getElementById(this.id).value = value;
        }
        else {
            document.getElementById(this.id).innerHTML =
                value.split(/[\n\r]/g).join('<br>');
        }
    };
    return Bound;
}());
var ParsedBound = (function (_super) {
    __extends(ParsedBound, _super);
    function ParsedBound() {
        _super.apply(this, arguments);
    }
    ParsedBound.prototype.update = function (value) {
        document.getElementById(this.getId()).innerHTML = this.parser(value);
    };
    ParsedBound.prototype.parser = function (input) {
        input = this.handleCodeBlocks(input);
        input = this.handleBlocks(input);
        input = input.split('\n').join('<br>');
        input = this.handleSpecial('*', input, '<span class="bold">');
        input = this.handleSpecial('~', input, '<span class="strikethrough">');
        input = this.handleSpecial('`', input, '<span class="code">');
        input = this.handleSpecial('_', input, '<span class="italics">');
        input = this.stripExtraBackSlashes(input);
        return input;
    };
    ParsedBound.prototype.handleSpecial = function (character, input, open) {
        var started = false;
        var inCode = false;
        var index = 0;
        var tempInput = '';
        var close = '</' + open.substring(1, open.indexOf(' ')) + '>';
        var count = 0;
        var localIndex = 0;
        if (input[0] == character) {
            tempInput += open;
            started = true;
            input = input.substring(1);
        }
        for (var i = 0; i < input.length; i++) {
            var currentChar = input[i];
            if (currentChar == '<' && input[i + 1] == 'c'
                && input[i + 2] == 'o' && input[i + 3] == 'd' && input[i + 4] == 'e'
                && input[i + 5] == '>') {
                inCode = true;
            }
            else if (currentChar == '<' && input[i + 1] == '/'
                && input[i + 2] == 'c' && input[i + 3] == 'o' && input[i + 4] == 'd'
                && input[i + 5] == 'e' && input[i + 6] == '>') {
                inCode = false;
            }
            if (currentChar == character && !inCode) {
                if (input[i - 1] != '\\') {
                    tempInput += input.substring(0, i);
                    input = input.substring(i + 1);
                    i = -1;
                    if (!started) {
                        tempInput += open;
                    }
                    else {
                        tempInput += close;
                    }
                    started = !started;
                }
            }
        }
        return tempInput + input;
    };
    ParsedBound.prototype.handleCodeBlocks = function (input) {
        var started = false;
        var index = 0;
        var tempInput = '';
        var open = '<code><table><tr>';
        var close = '</tr></table></code>';
        var count = 0;
        var localIndex = 0;
        while (input.indexOf('<code>\n') != -1) {
            var startIndex = input.indexOf('<code>');
            tempInput += input.substring(0, startIndex);
            input = input.substring(startIndex + 7);
            var endIndex = input.indexOf('\n</code>');
            var code = input.substring(0, endIndex).split('\n');
            input = input.substring(endIndex + 8);
            var lines = '';
            for (i = 0; i < code.length; i++) {
                lines += (i + 1) + '<br>';
                code[i] = code[i].split(' ').join('&nbsp;').split('<').join('&#60;').split('>').join('&#62;');
            }
            var rejoinedCode = code.join('<br>');
            tempInput += open;
            tempInput += '<td valign="top">' + lines + '</td><td valign="top">' + rejoinedCode + '</td>';
            tempInput += close;
        }
        return tempInput + input;
    };
    ParsedBound.prototype.handleBlocks = function (input) {
        var started = false;
        var index = 0;
        var tempInput = '';
        var open = '<block>';
        var close = '</block>';
        var count = 0;
        while (input.indexOf('<block>\n') != -1) {
            var startIndex = input.indexOf('<block>\n');
            tempInput += input.substring(0, startIndex);
            input = input.substring(startIndex + 8);
            var endIndex = input.indexOf('</block>\n');
            var code = input.substring(0, endIndex);
            input = input.substring(endIndex + 9);
            tempInput += open;
            tempInput += code;
            tempInput += close;
        }
        return tempInput + input;
    };
    ParsedBound.prototype.stripExtraBackSlashes = function (input) {
        var started = false;
        var index = 0;
        var tempInput = '';
        var count = 0;
        while (input.indexOf('\\') != -1) {
            var index = input.indexOf('\\');
            tempInput += input.substring(0, index) + (input[index + 1] || '');
            input = input.substring(index + 2);
        }
        return tempInput + input;
    };
    return ParsedBound;
}(Bound));
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
        document.getElementById(listener.getId())
            .addEventListener('input', this.changeHandler);
        this.elementListeners.push(listener);
    };
    return Binder;
}());
