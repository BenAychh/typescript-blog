/// <reference path="bind.ts"/>
var typeBinder = new Binder();
typeBinder.addListener(new Bound('inputText'));
typeBinder.addListener(new ParsedBound('inputResult'));
