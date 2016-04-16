class FileUpload extends HTMLElement {
}
class S3upLoader {
    constructor(fileUploadName, pUploadUrl, pCallback) {
        this.uploadUrl = pUploadUrl;
        this.callback = pCallback;
        console.log(this.callback);
        let fileUpload = document.getElementById(fileUploadName);
        fileUpload.onchange = () => {
            this.file = fileUpload.files[0];
            if (this.file) {
                this.getSignedRequest();
            }
        };
    }
    getSignedRequest() {
        $.getJSON(this.uploadUrl + '?fileName=' + this.file.name + '&fileType=' + this.file.type)
            .done(response => {
            this.uploadFile(response.signedRequest, response.url);
        })
            .fail(error => {
            console.log(error);
            alert('Could not get signed request');
        });
    }
    uploadFile(signedRequest, url) {
        var xhr = new XMLHttpRequest();
        xhr.open("PUT", signedRequest);
        xhr.setRequestHeader('x-amz-acl', 'public-read');
        xhr.onload = () => {
            if (xhr.status === 200) {
                this.callback(url);
            }
        };
        xhr.onerror = () => {
            alert("Could not upload file.");
        };
        xhr.send(this.file);
    }
}
