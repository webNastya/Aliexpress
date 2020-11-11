document.addEventListener('DOMContentLoaded', () => {
	const space = arg => {
		arg.toFixed(2);
		arg = arg.toString();
		return arg.replace(/(\d)(?=(\d{3})+(\D|$))/g, '$1 ');
	}

	class Cards{
		constructor(cards){
			this.cards = cards ? cards : {};
			this.wrapper = document.querySelector('#cards-wrapper');
		}
		get(id){
			return this.cards[id]
		}
		delete(id){
			delete this.cards[id]
		}
		add(card){
			let id = card.id;
			this.cards[id] = card;
		}

		render(type, arg){
			this.clearWrapper();
			if(type=="catalog" || !type){
				Object.values(this.cards).forEach(card=>{
					this.wrapper.append(card.getElement(type));
				});
				favorites.checkActive();
			}
			else if(type=="main"){
				let id = arg;
				this.wrapper.append(this.cards[id].getElement(type));
				favorites.checkActive(id);
			}
			else if(type=="category"){
				let category = arg;
				Object.values(this.cards).forEach(card=>{
					if(card.category.includes(category))
						this.wrapper.append(card.getElement(type));
				});
				favorites.checkActive();
			}
			else if(type=="favorite"){
				for (let i = 0; i < favorites.allBtns.length; i++) {
					if(favorites.allBtns[i].classList.contains('active'))
						card => {this.wrapper.append(card.getElement(type))}
				}
			}
		}

		clearWrapper(){
			this.wrapper.innerHTML = '';
		}

		openCard(id){
			this.render('main', id)
		}

		showCategory(category){
			this.render('category', category)
		}

		showFavorites(favorite){
			this.render('favorite', favorite);
		}

		handlers (event){
			const target = event.target;

			if(target.classList.contains('add-favorite') ||
					target.classList.contains('like-each-card') ||
					target.classList.contains('goods-add-wishlist')) {
				favorites.addFavorite(target);
			}

			else if (target.classList.contains('add-each-card')) {
				basket.addBasket(target.dataset.goodsId);
			}

			else if (target.classList.contains('delete-each-card')) {
				basket.deleteBasket(target.dataset.goodsId);
			}

			else if (target.classList.contains('card-title') ||
					target.classList.contains('card-img-top')) {
				cards.openCard(target.dataset.eachId);
			}

			else if(target.classList.contains('category-item')) {
				cards.showCategory(target.dataset.category);
			}
		}
	}
	class Card{
		static element = document.querySelector('#cards-wrapper');

		constructor(id, category, price, title, img){
			this.id = id;
			this.category = category;
			this.price = price;
			this.title = title;
			this.img = img;

			this.element = Card.element;
			this.catalog = {
				className : 'card-wrapper col-12 col-md-6 col-lg-4 col-xl-3 pb-3',
				innerHTML : `
							<div class="card">
								<div class="card-img-wrapper">
									<img class="card-img-top" data-each-id="${id}" src="${img}" alt="">
									<button class="add-favorite like"
										data-id="${id}"></button>
								</div>
								<div class="card-body justify-content-between">
									<a href="#" class="card-title" data-each-id="${id}">${title}</a>
									<div class="card-price">${space(price)} ₽</div>
								</div>
							</div>`,
			};
			this.main = {
				className : 'each-good',
				innerHTML : `
							<img class="each-good-img" src="${img}" alt="">
							<div class="each-good-description">
								<h2 class="each-good-title">${title}</h2>
								<p class="each-good-price">${(price)} ₽</p>
								<div class="calc">
									<button class="delete-each-card" data-goods-id="${id}">-</button>
									 <div class="calc-content">0</div> 
									<button class="add-each-card" data-goods-id="${id}">+</button>
								</div>
							</div>
							<button class="like-each-card like"
							 data-id="${id}"></button>`
			};
			this.basket = {
				className : 'goods',
				innerHTML : `
							<div class="goods-img-wrapper">
									<img class="goods-img" src="${img}" alt="">

								</div>
								<div class="goods-description">
									<h2 class="goods-title">${title}</h2>
									<p class="goods-price">${space(price)} ₽</p>

								</div>
								<div class="goods-price-count">
									<div class="goods-trigger">
										<button class="goods-add-wishlist like"
											data-goods-id="${id}"></button>
										<button class="goods-delete" data-goods-id="${id}"></button>
									</div>
									<div class="calc-content">{basket[id]>0 ? basket[id] : basket.removeGoods(id)}</div>
							</div>`
			};
		}
		getElement(type){
			let elem = document.createElement('div');
			if(type=='catalog' || type=='category' || !type){
				elem.className = this.catalog.className;
				elem.innerHTML = this.catalog.innerHTML;
			}
			else if(type=='main'){
				elem.className = this.main.className;
				elem.innerHTML = this.main.innerHTML;
			}
			else if(type=='basket'){
				elem.className = this.basket.className;
				elem.innerHTML = this.basket.innerHTML;
			}

			return elem;
		}
	}
	class Basket{
		constructor(){
			this.elements = {
				modal : document.querySelector('#basket'),
				mainBtn : document.querySelector('#basket-main-btn'),
				closeBtn : document.querySelector('#basket-close'),
			};
			this.counter = document.querySelector('#basket-main-btn span');
			this.cards = new Cards();
		}

		updateBasketCounter(){
			this.counter.textContent = Object.keys(this.cards).length;
		}

		refreshCalcContent(id) {
				document.querySelectorAll(".calc-content").forEach( cc => {
					cc.innerHTML = this.cards.get(id)>0 ? this.cards.get(id) : 0;
			});
		}

		addBasket(id) {
			this.cards.get(id).cntInBasket = this.cards.get(id).cntInBasket>0 ? ++this.cards.get(id).cntInBasket : 1;
			this.updateBasketCounter();
			this.refreshCalcContent(id);
		};

		deleteBasket(id) {
			if(this.cards.get(id).cntInBasket > 1)
				this.cards.get(id).cntInBasket--;
			else
				this.cards.delete(id);
			this.updateBasketCounter();
			this.refreshCalcContent(id);
		};

		showBasket(){
			this.elements.modal.style.display = 'flex';
		}

		closeBasket(){
			this.elements.modal.style.display = 'none';
		}

		handlers(event) {
			let target = event.target;
			if(target.classList.contains('nav-elements')){
				basket.showBasket();
			}
			else if (target.id == 'basket-close') {
				basket.closeBasket();
			}
		}
	}

	class Category {
		constructor(){
			this.element = document.querySelector('#category');
		}
		handlers(event){
			const target = event.target;
			if(target.classList.contains('category-item')) {
				cards.showCategory(target.dataset.category);
			};
		}
	}

	class Favorites{
		constructor(){
			this.allBtns = document.querySelectorAll('.like');
			this.showBtn = document.querySelector('#favorites-btn');
			this.counter = document.querySelector('#favorites-btn span');
			this.cards = new Cards();
		}

		handlers(event){
			const target = event.target;
			cards.showFavorites(target);
		}

		updateFavoritesCounter(){
			this.counter.textContent = Object.keys(this.cards.cards).length;
		}

		checkActive(id){
			if(id){
				let btn = document.querySelector('.like-each-card');
				if(this.cards.get(id)){
					btn.classList.add("active");
				} else {
					btn.classList.remove("active");
				}
			} else if(id===undefined){
				let btns = document.querySelectorAll('.add-favorite');
				btns.forEach(btn=>{
						if(this.cards.get(btn.dataset.id)){
							btn.classList.add("active");
						} else {
							btn.classList.remove("active");
						}
				})
			}
			this.updateFavoritesCounter();
		}

		addFavorite(elem){
			let id = elem.dataset.id;
			if (this.cards.get(id)) {
				elem.classList.remove('active')
				this.cards.delete(id);
			} else {
				elem.classList.add('active')
				this.cards.add(cards.get(id));
			}

			this.updateFavoritesCounter();
		}
	}

	class Search{
		constructor(){
			this.input = document.querySelector('#search');
			this.clear = document.querySelector('#search-clear');
		}

		handler(event){
			event.preventDefault();

			const inputValue = new RegExp(this.input.value.trim(), 'i'); // .trim() убирает все пробелы по бокам
			if (this.inputValue !== '') {
				console.log('good!!!')
				// getGoods(goods => goods.filter(item => inputValue.test(item.title)));
					// .test Метод RegExp, тестирует совпадение в строке. Возвращет истину либо ложь.
			} else {
				search.classList.add('error');
				setTimeout( () => {
					search.classList.remove('error');
				}, 2000) // если поле пустое то его обводка анимируется
			}
			input.value = ''; // очистка поля
		};

		clearSearch(){
			this.input.textContent = '';
		}
	}

	cards = new Cards();
	basket = new Basket();
	category = new Category();
	favorites = new Favorites();
	search = new Search();
	cardsData.forEach(({id, category, title, price, img}) => {
		cards.add(new Card(id, category, price, title, img));
	});
	cards.render();
	cards.wrapper.addEventListener('click', cards.handlers, cards);

	basket.elements.mainBtn.addEventListener('click', basket.handlers);
	basket.elements.closeBtn.addEventListener('click', basket.handlers);

	category.element.addEventListener('click', category.handlers);

	favorites.showBtn.addEventListener('click', favorites.handlers);

	search.input.addEventListener('submit', search.handler);
	search.clear.addEventListener('click', search.clearSearch);
});
