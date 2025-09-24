const elements = {
  addBtn: document.getElementById('addBtn'),
  modal: document.getElementById('modal'),
  editModal: document.getElementById('editPos'),
  closeModalBtn: document.getElementById('closeModalBtn'),
  closeEditModal: document.getElementById('closeEditBtn'),
  confirmWrapper: document.getElementById('confirmWrapper'),
  confirmNo: document.getElementById('noBtn'),
  confirmYes: document.getElementById('yesBtn'),
  closeConfirm: document.getElementById('confirmClose'),
  submitBtn: document.getElementById('submitPost'),
  saveEditBtn: document.getElementById('saveEdit'),
  latestStory: document.getElementById('blogStory'),
  blogTitle: document.getElementById('title'),
  blogSubTitle: document.getElementById('subtitle'),
  blogImg: document.getElementById('imageUrl'),
  blogDesc: document.getElementById('description'),
  editTitle: document.getElementById('editTitle'),
  editSubTitle: document.getElementById('editSubTitle'),
  editImg: document.getElementById('changeImg'),
  editDesc: document.getElementById('editDescription'),
};

let saveBlog = JSON.parse(localStorage.getItem('blog')) || [];
let postIdToDelete = null;
let postIdToEdit = null;

const saveToStorage = () =>
  localStorage.setItem('blog', JSON.stringify(saveBlog));

const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

function addBlog(e) {
  e.preventDefault();

  const title = elements.blogTitle.value.trim();
  const subTitle = elements.blogSubTitle.value.trim();
  const description = elements.blogDesc.value.trim();
  const file = elements.blogImg.files[0];

  if (!title || !subTitle || !description || !file) {
    return alert('Please complete the form before submitting.');
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    const post = {
      id: Date.now(),
      title,
      subTitle,
      description,
      postImg: e.target.result,
      date: new Date().toISOString(),
    };

    saveBlog.push(post);
    saveToStorage();
    closeModal();
    renderBlogs();
  };

  reader.onerror = () => alert('Failed to read the image file.');
  reader.readAsDataURL(file);
}

function emptyLatestStory() {
  elements.latestStory.innerHTML =
    '<p class="emptyLatestStories">No latest stories post yet...</p>';
}

function renderBlogs() {
  elements.latestStory.innerHTML = '';

  if (saveBlog.length === 0) {
    emptyLatestStory();
    return;
  }

  saveBlog.forEach((post) => {
    const div = document.createElement('div');
    div.classList.add('article');
    div.dataset.postId = `post-${post.id}`;

    div.innerHTML = `
      <div class="user-info">
        <div class="user">
          <div class="user-profile">
            <a href="#">User Name</a>
            <p class="datePost dates" data-post-id="post-${post.id}">${formatDate(post.date)}</p>
          </div>
        </div>

        <button class="option">
          <img src="../assets/option.png" alt="Options">
        </button>

        <div class="option-wrapper">
          <div class="option-buttons">
            <button class="edit"><img src="../assets/edit.png" alt="Edit"> Edit</button>
            <button class="delete"><img src="../assets/delete.png" alt="Delete"> Delete</button>
          </div>
        </div>
      </div>

      <img src="${post.postImg}" alt="" class="article-img">

      <div class="article-info">
        <h2 class="article-title"><a class="article-link">${post.title}</a></h2>
        <h3 class="article-subTitle">${post.subTitle}</h3>
        <div class="article-desc-wrapper">
          <p class="article-description mainArticleDesc">${post.description}</p>
        </div>
        <button class="seeMore">See More</button>
      </div>

      <div class="interaction-buttons">
        <button class="share">Share</button>
        <button class="comment">Comment</button>
        <button class="likeBtn" data-post-id="post-${post.id}">Like</button>
      </div>
    `;
    elements.latestStory.appendChild(div);
  });

  elements.blogTitle.value = '';
  elements.blogSubTitle.value = '';
  elements.blogDesc.value = '';
  elements.blogImg.value = '';

  initOptionButtons();
  initLikeButtons();
  initSeeMoreButtons();
}

function initOptionButtons() {
  const optionButtons = elements.latestStory.querySelectorAll('.option');
  optionButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const buttons = btn.nextElementSibling.querySelector('.option-buttons');
      buttons.classList.toggle('openOption');
    });
  });
}

