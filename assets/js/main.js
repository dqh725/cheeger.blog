require('../../node_modules/simple-jekyll-search/dest/simple-jekyll-search.min.js');
require('../../node_modules/slick-carousel/slick/slick.min.js');

var sjs = SimpleJekyllSearch({
  searchInput: document.getElementById('search-input'),
  resultsContainer: document.getElementById('results-container'),
  searchResultTemplate: `
  <li>
  <span class="post-meta">{date}</span>
  <a href="{url}">{title}</a>
  <span class="tag-item">{tags} </span>
  </li>`,
  json: '/search.json'
})

$('.slick').slick();
