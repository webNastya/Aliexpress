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
        if (this.descriptionBlock.offsetHeight > this.imagesBlock.offsetHeight){ // если описание выше блока с фотографиями
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
