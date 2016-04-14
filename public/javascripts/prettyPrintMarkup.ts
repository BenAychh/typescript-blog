class prettyPrintMarkup {
  public parser(input: string) {
    input = this.handleCodeBlocks(input);
    input = this.handleBlocks(input);
    input = input.split('\n').join('<br>');
    input = this.handleSpecial('*', input, '<span class="bold">');
    input = this.handleSpecial('~', input, '<span class="strikethrough">');
    input = this.handleSpecial('`', input, '<span class="code">');
    input = this.handleSpecial('_', input, '<span class="italics">');
    input = this.stripExtraBackSlashes(input);
    return input;
  }
  private handleSpecial(character: string, input: string, open: string) {
    let started = false;
    let inCode = false;
    let index = 0;
    let tempInput = '';
    let close = '</' + open.substring(1, open.indexOf(' ')) + '>';
    let count = 0;
    let localIndex = 0;
    if (input[0] == character) {
      tempInput += open;
      started = true;
      input = input.substring(1);
    }
    for (let i = 0; i < input.length; i++){
      let currentChar = input[i];
      if (currentChar == '<' && input[i + 1] == 'c'
        && input[i + 2] == 'o' && input[i + 3] == 'd' && input[i + 4] == 'e'
        && input[i + 5] == '>') {
        inCode = true;
      } else if (currentChar == '<' && input[i + 1] == '/'
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
          } else {
            tempInput += close;
          }
          started = !started;
        }
      }
    }
    return tempInput + input;
  }
  handleCodeBlocks(input: string) {
    let started = false;
    let index = 0;
    let tempInput = '';
    let open = '<icode><table><tr>';
    let close = '</tr></table></icode>';
    let count = 0;
    let localIndex = 0;
    while (input.indexOf('<icode>\n') != -1) {
      let startIndex = input.indexOf('<icode>');
      tempInput += input.substring(0, startIndex);
      input = input.substring(startIndex + 8);
      let endIndex = input.indexOf('\n</icode>');
      let code = input.substring(0, endIndex).split(/(?:\r\n|\r|\n)/g);
      input = input.substring(endIndex + 9);
      let lines = '';
      for (let i = 0; i < code.length; i++) {
        lines += (i + 1) + '<br>';
        code[i] = code[i].split(' ').join('&nbsp;').split('<').join('&#60;').split('>').join('&#62;');
      }
      let rejoinedCode = code.join('<br>');
      tempInput += open;
      tempInput += '<td valign="top">' + lines + '</td><td valign="top">' + rejoinedCode + '</td>'
      tempInput += close;
    }
    return tempInput + input;
  }
  handleBlocks(input: string) {
    let started = false;
    let index = 0;
    let tempInput = '';
    let open = '<block>';
    let close = '</block>';
    let count = 0;
    while (input.indexOf('<block>\n') != -1) {
      let startIndex = input.indexOf('<block>\n');
      tempInput += input.substring(0, startIndex);
      input = input.substring(startIndex + 8);
      let endIndex = input.indexOf('</block>\n');
      let code = input.substring(0, endIndex);
      input = input.substring(endIndex + 9);
      tempInput += open;
      tempInput += code
      tempInput += close;
    }
    return tempInput + input;
  }
  stripExtraBackSlashes(input: string) {
    let started = false;
    let index = 0;
    let tempInput = '';
    let count = 0;
    while (input.indexOf('\\') != -1) {
      let index = input.indexOf('\\');
      tempInput += input.substring(0, index) + (input[index + 1] || '');
      input = input.substring(index + 2);
    }
    return tempInput + input;
  }
}
