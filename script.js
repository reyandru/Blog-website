const story = document.getElementById('stories');
const saveBlog = JSON.parse(localStorage.getItem('blog')) || [];

function renderStories() {
  story.innerHTML = '';

  if (saveBlog.length === 0) {
    emptyStory();
    return;
  }

  saveBlog.forEach((post) => {
    const link = document.createElement('a');
    link.href = 'html/blog.html';
    link.className = 'story-wrapper';

    const storyDiv = document.createElement('div');
    storyDiv.className = 'story';

    const img = document.createElement('img');
    img.src = post.postImg;
    img.alt = '';
    img.className = 'story-img';

    const textDiv = document.createElement('div');
    textDiv.className = 'story-text';

    const title = document.createElement('h1');
    title.className = 'story-title';
    const titleText = document.createElement('p');
    titleText.className = 'story-link';
    titleText.innerText = post.title;
    title.appendChild(titleText);

    const subTitle = document.createElement('h3');
    subTitle.className = 'story-subtitle';
    subTitle.innerText = post.subTitle;

    textDiv.appendChild(title);
    textDiv.appendChild(subTitle);
    storyDiv.appendChild(img);
    storyDiv.appendChild(textDiv);
    link.appendChild(storyDiv);
    story.appendChild(link);
  });
}

function emptyMessages(text, cname) {
  const p = document.createElement('p');
  p.classList.add(cname);
  p.innerText = text;
  return p;
}

function emptyStory() {
  if (story.children.length === 0) {
    story.appendChild(emptyMessages("No latest stories show...", "emptyStories"));
  }
}

renderStories();
