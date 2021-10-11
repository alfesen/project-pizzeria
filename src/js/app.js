import {
  settings,
  select,
  classNames,
  templates
} from './settings.js'; //kropka i slash są cholernie ważne
import Product from './components/Product.js';
import Cart from './components/Cart.js';
import Booking from './components/Booking.js';

export const app = {

  initPages: function () {
    const thisApp = this;

    thisApp.pages = document.querySelector(select.containerOf.pages).children;
    thisApp.navLinks = document.querySelectorAll(select.nav.links);
    
    const idFromHash = window.location.hash.replace('#/', '');
    
    let pageMatchingHash = thisApp.pages[0].id;
    
    for(let page of thisApp.pages){
      if(page.id == idFromHash){
        pageMatchingHash = page.id;
        break; //this line stops iteration
      }
    }

    thisApp.activatePage(pageMatchingHash);
    
    for(let link of thisApp.navLinks){
      link.addEventListener('click', function(event){
        const clickedElement = this;
        
        event.preventDefault();
        /* get page id from href attribute*/ /* = delete # from href to get id */
        const id = clickedElement.getAttribute('href').replace('#', ''); // replace # with an empty string
        /* run thisApp.activatePage(id) */
        thisApp.activatePage(id);

        /* change URL hash */
        window.location.hash = '#/' + id; // slash prevents skipping to div with this id
      });
    }
  },

  activatePage: function (pageId) {
    const thisApp = this;
    /* add class "active" to matching pages, remove from non-matching */
    for (let page of thisApp.pages) {
      page.classList.toggle(classNames.pages.active, page.id == pageId);
    }
    /* add class "active" to matching links, remove from non-matching */
    for (let link of thisApp.navLinks) {
      link.classList.toggle(
        classNames.nav.active,
        link.getAttribute('href') == '#' + pageId
      );
    }
  },

  initMenu: function () {
    const thisApp = this;

    console.log('thisApp.data: ', thisApp.data);

    for (let productData in thisApp.data.products) {
      new Product(thisApp.data.products[productData].id, thisApp.data.products[productData]);
    }
  },

  initBooking: function(){
    const thisApp = this;

    const booking = document.querySelector(select.containerOf.booking);
    thisApp.booking = new Booking (booking);
  },

  initData: function () {
    const thisApp = this;

    thisApp.data = {};
    const url = settings.db.url + '/' + settings.db.products;

    fetch(url) // fetch(połącz się), zapytanie(request) pod podany adres endpointu(url)
      .then(function (rawResponse) { // odpowiedź w formacie JSON
        return rawResponse.json(); // konwersja odpowiedzi na obiekt JS-owy
      })
      .then(function (parsedResponse) { // kolejny krok algorytmu
        console.log('parsedResponse: ', parsedResponse);

        /* save parsedResponse as thisApp.data.products */
        thisApp.data.products = parsedResponse;
        /* execute initMenu method */
        thisApp.initMenu();
      });

    console.log('thisApp.data', JSON.stringify(thisApp.data));
  },

  init: function () {
    const thisApp = this;
    console.log('*** App starting ***');
    console.log('thisApp:', thisApp);
    console.log('classNames:', classNames);
    console.log('settings:', settings);
    console.log('templates:', templates);

    thisApp.initData();
    thisApp.initCart();
    thisApp.initPages();
    thisApp.initBooking();
  },

  initCart: function () {
    const thisApp = this;

    const cartElem = document.querySelector(select.containerOf.cart);
    thisApp.cart = new Cart(cartElem);

    thisApp.productList = document.querySelector(select.containerOf.menu);

    thisApp.productList.addEventListener('add-to-cart', function (event) {
      app.cart.add(event.detail.product);
    });
  },
};

app.init();