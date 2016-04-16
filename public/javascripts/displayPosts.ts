/// <reference path="./prettyPrintMarkup.ts"/>
/// <reference path="./jquery.d.ts"/>
/// <reference path="./jadeImports.ts"/>
let ppm = new prettyPrintMarkup();

class DisplayPosts {
  private displayDiv: HTMLDivElement;
  private posts: Array<Post> = [];
  constructor(pDisplayDiv:HTMLDivElement) {
    this.displayDiv = pDisplayDiv;
  }
  public getPosts() {
    let url = "http://localhost:3000/posts";
    if (id !== 0) {
      url += '/' + id;
    }
    console.log(url);
    $.getJSON(url)
    .done( remotePosts => {
      remotePosts.forEach(post => {
        this.posts.push(new Post(post));
      });
      this.refreshPage();
    })
    .fail( error => {
      alert('Having trouble loading posts')
      console.log(error);
    })
  }
  private refreshPage() {
    this.posts.forEach((post) => {
      this.displayDiv.appendChild(post.getSection());
    });
  }
}
class Post {
  private section = document.createElement('section');
  constructor(postInfo: any) {
    let title = document.createElement('h1');
    title.innerHTML = postInfo.title
    this.section.appendChild(title);
    let spacer = document.createElement('h1');
    spacer.className = 'spacer';
    spacer.innerHTML = '___';
    this.section.appendChild(spacer);
    let author = document.createElement('h4');
    author.innerHTML = 'Author: ' + postInfo.user.userName;
    this.section.appendChild(author);
    let date = document.createElement('h4');
    date.innerHTML = 'Created: ' +  new Date(postInfo.createdAt) + '<br>'
      + 'Updated: ' + new Date(postInfo.updatedAt);
    this.section.appendChild(date);
    let bodyP = document.createElement('p');
    bodyP.innerHTML = ppm.parser(postInfo.blogText.split('\r').join(''));
    this.section.appendChild(bodyP);
    let pager = document.createElement('ul');
    pager.className = 'pager';
    let previous = document.createElement('li');
    previous.className = 'previous';
    previous.innerHTML = '<a href="#">< Prev</a>';
    let next = document.createElement('li');
    next.innerHTML = '<a href="#">Next ></a>';
    next.className = 'next';
    pager.appendChild(previous);
    pager.appendChild(next)
    this.section.appendChild(pager);
    let sharing = document.createElement('div');
    sharing.className = 'row'
    let shareWord = document.createElement('div');
    shareWord.className = 'col-lg-4 col-md-4 col-sm-4 col-xs-4';
    let shareWordh3 = document.createElement('h3');
    shareWordh3.className = 'share';
    shareWordh3.innerHTML = 'Share';
    let shareButtons = document.createElement('div');
    shareButtons.className = 'col-lg-8 col-md-8 col-sm-8 col-xs-8 text-right';
    shareButtons.innerHTML =
      '<a href="#"><img class="social" src="/img/icon/icon-mail.png" alt="Mail"></a>'
      + '<a href="#"><img class="social" src="/img/icon/icon-facebook.png" alt="Facebook"></a>'
      + '<a href="#"><img class="social" src="/img/icon/icon-twitter.png" alt="Twitter"></a>'
      + '<a href="#"><img class="social" src="/img/icon/icon-google.png" alt="icon-google.png"></a>';
    sharing.appendChild(shareWord);
    shareWord.appendChild(shareWordh3);
    sharing.appendChild(shareButtons);
    this.section.appendChild(sharing);
  }
  public getSection(): HTMLElement {
    return this.section;
  }
}

let display = new DisplayPosts(<HTMLDivElement>document.getElementById('posts'));
display.getPosts();
