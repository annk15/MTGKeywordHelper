let mybutton = document.getElementById('myBtn');

window.onscroll = function(){
    scrollFunction()
};

function scrollFunction() {
    if (document.body.scrollTop > 1000 || document.documentElement.scrollTop > 1000) {
        mybutton.style.opacity = '1';
    } else {
        mybutton.style.opacity = '0';
    }
}

function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}