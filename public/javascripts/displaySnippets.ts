/// <reference path="./displayPosts.ts"/>
class DisplaySnippets {
  private displayDiv: HTMLDivElement;
  private snippets: Array<Snippet> = [];
  private offSet = 0;
  private limit = 5;
  constructor(pDisplayDiv:HTMLDivElement) {
    this.displayDiv = pDisplayDiv;
  }
  public getSnippets() {
    let url = "/posts/snippets?pLimit=" + this.limit
      + "&pOffset=" + this.offSet;
    $.getJSON(url,
      remotePosts => {
        for (let i = 0; i < Math.min(this.limit, remotePosts.length); i++) {
          this.snippets.push(new Snippet(remotePosts[i]));
        }
        this.refreshPage(remotePosts.length === this.limit + 1 ? true : false);
      });
  }
  private refreshPage(more: boolean) {
    let firstChild: Node = this.displayDiv.firstChild;
    while(firstChild) {
      this.displayDiv.removeChild(firstChild);
      firstChild = this.displayDiv.firstChild;
    }
    this.snippets.forEach((snippet, index) => {
      this.displayDiv.appendChild(snippet.getDiv());
    });
    if (more) {
      let loadMore = document.createElement('a');
      loadMore.className = 'btn btn-default btn-lg btn-block load-more';
      loadMore.onclick = (event) => {
        this.loadMoreSnippets(event);
      }
      loadMore.innerHTML = 'Load More'
      this.displayDiv.appendChild(loadMore);
    }
  }
  loadMoreSnippets(event: Event) {
    event.preventDefault();
    this.offSet += this.limit;
    this.getSnippets();
  }
}

class Snippet {
  private mediaDiv:HTMLDivElement = <HTMLDivElement>document.createElement('div');
  constructor(postInfo: any) {
    this.mediaDiv.className = 'horzPanel clickable';
    this.mediaDiv.onclick = () => {
      updatePost(postInfo.id, null);
    }
    var h4 = document.createElement('h4');
    h4.innerHTML = postInfo.title;
    var dateP = document.createElement('p');
    dateP.className = 'article-date'
    dateP.innerHTML = 'Updated: ' + new Date(postInfo.updatedAt);
    var descriptionP = document.createElement('p');
    descriptionP.innerHTML = postInfo.description;
    this.mediaDiv.appendChild(h4);
    this.mediaDiv.appendChild(dateP);
    this.mediaDiv.appendChild(descriptionP);
  }
  public getDiv() {
    return this.mediaDiv;
  }
}



let snippets = new DisplaySnippets(<HTMLDivElement>document.getElementById('snippets'));
snippets.getSnippets();
