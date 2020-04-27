
function watermark(el, text, options = {}){
    let opts = Object.assign({
        color: '#bbb',
        width: undefined,
        height: undefined,
        opacity: .5,
        degree: -30
    }, options)

    let height = 14;
    let degree = opts.degree || -30;
    let flag = degree > 0 ? 1 : -1;
    degree = Math.abs(degree);
    let $el = document.querySelector(el);
    
    let canvas = document.createElement('canvas');
    let ctx = canvas.getContext('2d');
    let ratio = getPixelRatio(ctx);
    ctx.scale(ratio, ratio);
    let width = opts.width || ctx.measureText(text).width;

    let rect = Object.assign({}, opts, getRect(width, height, degree));
    canvas.width = rect.width;
    canvas.height = rect.height;
    ctx.translate(rect.width / 2, rect.height / 2);
    ctx.save();
    ctx.rotate( flag * degree / 180 * Math.PI);
    ctx.textBaseline = 'middle';
    ctx.strokeStyle = opts.color;
    ctx.strokeText(text, -width / 2, 0);
    ctx.restore();
    
    let imgData = canvas.toDataURL();
    let div = document.createElement('div');
    div.style.position = 'absolute';
    div.style.backgroundRepeat = 'repeat';
    div.style.backgroundImage = `url(${imgData})`;
    div.style.pointerEvents = 'none';
    div.style.top = 0;
    div.style.left = 0;
    div.style.bottom = 0;
    div.style.right = 0;
    div.style.opacity = opts.opacity;
    if(div.offsetParent !== $el){
        $el.style.position = 'relative';
    }
    $el.appendChild(div);

    let observer = new MutationObserver(function(mutationsList) {
        observer.disconnect();
        div.parentElement.removeChild(div);
        watermark(el, text, options);
    })
    observer.observe(div, { attributes: true, childList: true, subtree: true });
    return function destroy(){
        observer.disconnect();
        div.parentElement.removeChild(div);
    }
}

function getPixelRatio (ctx) {
    var backingStore = ctx.backingStorePixelRatio ||
        ctx.webkitBackingStorePixelRatio ||
        ctx.mozBackingStorePixelRatio ||
        ctx.msBackingStorePixelRatio ||
        ctx.oBackingStorePixelRatio ||
        ctx.backingStorePixelRatio || 1;
    return (window.devicePixelRatio || 1) / backingStore;
};

function getRect(w, h, deg){
    let angle = deg / 180 * Math.PI;
    let width = Math.ceil(w * Math.cos(angle) + h * Math.sin(angle));
    let height = Math.ceil(w * Math.sin(angle) + h * Math.cos(angle));
    return {
        width,
        height
    }
}