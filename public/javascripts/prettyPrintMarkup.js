var prettyPrintMarkup = (function () {
    function prettyPrintMarkup() {
    }
    prettyPrintMarkup.prototype.parser = function (input) {
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
    prettyPrintMarkup.prototype.handleSpecial = function (character, input, open) {
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
    prettyPrintMarkup.prototype.handleCodeBlocks = function (input) {
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
            for (var i = 0; i < code.length; i++) {
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
    prettyPrintMarkup.prototype.handleBlocks = function (input) {
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
    prettyPrintMarkup.prototype.stripExtraBackSlashes = function (input) {
        var started = false;
        var index = 0;
        var tempInput = '';
        var count = 0;
        while (input.indexOf('\\') != -1) {
            var index_1 = input.indexOf('\\');
            tempInput += input.substring(0, index_1) + (input[index_1 + 1] || '');
            input = input.substring(index_1 + 2);
        }
        return tempInput + input;
    };
    return prettyPrintMarkup;
}());
