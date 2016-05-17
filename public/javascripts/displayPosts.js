let ppm = new prettyPrintMarkup();
class DisplayPosts {
    constructor(pDisplayDiv) {
        this.displayDiv = pDisplayDiv;
    }
    getPosts() {
        let url = "/posts/" + id;
        $.getJSON(url)
            .done(remotePost => {
            this.post = remotePost;
            this.refreshPage();
        })
            .fail(error => {
            alert('Having trouble loading posts');
            console.log(error);
        });
    }
    refreshPage() {
        let firstChild = this.displayDiv.firstChild;
        while (firstChild) {
            this.displayDiv.removeChild(firstChild);
            firstChild = this.displayDiv.firstChild;
        }
        this.displayDiv.appendChild(new Post(this.post).getSection());
        window.history.pushState({}, '', '/blog/' + id);
    }
}
class Post {
    constructor(postInfo) {
        this.section = document.createElement('section');
        let title = document.createElement('h1');
        title.innerHTML = postInfo.title;
        this.section.appendChild(title);
        let spacer = document.createElement('h1');
        spacer.className = 'spacer';
        spacer.innerHTML = '___';
        this.section.appendChild(spacer);
        let author = document.createElement('h4');
        author.innerHTML = 'Author: ' + postInfo.user.userName;
        this.section.appendChild(author);
        let date = document.createElement('h4');
        date.className = 'subheader';
        date.innerHTML = 'Created: ' + new Date(postInfo.createdAt) + '<br>'
            + 'Updated: ' + new Date(postInfo.updatedAt);
        this.section.appendChild(date);
        let bodyP = document.createElement('p');
        bodyP.innerHTML = ppm.parser(postInfo.blogText.split('\r').join(''));
        this.section.appendChild(bodyP);
        let blogControl = document.createElement('div');
        blogControl.className = 'blogControl share';
        let previous = document.createElement('div');
        previous.className = 'prev clickable';
        if (postInfo.previous) {
            previous.onclick = (event) => {
                updatePost(postInfo.previous, event);
            };
        }
        else {
            previous.className += ' disabled';
        }
        previous.innerHTML = '< Prev';
        let next = document.createElement('div');
        next.className = 'next clickable';
        if (postInfo.next) {
            next.onclick = (event) => {
                updatePost(postInfo.next, event);
            };
        }
        else {
            next.className += ' disabled';
        }
        next.innerHTML = 'Next >';
        blogControl.appendChild(previous);
        blogControl.appendChild(next);
        let sharing = document.createElement('div');
        sharing.className = 'blogControl share';
        let shareWord = document.createElement('div');
        shareWord.className = 'prev';
        shareWord.innerHTML = 'share';
        let shareButtons = document.createElement('div');
        shareButtons.className = 'next';
        shareButtons.innerHTML =
            '<a href="mailto:?body=http://benaychh.io/blog/' + id + '&subject=' + postInfo.title + '"><i class="icon-envelope icons"></i></a>'
                + '<a target="_blank" href="http://www.facebook.com/sharer/sharer.php?u=http://benaychh.io/blog/' + id + '&title=' + postInfo.title.split(' ').join('%20') + '"><i class="icon-social-facebook icons"></i></a>'
                + '<a target="_blank" href="http://twitter.com/intent/tweet?status=' + postInfo.title.split(' ').join('%20') + '+' + 'http://benaychh.io/blog/' + id + '"><i class="icon-social-twitter icons"></i></a>'
                + '<a href="https://plus.google.com/share?url=' + 'http://benaychh.io/blog/' + id + '"><i class="icon-social-google icons"></i></a>';
        sharing.appendChild(shareWord);
        sharing.appendChild(shareButtons);
        this.section.appendChild(blogControl);
        this.section.appendChild(sharing);
    }
    getSection() {
        return this.section;
    }
}
function updatePost(newId, event) {
    id = newId;
    display.getPosts();
    if (event) {
        event.preventDefault();
    }
    $('#posts').animate({
        scrollTop: 0,
    }, 300);
}
let display = new DisplayPosts(document.getElementById('posts'));
display.getPosts();
