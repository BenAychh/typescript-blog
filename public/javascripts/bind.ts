class Bound {
  private id;
  private tagName;
  constructor(pId: string){
    this.id = pId;
    this.tagName = document.getElementById(pId).tagName;
  }
  getId() {
    return this.id;
  }
  update(value) {
    if ( this.tagName.toLowerCase() === 'input'
      || this.tagName.toLowerCase() === 'textarea'
      || this.tagName.toLowerCase() === 'select' ) {
      (<HTMLInputElement>document.getElementById(this.id)).value = value;
    } else {
      document.getElementById(this.id).innerHTML =
        (<String>value).split(/[\n\r]/g).join('<br>');
    }
  }
}
class ParsedBound extends Bound {
  update(value) {
    document.getElementById(this.getId()).innerHTML = this.parser(value);
  }
  parser(input: string) {
    input = this.handleCodeBlocks(input);
    input = this.handleBigBlocks(input);
    input = this.handleSpecial('*', input, '<span class="bold">');
    input = this.handleSpecial('~', input, '<span class="strikethrough">');
    input = this.handleSpecial('`', input, '<span class="code">');
    input = this.handleSpecial('_', input, '<span class="italics">');
    input = this.stripExtraBackSlashes(input);
    console.log(input);
    return input;
  }
  handleSpecial(character: string, input: string, open: string) {
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
    for (var i = 0; i < input.length; i++){
      var currentChar = input[i];
      if (currentChar == character) {
        if (input[i - 1] != '\\') {
          tempInput += input.substring(0, i);
          input = input.substring(i + 1);
          i = -1;
          if (!started) {
            tempInput += open;
          } else {
            tempInput += close;
          }
          started = !started;
          console.log(input);
        }
      }
    }
    return tempInput + input;
  }
  handleCodeBlocks(input: string) {
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
      tempInput += '<td valign="top">' + lines + '</td><td valign="top">' + rejoinedCode + '</td>'
      tempInput += close;
      console.log(tempInput)
    }
    return tempInput + input;
  }
  handleBlock(input: string) {

  }
  handleBigBlocks(input: string) {
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
      } else {
        var block = input.split('\n');
        input = '';
      }
      var rejoinedBlock = block.join('<br>');
      tempInput += open + rejoinedBlock + close;
      console.log(tempInput);
    }
    return tempInput + input;
  }
  stripExtraBackSlashes(input: string) {
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
  }
}

class Binder {
  private elementListeners: Array<Bound>;
  private value;
  constructor() {
    this.elementListeners = new Array<Bound>();
  }
  get() {
    return this.value;
  }
  set(newValue) {
    this.value = newValue;
    for (var listener of this.elementListeners) {
      listener.update(this.value)
    }
  }
  addListener(listener: Bound) {
    document.getElementById(listener.getId())
      .addEventListener('input', this.changeHandler)
    this.elementListeners.push(listener);
  }
  public changeHandler = (event) => {
    this.set(event.target.value);
  }
}
