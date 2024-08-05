export default class ScrollUpButton {

    constructor(buttonId) {
        this.mybutton = document.getElementById("topBtn");

        window.onscroll = this.scrollFunction.bind(this);

       this.mybutton.onclick = this.topFunction.bind(this);
    }

    scrollFunction() {
        if (document.body.scrollTop > 1000 || document.documentElement.scrollTop > 1000) {
            this.mybutton.classList.add("visible");
        } else {
            this.mybutton.classList.remove("visible");
        }
    }

    topFunction() {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    }

}