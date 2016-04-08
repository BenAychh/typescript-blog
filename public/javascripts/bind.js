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
        input = this.handleBigBlocks(input);
        input = this.handleSpecial('*', input, '<span class="bold">');
        input = this.handleSpecial('~', input, '<span class="strikethrough">');
        input = this.handleSpecial('`', input, '<span class="code">');
        input = this.handleSpecial('_', input, '<span class="italics">');
        input = this.stripExtraBackSlashes(input);
        console.log(input);
        return input;
    };
    ParsedBound.prototype.handleSpecial = function (character, input, open) {
        var started = false;
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
            if (currentChar == character) {
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
                    console.log(input);
                }
            }
        }
        return tempInput + input;
    };
    ParsedBound.prototype.handleCodeBlocks = function (input) {
        var started = false;
        var index = 0;
        var tempInput = '';
        var open = '<table class="code"><tr>';
        var close = '</tr></table>';
        var count = 0;
        var localIndex = 0;
        while (input.indexOf('```') != -1) {
            var startIndex = input.indexOf('```');
            tempInput += input.substring(0, startIndex);
            input = input.substring(startIndex + 3);
            var endIndex = input.indexOf('```');
            var code = input.substring(0, endIndex).split('\n');
            input = input.substring(endIndex + 3);
            var lines = '';
            for (i = 0; i < code.length; i++) {
                lines += (i + 1) + '<br>';
                code[i] = code[i].split(' ').join('&nbsp;').split('<').join('&#60;').split('>').join('&#62;');
            }
            var rejoinedCode = code.join('<br>');
            tempInput += open;
            tempInput += '<td valign="top">' + lines + '</td><td valign="top">' + rejoinedCode + '</td>';
            tempInput += close;
            console.log(tempInput);
        }
        return tempInput + input;
    };
    ParsedBound.prototype.handleBlock = function (input) {
    };
    ParsedBound.prototype.handleBigBlocks = function (input) {
        var started = false;
        var index = 0;
        var tempInput = '';
        var open = '<div class="block">';
        var close = '</div>';
        var count = 0;
        var localIndex = 0;
        while (input.indexOf('>>>') != -1) {
            var startIndex = input.indexOf('>>>');
            tempInput += input.substring(0, startIndex);
            input = input.substring(startIndex + 3);
            var endIndex = input.search(/^\s*$/m);
            if (endIndex !== -1) {
                var block = input.substring(0, endIndex).split(/[\n\r]/g);
                input = input.substring(endIndex);
            }
            else {
                var block = input.split('\n');
                input = '';
            }
            var rejoinedBlock = block.join('<br>');
            tempInput += open + rejoinedBlock + close;
            console.log(tempInput);
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
            console.log(tempInput);
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
