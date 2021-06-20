class SliderBottom {
    constructor() { 
        this.sliderWrapper = document.querySelector('.content-similar-wrapper'); // обертка для .slider-item
        this.slides = document.querySelectorAll('.similar-wrapper'); // элементы (.slider-item)
        this.arrowLeft = document.querySelector('.arrow-left'); // кнопка "LEFT"
        this.arrowRight = document.querySelector('.arrow-right'); // кнопка "RIGHT"
        this.wrapperWidth = parseFloat(getComputedStyle(this.sliderWrapper).width); // ширина обёртки
        this.itemWidth = parseFloat(getComputedStyle(this.slides[0]).width); // ширина одного элемента
        this._step = this.itemWidth / this.wrapperWidth * 100; // величина шага (для трансформации)
        this.itemsMax = this.slides.length;
        this.leftItem = 1; // позиция левого активного элемента
        this.transform = 0; // значение транфсофрмации .slider_wrapper
        this.itemsMin = 0;
        this.step = 4;
    }
    transformItem(direction) {

        if (direction === 'right') {
            this.leftItem += this.step;
            this.transform -= this._step * this.step;

        }
        else if (direction === 'left') {
            this.leftItem -= this.step;
            this.transform += this._step * this.step;
        }

        this.showArrow();

        this.sliderWrapper.style.transform = 'translateX(' + this.transform + '%)';
    }

    showArrow() {
        if (!this.arrowRight.classList.contains('slider-show')) {
            this.arrowRight.classList.add('slider-show');
        }
        else if (!this.arrowLeft.classList.contains('slider-show')) {
            this.arrowLeft.classList.add('slider-show');
        }

        if ((this.leftItem + this.step) >= this.itemsMax) {
            this.arrowRight.classList.remove('slider-show');
        }
        else if ((this.leftItem - this.step) <= this.itemsMin) {
            this.arrowLeft.classList.remove('slider-show');
        }
    }

    // обработчик события click для кнопок "назад" и "вперед"
    controlClick(e) {
        let target = e.target;

        if (target.classList.contains('arrows')) {
            e.preventDefault();
            let direction = target.classList.contains('arrow-right') ? 'right' : 'left';
            console.log(target)
            this.transformItem(direction);
        }
    }
    clickEventLong() {
        this.arrowLeft.addEventListener('click', this.controlClick);
        this.arrowRight.addEventListener('click', this.controlClick);
    }
    update() {
        this.sliderWrapper = document.querySelector('.content-similar-wrapper');
        this.slides = document.querySelectorAll('.similar-wrapper');
        this.arrowLeft = document.querySelector('.arrow-left');
        this.arrowRight = document.querySelector('.arrow-right');
        this.wrapperWidth = parseFloat(getComputedStyle(this.sliderWrapper).width);
        this.itemWidth = parseFloat(getComputedStyle(this.slides[0]).width);
        this._step = this.itemWidth / this.wrapperWidth * 100;
        this.clickEventLong()
    }
    
}

let sliderBottom = new SliderBottom()
sliderBottom.clickEventLong()

class CardImageChoice {
    constructor() {
        this.slides = document.querySelectorAll('.card-img-main img');
        this.dotsWrap = document.querySelector('.card-img-side');
    }

    setClickEvent() {
        let slides = this.slides;
        this.dotsWrap.addEventListener('click', function(event){
            slides.item(0).src = event.target.src
        })
    }

    update() {
        this.slides = document.querySelectorAll('.card-img-main img');
        this.dotsWrap = document.querySelector('.card-img-side');
        this.setClickEvent();
    }
}
let cardImageChoice = new CardImageChoice()
cardImageChoice.setClickEvent()