var typeBinder = new Binder();
typeBinder.addListener(new Bound('inputText'));
typeBinder.addListener(new ParsedBound('inputResult'));
let uploader = new S3upLoader('file', '/posts/signS3', (url) => {
    insertInputTextAtCaret('<img class="img-responsive" src="' + url + '" alt="">');
});
function insertInputTextAtCaret(text) {
    text = text;
    let inputText = document.getElementById('inputText');
    if (inputText.selectionStart || inputText.selectionStart === 0) {
        var startPos = inputText.selectionStart;
        var endPos = inputText.selectionEnd;
        inputText.value = inputText.value.substring(0, startPos) +
            text +
            inputText.value.substring(endPos, inputText.value.length);
        inputText.selectionStart = startPos + text.length;
        inputText.selectionEnd = startPos + text.length;
    }
    else {
        inputText.value += text;
    }
}
;
