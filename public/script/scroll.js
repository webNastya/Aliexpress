class CardScroll {
    constructor(){
        this.imagesBlock = document.querySelector('.card-imgs');
        this.descriptionBlock = document.querySelector('.each-good-description');
        this.bottomBlock = document.querySelector('.characters');
        this.header = document.querySelector('header');
    }
    startScroll(){
        window.addEventListener('scroll', this.ascroll.bind(this) )
    }
    ascroll() {
        if (this.descriptionBlock.offsetHeight > this.imagesBlock.offsetHeight){
            if (this.descriptionBlock.getBoundingClientRect().top <= this.header.offsetHeight
                && this.imagesBlock.offsetHeight + this.header.offsetHeight >= this.bottomBlock.getBoundingClientRect().top){
                this.imagesBlock.style.top = this.bottomBlock.getBoundingClientRect().top - this.imagesBlock.offsetHeight +'px'

            } else if (this.descriptionBlock.getBoundingClientRect().top <= this.header.offsetHeight) {
                this.imagesBlock.style.position = 'fixed'
                this.imagesBlock.style.zIndex = '101'
                this.descriptionBlock.classList.add('scroll-desc') // margin-left: 620px


                if(this.imagesBlock.getBoundingClientRect().top >= 0 ){
                    this.imagesBlock.style.top = this.header.offsetHeight + "px"
                }

            } else {
                this.imagesBlock.style.position = ''
                this.imagesBlock.style.zIndex = ''
                this.imagesBlock.style.top = this.descriptionBlock.getBoundingClientRect().top + "px"
                this.descriptionBlock.classList.remove('scroll-desc')
            }
        }
    }
    update(){
        this.imagesBlock = document.querySelector('.card-imgs');
        this.descriptionBlock = document.querySelector('.each-good-description');
        this.bottomBlock = document.querySelector('.characters');
        this.header = document.querySelector('header');
        this.ascroll()
    }
}
let cardScroll = new CardScroll()
cardScroll.startScroll()


//cardScroll = function(){
//     let a = document.querySelector('.card-imgs'),
//         b = null,
//         P = 0;
//     // если ноль заменить на число, то блок будет прилипать до того, как верхний край окна браузера дойдёт до верхнего края элемента. Может быть отрицательным числом
//     window.addEventListener('scroll', Ascroll, false);
//     document.body.addEventListener('scroll', Ascroll, false);
//     function Ascroll() {
//         if (b == null) {
//             let Sa = getComputedStyle(a, ''),
//                 s = '';
//             for (let i = 0; i < Sa.length; i++) {
//                 if (Sa[i].indexOf('overflow') == 0 || Sa[i].indexOf('padding') == 0
//                     || Sa[i].indexOf('border') == 0 || Sa[i].indexOf('outline') == 0 || Sa[i].indexOf('box-shadow') == 0
//                     || Sa[i].indexOf('background') == 0) {
//                     s += Sa[i] + ': ' +Sa.getPropertyValue(Sa[i]) + '; '
//                 }
//             }
//             b = document.createElement('div');
//             b.style.cssText = s + ' box-sizing: border-box; width: ' + a.offsetWidth + 'px;';
//             a.insertBefore(b, a.firstChild);
//             let l = a.childNodes.length;
//             for (let i = 1; i < l; i++) {
//                 b.appendChild(a.childNodes[1]);
//             }
//             a.style.height = b.getBoundingClientRect().height + 'px';
//             a.style.padding = '0';
//             a.style.border = '0';
//         }
//         let Ra = a.getBoundingClientRect(),
//             desc = document.querySelector('.each-good-description'),
//             cardImgM = document.querySelector('.card-img-main').offsetHeight,
//             cardImgS = document.querySelector('.card-img-side').offsetHeight,
//             R = Math.round(Ra.top + b.getBoundingClientRect().height - document.querySelector('.characters').getBoundingClientRect().top + 0);
//         // селектор блока, при достижении верхнего края которого нужно открепить прилипающий элемент;  Math.round() только для IE; если ноль заменить на число, то блок будет прилипать до того, как нижний край элемента дойдёт до футера
//         if (((Ra.top - P) <= 0) && (desc.offsetHeight > (cardImgM + cardImgS))) { // && desc.offsetHeight > (cardImgM + cardImgS)
//             if ((Ra.top - P) <= R) {
//                 b.className = 'stop';
//                 b.style.top = - R +'px';
//                 desc.classList.remove('sticky-desc')
//             } else {
//                 b.className = 'sticky';
//                 b.style.top = P + 'px';
//                 desc.classList.add('sticky-desc')
//             }
//         } else {
//             desc.classList.remove('sticky-desc')
//             b.className = '';
//             b.style.top = '';
//         }
//     }
// }