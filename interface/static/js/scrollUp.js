export default class ScrollUpButton {

    constructor(buttonId) {
        this.mybutton = document.getElementById(buttonId);

        window.onscroll = this.scrollFunction.bind(this);

       this.mybutton.onclick = this.topFunction.bind(this);
    }

    scrollFunction() {
        if (document.body.scrollTop > 1000 || document.documentElement.scrollTop > 1000) {
            this.mybutton.style.opacity = '1';
        } else {
            this.mybutton.style.opacity = '0';
        }
    }

    topFunction() {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    }

}