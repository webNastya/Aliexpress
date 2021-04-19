function multiItemSlider() {
    let sliderWrapper = document.querySelector('.content-similar-wrapper'), // обертка для .slider-item
        slides = document.querySelectorAll('.similar-wrapper'), // элементы (.slider-item)
        arrowLeft = document.querySelector('.arrow-left'), // кнопка "LEFT"
        arrowRight = document.querySelector('.arrow-right'), // кнопка "RIGHT"
        wrapperWidth = parseFloat(getComputedStyle(sliderWrapper).width), // ширина обёртки
        itemWidth = parseFloat(getComputedStyle(slides[0]).width), // ширина одного элемента
        positionLeftItem = 0, // позиция левого активного элемента
        transform = 0, // значение транфсофрмации .slider_wrapper
        _step = itemWidth / wrapperWidth * 100, // величина шага (для трансформации)
        items = []; // массив элементов

    // наполнение массива _items
    slides.forEach(function (item, index) {
        items.push({ item: item, position: index, transform: 0 });
    });

    let position = {
        getMin: 0,
        getMax: items.length - 1,
    }
    let step = 4;

    function transformItem(direction) {
        if (direction === 'right') {
            console.log(1)
            if ((positionLeftItem + wrapperWidth / itemWidth - 1) >= position.getMax) {
                return;
            }
            console.log(2)

            if (!arrowLeft.classList.contains('slider-show')) {
                arrowLeft.classList.add('slider-show');
            }
            // console.log(3)

            if (arrowRight.classList.contains('slider-show')
                && (positionLeftItem + wrapperWidth / itemWidth) >= position.getMax) {
                arrowRight.classList.remove('slider-show');
            }
            // console.log(4)

            positionLeftItem += 1;
            transform -= _step * 4;
            // console.log(slides)

        }
        if (direction === 'left') {
            if (positionLeftItem <= position.getMin) {
                return;
            }
            if (!arrowRight.classList.contains('slider-show')) {
                arrowRight.classList.add('slider-show');
            }
            if (arrowLeft.classList.contains('slider-show') && positionLeftItem - 1 <= position.getMin) {
                arrowLeft.classList.remove('slider-show');
            }
            positionLeftItem -= 1;
            transform += _step * 4;
        }
        sliderWrapper.style.transform = 'translateX(' + transform + '%)';
    }

    // обработчик события click для кнопок "назад" и "вперед"
    function controlClick(e) {
        let target = e.target;

        if (target.classList.contains('arrows')) {
            e.preventDefault();
            let direction = target.classList.contains('arrow-right') ? 'right' : 'left';
            transformItem(direction);
            // console.log(direction)
        }
    }

    arrowLeft.addEventListener('click', controlClick);
    arrowRight.addEventListener('click', controlClick);

    return {
        right: function () { // метод right
            transformItem('right');
        },
        left: function () { // метод left
            transformItem('left');
        }
    }
}
multiItemSlider('.similar')

let slides = document.querySelectorAll('.card-img-main img'),
    slide = document.querySelector('.card-img-main').offsetHeight,
    dotsWrap = document.querySelector('.card-img-side');

dotsWrap.height = slide.height
console.log(dotsWrap.offsetHeight);
console.log(slide);

dotsWrap.addEventListener('click', function(event){
    // console.log(slide);
    slides.item(0).src = event.target.src
})