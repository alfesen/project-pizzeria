import {app} from './../app.js';
import {select, templates} from './../settings.js';
import {utils} from './../utils.js';

class Home {
  constructor(element){
    const thisHome = this;
    app.initHome.homeContainerOf;
    thisHome.render(element);
    thisHome.initWidgets();
  }

  render() {
    const thisHome = this;

    const generateHTML = templates.homePage();
    thisHome.element = utils.createDOMFromHTML(generateHTML);
    const homeContainer = document.querySelector(select.containerOf.home);
    homeContainer.appendChild(thisHome.element);

  }

}
export default Home;