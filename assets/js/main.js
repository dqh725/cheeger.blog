import 'simple-jekyll-search';
import $ from 'jquery';
import 'slick-carousel';
import 'particles.js';
import conf from './particles.js';

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
});

$(document).ready(function() {
  $('.slick').slick({
    infinite: true,
    dots: true,
    arrows: false
  });

  particlesJS('particles-js', conf);
});
