/// <reference path="./prettyPrintMarkup.ts"/>
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
    let pretty = new prettyPrintMarkup();
    document.getElementById(this.getId()).innerHTML = pretty.parser(value);
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
    for (let listener of this.elementListeners) {
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
