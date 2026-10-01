

window.addEventListener("load", function(){

/* ELEMENTS */

const leftItems=[
document.querySelector(".switching-layouts-left-1"),
document.querySelector(".switching-layouts-left-2"),
document.querySelector(".switching-layouts-left-3")
];

const rightItems=[
document.querySelector(".switching-layouts-right-1"),
document.querySelector(".switching-layouts-right-2"),
document.querySelector(".switching-layouts-right-3")
];

const wholeRight=document.querySelector(".whole-right-side");


/* CREATE PROGRESS LINE */

const lineWrapper=document.createElement("div");
lineWrapper.className="vertical-line-wrapper";

const lineFill=document.createElement("div");
lineFill.className="vertical-line-fill";

lineWrapper.appendChild(lineFill);

if(wholeRight){
wholeRight.appendChild(lineWrapper);
}


/* LOTTIES */

const lotties=[

lottie.loadAnimation({
container:document.querySelector(".lottie-1"),
renderer:"svg",
loop:false,
autoplay:false,
path:"/wp-content/uploads/2026/04/1.-log-in.json",
rendererSettings:{progressiveLoad:true}
}),

lottie.loadAnimation({
container:document.querySelector(".lottie-2"),
renderer:"svg",
loop:false,
autoplay:false,
path:"/wp-content/uploads/2026/04/Place-Your-Order.json",
rendererSettings:{progressiveLoad:true}
}),

lottie.loadAnimation({
container:document.querySelector(".lottie-3"),
renderer:"svg",
loop:false,
autoplay:false,
path:"/wp-content/uploads/2026/04/Review.json",
rendererSettings:{progressiveLoad:true}
})

];

let current=0;
let activeAnim=null;
let started=false;
let inViewport=false;
let raf=null;


/* POSITION LINE */

function positionLine(el){

if(!el||!wholeRight) return;

const containerRect=wholeRight.getBoundingClientRect();
const targetRect=el.getBoundingClientRect();

lineWrapper.style.top=(targetRect.top-containerRect.top)+"px";
lineWrapper.style.height=targetRect.height+"px";

}


/* PROGRESS SYNC */

function syncProgress(){

if(!activeAnim) return;

const progress=activeAnim.currentFrame/activeAnim.totalFrames;

lineFill.style.transform="scaleY("+progress+")";

raf=requestAnimationFrame(syncProgress);

}


/* ACTIVATE CARD */

function activate(index){

if(activeAnim){
activeAnim.pause();
activeAnim.removeEventListener("complete",nextStep);
cancelAnimationFrame(raf);
}

current=index;


/* SWITCH CARDS */

leftItems.forEach(el=>{
if(el) el.classList.remove("switching-active-left");
});

rightItems.forEach(el=>{
if(el) el.classList.remove("switching-active-right");
});

if(leftItems[index]){
leftItems[index].classList.add("switching-active-left");
}

if(rightItems[index]){
rightItems[index].classList.add("switching-active-right");
}


/* POSITION LINE */

positionLine(rightItems[index]);


/* RESET PROGRESS */

lineFill.style.transform="scaleY(0)";


/* PLAY LOTTIE */

const anim=lotties[index];

if(anim){

activeAnim=anim;

anim.goToAndPlay(0,true);

anim.addEventListener("complete",nextStep);

raf=requestAnimationFrame(syncProgress);

}

}


/* NEXT STEP */

function nextStep(){

if(!inViewport) return;

let next=current+1;
if(next>=rightItems.length) next=0;

activate(next);

}


/* CLICK SUPPORT */

rightItems.forEach((el,i)=>{

if(!el) return;

el.addEventListener("click",()=>{

activate(i);

});

});


/* RESIZE */

window.addEventListener("resize",()=>{

positionLine(rightItems[current]);

});


/* VIEWPORT OBSERVER */

const observer=new IntersectionObserver((entries)=>{

entries.forEach(entry=>{

if(entry.isIntersecting){

inViewport=true;

if(!started){
started=true;
activate(0);
}
else if(activeAnim){
activeAnim.play();
raf=requestAnimationFrame(syncProgress);
}

}

else{

inViewport=false;

if(activeAnim){
activeAnim.pause();
cancelAnimationFrame(raf);
}

}

});

},{
threshold:0.35
});


if(wholeRight){
observer.observe(wholeRight);
}

});

