let ppm = new prettyPrintMarkup();
class displayPosts {
    constructor(pDisplayDiv) {
        this.posts = [];
        this.displayDiv = pDisplayDiv;
    }
    getPosts() {
        let url = "http://localhost:3000/posts";
        if (id !== 0) {
            url += '/' + id;
        }
        console.log(url);
        $.getJSON(url, remotePosts => {
            remotePosts.forEach(post => {
                this.posts.push(new Post(post));
            });
            this.refreshPage();
        });
    }
    refreshPage() {
        this.posts.forEach((post) => {
            this.displayDiv.appendChild(post.getSection());
        });
    }
}
class Post {
    constructor(postInfo) {
        this.section = document.createElement('section');
        let authorSpan = document.createElement('span');
        authorSpan.innerHTML = 'Author: ' + postInfo.user.userName + ' ' + postInfo.id;
        this.section.appendChild(authorSpan);
        var bodyP = document.createElement('p');
        bodyP.innerHTML = ppm.parser(postInfo.blogText.split('\r').join(''));
        this.section.appendChild(bodyP);
        if (!id) {
            this.section.appendChild(document.createElement('hr'));
        }
    }
    getSection() {
        return this.section;
    }
}
let display = new displayPosts(document.getElementById('posts'));
display.getPosts();