function initSeeMoreButtons() {
  const seeMoreButtons = elements.latestStory.querySelectorAll('.seeMore');
  seeMoreButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const desc = btn.previousElementSibling.querySelector('.mainArticleDesc');
      desc.classList.toggle('expanded');
      btn.innerText = desc.classList.contains('expanded') ? 'See Less' : 'See More';
    });
  });
}

function initLikeButtons() {
  const likeButtons = elements.latestStory.querySelectorAll('.likeBtn');
  likeButtons.forEach((button) => {
    const postId = button.dataset.postId;
    const isLiked = localStorage.getItem(`liked-${postId}`) === 'true';

    button.classList.toggle('liked', isLiked);
    button.innerText = isLiked ? 'Unlike' : 'Like';

    button.addEventListener('click', () => {
      const liked = button.classList.toggle('liked');
      button.innerText = liked ? 'Unlike' : 'Like';
      localStorage.setItem(`liked-${postId}`, liked.toString());
    });
  });
}

function closeAllOptionWrappers() {
  elements.latestStory.querySelectorAll('.option-buttons.openOption').forEach((btn) =>
    btn.classList.remove('openOption')
  );
}

function openModal() {
  elements.modal.classList.add('show');
}

function closeModal() {
  elements.modal.classList.remove('show');
}

function openEdit() {
  elements.editModal.classList.add('openEdit');
}

function closeEdit() {
  elements.editModal.classList.remove('openEdit');
}

function openConfirm() {
  elements.confirmWrapper.classList.add('showConfirm');
}

function closeConfirm() {
  elements.confirmWrapper.classList.remove('showConfirm');
}

elements.latestStory.addEventListener('click', (e) => {
  const target = e.target;

  if (target.closest('.edit')) {
    const article = target.closest('.article');
    postIdToEdit = article.dataset.postId.replace('post-', '');

    const post = saveBlog.find((p) => p.id.toString() === postIdToEdit);
    if (!post) return;

    elements.editTitle.value = post.title;
    elements.editSubTitle.value = post.subTitle;
    elements.editDesc.value = post.description;
    openEdit();
    closeAllOptionWrappers();
  } else if (target.closest('.delete')) {
    const article = target.closest('.article');
    postIdToDelete = article.dataset.postId.replace('post-', '');
    openConfirm();
    closeAllOptionWrappers();
  } else if (target.closest('.share')) {
    alert('Share this article');
  }
});

elements.confirmYes.addEventListener('click', () => {
  if (postIdToDelete !== null) {
    const index = saveBlog.findIndex((post) => post.id.toString() === postIdToDelete);
    if (index !== -1) {
      saveBlog.splice(index, 1);
      saveToStorage();
      renderBlogs();
    }
    postIdToDelete = null;
    closeConfirm();
  }
});

elements.saveEditBtn.addEventListener('click', () => {
  const title = elements.editTitle.value.trim();
  const subTitle = elements.editSubTitle.value.trim();
  const description = elements.editDesc.value.trim();

  if (!title || !subTitle || !description) {
    return alert('Please fill out all fields before saving edits.');
  }

  const index = saveBlog.findIndex((post) => post.id.toString() === postIdToEdit);
  if (index !== -1) {
    saveBlog[index].title = title;
    saveBlog[index].subTitle = subTitle;
    saveBlog[index].description = description;

    const file = elements.editImg.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        saveBlog[index].postImg = e.target.result;
        saveToStorage();
        renderBlogs();
        closeEdit();
        postIdToEdit = null;
      };
      reader.readAsDataURL(file);
    } else {
      saveToStorage();
      renderBlogs();
      closeEdit();
      postIdToEdit = null;
    }
  }
});

elements.addBtn.addEventListener('click', openModal);
elements.closeModalBtn.addEventListener('click', closeModal);
elements.closeEditModal.addEventListener('click', closeEdit);
elements.closeConfirm.addEventListener('click', closeConfirm);
elements.confirmNo.addEventListener('click', closeConfirm);
elements.submitBtn.addEventListener('click', addBlog);

renderBlogs();
