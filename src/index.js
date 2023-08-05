import { Notify } from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import { fetchImages } from './js/server-api';
import './css/styles.css';


const refs ={
    searchForm:document.querySelector('.search-form'),
    submitBtn:document.querySelector('.submit'),
    gallery:document.querySelector('.gallery'),
    loadMoreBtn:document.querySelector('.load-more'),
}

refs.searchForm.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', loadMoreImgs);
refs.loadMoreBtn.classList.add('is-hidden');

let searchResults = '';
let page = 1;
const perPage = 40;
const paramsForNotify = {
    timeout: 5000,
    width: '500px',
    fontSize: '12px'
};

function onSearch(e){
    e.preventDefault();

    refs.gallery.innerHTML = '';
    page = 1;

   let q = e.target.firstElementChild.value.trim();
    if (q === '') {
        Notify.info('Enter your request, please!', paramsForNotify);
        return;
    }

      fetchImages(q, page, perPage)
      .then(data => {
        console.log(data);
        const searchResults = data.hits;
        
          if (data.totalHits === 0) {
              Notify.failure('Sorry, there are no images matching your search query. Please try again.', paramsForNotify);
          } else {
              Notify.info(`Hooray! We found ${data.totalHits} images.`, paramsForNotify);
          }

         createGalleryCard(searchResults);
         refs.gallery.insertAdjacentHTML("beforeend", createGalleryCard(searchResults));

         const lightbox = new SimpleLightbox('.gallery a', {
            captionsData: 'alt',
            captionDelay: 250
        });
        console.log(lightbox);
         refs.loadMoreBtn.classList.remove('is-hidden');
    
      }).catch(console.log).finally()
      { e.currentTarget.reset();

    }

}


function loadMoreImgs(){
    page += 1;

    fetchImages(q, page, perPage)
      .then(data => {
        console.log(page);
        const searchResults = data.hits;
        const numberOfPage = Math.ceil(data.totalHits / perPage);
        console.log(numberOfPage);

    createGalleryCard(searchResults);
    refs.gallery.insertAdjacentHTML("beforeend", createGalleryCard(searchResults));
    if (page === numberOfPage) {
        refs.loadMoreBtn.classList.add('is-hidden');
        Notify.info("We're sorry, but you've reached the end of search results.", paramsForNotify);
        refs.loadMoreBtn.removeEventListener('click', loadMoreImgs);
}
 })
            
}


function createGalleryCard(searchResults){
    return searchResults.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
        return `<div class="photo-card">
        <div class="img_wrap">
            <a class="gallery_link" href="${largeImageURL}">
                <img src="${webformatURL}" alt="${tags}" width="320" height="240" />
            </a>
        </div>
        <div class="info">
            <div class="info-text">
            <p class="info-item">
            <b>Likes</b></p>
            <p>${likes}</p>
            </div>
            <div class="info-text>
            <p class="info-item">
            <b>Views</b></p>
            <p> ${views}</p>
            </div>
            <div class="info-text>
            <p class="info-item">
            <b>Comments</b></p>
            <p>${comments}</p>
            </div>
            <div class="info-text>
            <p class="info-item">
            <b>Downloads</b></p>
            <p>${downloads}</p>
            </div>
        </div>
        </div>`
    }).join('');
}

