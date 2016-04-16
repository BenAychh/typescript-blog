class AddableDropdown {
    constructor(id, callback) {
        this.optionArray = [];
        this.dropdown = document.getElementById(id);
        if (callback) {
            this.dropdown.onchange = (event) => {
                callback(this.dropdown.value);
            };
        }
    }
    addElement(value, title) {
        let element = '<option value="' + value + '">';
        if (title) {
            element += title;
        }
        else {
            element += value;
        }
        element += '</option>';
        this.optionArray.push(element);
        this.dropdown.innerHTML = this.optionArray.join('');
    }
}
