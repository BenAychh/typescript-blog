class AddableDropdown {
  private optionArray: Array<string>;
  private dropdown: HTMLInputElement;
  constructor(id: string, callback?: (event) => void) {
    this.optionArray = [];
    this.dropdown = <HTMLInputElement>document.getElementById(id);
    if (callback) {
      this.dropdown.onchange = (event) => {
        callback(this.dropdown.value);
      };
    }
  }
  addElement(value: string, title?: string) {
    let element: string = '<option value="' + value + '">';
    if (title) {
      element += title;
    } else {
      element += value;
    }
    element += '</option>';
    this.optionArray.push(element);
    this.dropdown.innerHTML = this.optionArray.join('');
  }
}
