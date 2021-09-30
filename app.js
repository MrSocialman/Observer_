let controller;
let slideScene;
let pageScene;
let burger = document.querySelector('.burger');
let detailScene;

function animateSlides(){

    //initiate a controller
    controller = new ScrollMagic.Controller();
    const sliders = document.querySelectorAll('.slide');
    const nav = document.querySelector('.nav-header');

    sliders.forEach((slide, index, slides) => {
        const revealImg = slide.querySelector(".reveal-img");
        const img = slide.querySelector('img');
        const revealText = slide.querySelector('.reveal-text');
        //GSAP
        const slideTl = gsap.timeline({
            defaults: {duration: 1, ease: "power2.inOut"}
        });
        slideTl.fromTo(revealImg, {x: "0%"} , { x: "100%" });
        slideTl.fromTo(img, { scale: 2 }, { scale: 1 }, '-=1');
        slideTl.fromTo(revealText, { x: "0%" }, { x: "100%" }, '-=0.8');
        slideTl.fromTo(nav, { y:"-100%" }, { y: "0%" }, '-=0.8');
        
        slideScene = new ScrollMagic.Scene({
            triggerElement: slide,
            triggerHook: 0.25,
            reverse: false
        })
        .setTween(slideTl)
        .addTo(controller);
        // NEW ANIMATION
        const pageTl = gsap.timeline();
        let nextSlide = slides.length - 1 === index ? 'end' : slides[index + 1];
        pageTl.fromTo(nextSlide, { y: "0%" }, { y: "50%" });
        pageTl.fromTo(slide, { opacity: 1, scale: 1 }, { opacity: 0, scale: 0.5 });
        pageTl.fromTo(nextSlide, { y: "50%" }, { y: "0%" }, "-=0.5");
        //Creating new SCENE
        pageScene = new ScrollMagic.Scene({
            triggerElement: slide,
            duration: '100%',
            triggerHook: 0
        })
        .setPin(slide, { pushFollowers: false })
        .setTween(pageTl)
        .addTo(controller);
    });
}

function cursor(e){
    let mouse = document.querySelector('.cursor');
    let mouseTxt = mouse.querySelector('span');
    let burger = document.querySelector('.burger');
    mouse.style.top = e.pageY + "px";
    mouse.style.left = e.pageX + "px";
}
function activeCursor(e){
    let mouse = document.querySelector('.cursor');
    let mouseTxt = mouse.querySelector('span')
    const item = e.target;
    if(item.id === 'logo' || item.classList.contains('burger')){
        mouse.classList.add("nav-active");
    }else{
        mouse.classList.remove("nav-active");
    }
    if(item.classList.contains('explore')){
        mouse.classList.add('explore-active');
        mouseTxt.innerText = 'Tap';
    } else {
        mouse.classList.remove('explore-active');
        mouseTxt.innerText = "";

    }
}

function navToggle(e){
    if(!e.target.classList.contains("active")){
    e.target.classList.add("active");
    gsap.to('.line1', 0.5, {rotate: "45", y: 5, background: "black" });
    gsap.to('.line2', 0.5, {rotate: "-45", y: -5, background: "black"});
    gsap.to('#logo', 1, {color: "black"});
    gsap.to('.nav-bar', 1, {clipPath: 'circle(2500px at 100% -10%)'});
    document.body.classList.add('hide');
    } else {
    e.target.classList.remove("active");
    gsap.to('.line1', 0.5, {rotate: "0", y: 0, background: "white" });
    gsap.to('.line2', 0.5, {rotate: "0", y: 0, background: "white"});
    gsap.to('#logo', 1, {color: "white"});
    gsap.to('.nav-bar', 1, {clipPath: 'circle(50px at 100% -10%)'});
    document.body.classList.remove('hide');
    }
}


//Barba page transitions

barba.init({
        views: [
        {
         namespace: 'home',
         beforeEnter(){
             animateSlides();
         },
            beforeLeave(){
                 slideScene.destroy();
                 pageScene.destroy();
                 controller.destroy();
            }    
        },
        {
         namespace: 'sifi',
         beforeEnter(){
             logo.href = "../index.html";
             detailAnimation();
         }
        }
    ],
    transitions: [
        {
            leave({current}){
                let done = this.async();
                // animation
                const tl = gsap.timeline({ defaults: { ease: "power2.inOut", duration: 1 } });
                tl.fromTo(
                    current.container, 
                    1, 
                    { opacity: 1 }, 
                    { opacity: 0 }
                );
                tl.fromTo(
                    ".swipe",
                    0.75,
                    { x: "-100%" },
                    { x: "0%", onComplete: done },
                    "-=0.5"
                );
            },
            enter(next){
                let done = this.async();

                window.scrollTo(0, 0)
                //animation
                const tl = gsap.timeline({ defaults: { ease: "power2.inOut", duration: 1 } });
                tl.fromTo(
                    ".swipe",
                    0.75,
                    { x: "0%" },
                    { x: "100%",  stagger:0.25,onComplete: done },
                );
                tl.fromTo(
                    next.container, 
                    1, 
                    { opacity: 0 }, 
                    { opacity: 1,}
                );   
            }
        }
    ]
});

function detailAnimation(){
    if (window.matchMedia("(min-width: 480px)").matches){
    controller = new ScrollMagic.Controller();
    const slides = document.querySelectorAll('.detail-slide');
    slides.forEach((slide, index, slides) => {
        const slideTl = gsap.timeline({ defaults: {duration:1}})
        let nextSlide = slides.length - 1 === index ? 'end' : slides[index + 1];
        const nextImg = nextSlide.querySelector('img');
        slideTl.fromTo(slide, {opacity:1}, {opacity:0});

        detailScene = new ScrollMagic.Scene({
            triggerElement: slide,
            duration: "100%",
            triggerHook: 0
        })
        .setPin(slide, {pushFollowers: false})
        .setTween(slideTl)
        .addTo(controller);
    });
}
}


//Event listeners
burger.addEventListener('click', navToggle);
window.addEventListener('mousemove', cursor);
window.addEventListener('mouseover', activeCursor);
animateSlides();
