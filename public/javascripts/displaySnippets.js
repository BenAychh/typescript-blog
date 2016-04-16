class DisplaySnippets {
    constructor(pDisplayDiv) {
        this.snippets = [];
        this.offSet = 0;
        this.displayDiv = pDisplayDiv;
    }
    getSnippets() {
        let url = "http://localhost:3000/posts?pLimit=5&pOffset=" + this.offSet;
        $.getJSON(url, remotePosts => {
            remotePosts.forEach(post => {
                this.snippets.push(new Snippet(post));
            });
            this.refreshPage();
        });
    }
    refreshPage() {
        this.snippets.forEach((snippet) => {
            this.displayDiv.appendChild(snippet.getDiv());
        });
    }
}
class Snippet {
    constructor(postInfo) {
        this.mediaDiv = document.createElement('div');
        this.mediaDiv.className = 'media';
        var giantLink = document.createElement('a');
        giantLink.className = "pull-left";
        giantLink.href = '#';
        var subMediaDiv = document.createElement('div');
        subMediaDiv.className = 'media-body';
        var h4 = document.createElement('h4');
        h4.innerHTML = postInfo.title;
        var dateP = document.createElement('p');
        dateP.className = 'article-date';
        dateP.innerHTML = postInfo.updatedAt;
        var descriptionP = document.createElement('p');
        descriptionP.innerHTML = postInfo.description;
        giantLink.appendChild(h4);
        giantLink.appendChild(dateP);
        giantLink.appendChild(descriptionP);
        subMediaDiv.appendChild(giantLink);
        subMediaDiv.appendChild(giantLink);
        this.mediaDiv.appendChild(subMediaDiv);
    }
    getDiv() {
        return this.mediaDiv;
    }
}
let snippets = new DisplaySnippets(document.getElementById('snippets'));
snippets.getSnippets();
