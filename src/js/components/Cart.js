import {select, settings, classNames, templates} from './../settings.js';
import {utils} from './../utils.js';
import CartProduct from './CartProduct.js';

class Cart{
  constructor(element){
    const thisCart = this;

    thisCart.products = [];

    thisCart.getElements(element);
    thisCart.initActions();
    console.log('new Cart: ', thisCart);
  }

  getElements(element){
    const thisCart = this;

    thisCart.dom = {};

    thisCart.dom.wrapper = element;
    thisCart.dom.toggleTrigger = element.querySelector(select.cart.toggleTrigger);
    thisCart.dom.productList = element.querySelector(select.cart.productList);
    thisCart.dom.totalNumber = element.querySelector(select.cart.totalNumber);
    thisCart.dom.subtotalPrice = element.querySelector(select.cart.subtotalPrice);
    thisCart.dom.deliveryFee = element.querySelector(select.cart.deliveryFee);
    thisCart.dom.totalPrice = element.querySelectorAll(select.cart.totalPrice);
    thisCart.dom.form = element.querySelector(select.cart.form);
    thisCart.dom.phone = element.querySelector(select.cart.phone);
    thisCart.dom.address = element.querySelector(select.cart.address);
  }

  initActions(){
    const thisCart = this;
    thisCart.dom.toggleTrigger.addEventListener('click', function(){
      thisCart.dom.wrapper.classList.toggle(classNames.cart.wrapperActive);
    });
    thisCart.dom.productList.addEventListener('updated', function(){
      thisCart.update();
    });
    thisCart.dom.productList.addEventListener('remove', function(event){
      thisCart.remove(event.detail.cartProduct);
    });
    thisCart.dom.form.addEventListener('submit', function(event){
      event.preventDefault();
      thisCart.sendOrder();
    });
  }

  add(menuProduct){
    const thisCart = this;
    
    /* generate HTML based on template */
    const generateHTML = templates.cartProduct(menuProduct);
    //console.log('cart generateHTML', generateHTML);
    /* create element using utils.createElementFromHTML */
    const generateDOM = utils.createDOMFromHTML(generateHTML);
    /* find menu container */
    thisCart.dom.productList.appendChild(generateDOM);

    thisCart.products.push(new CartProduct (menuProduct, generateDOM));
    console.log('thisCart.products: ', thisCart.products);
      
    thisCart.update();
  }

  remove(cartProduct){
    const thisCart = this;

    cartProduct.dom.wrapper.remove();
    const productIndexOf = thisCart.products.indexOf(cartProduct);
    thisCart.products.splice(productIndexOf, 1);

    thisCart.update();
  }

  update(){
    const thisCart = this;

    let deliveryFee;
    let totalNumber = 0;
    let subtotalPrice = 0;

    for(let product of thisCart.products){
      totalNumber += product.amount;
      console.log(totalNumber);
      subtotalPrice += product.price;
      console.log(subtotalPrice);
    }

    if(totalNumber == 0){
      deliveryFee = 0;
    } else {
      deliveryFee = settings.cart.defaultDeliveryFee;
    }

    thisCart.totalPrice = subtotalPrice + deliveryFee;
    console.log(thisCart.totalPrice);

    thisCart.dom.subtotalPrice.innerHTML = subtotalPrice;
    thisCart.dom.deliveryFee.innerHTML = deliveryFee;
    thisCart.dom.totalPrice.innerHTML = thisCart.totalPrice;

    thisCart.subtotalPrice = subtotalPrice;
    thisCart.deliveryFee = deliveryFee;
    thisCart.totalNumber = totalNumber;

    for (const totalPriceDOM of thisCart.dom.totalPrice) {
      totalPriceDOM.innerHTML = thisCart.totalPrice;
    }
  }
    
  sendOrder(){
    const thisCart = this;

    const url = settings.db.url + '/' + settings.db.orders;
      
    const payload = {
      address: thisCart.dom.address.value,
      phone: thisCart.dom.phone.value,
      totalNumber: thisCart.totalNumber,
      subtotalPrice: thisCart.subtotalPrice,
      deliveryFee:  thisCart.deliveryFee,
      totalPrice:  thisCart.totalPrice,
      products: [],
    };

    for(let prod of thisCart.products) {
      payload.products.push(prod.getData());
    }

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };

    fetch(url, options);
  }
}

export default Cart;