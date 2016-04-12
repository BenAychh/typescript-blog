/// <reference path="./prettyPrintMarkup.ts"/>
/// <reference path="./jquery.d.ts"/>
/// <reference path="./jadeImports.ts"/>
let ppm = new prettyPrintMarkup();

class displayPosts {
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
    $.getJSON(url,
      remotePosts => {
        remotePosts.forEach(post => {
          this.posts.push(new Post(post));
        });
        this.refreshPage();
      });
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
  public getSection(): HTMLElement {
    return this.section;
  }
}
let display = new displayPosts(<HTMLDivElement>document.getElementById('posts'));
display.getPosts();
