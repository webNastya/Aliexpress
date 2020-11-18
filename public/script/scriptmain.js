document.addEventListener('DOMContentLoaded', () => {
	const space = arg => {
		arg.toFixed(2);
		arg = arg.toString();
		return arg.replace(/(\d)(?=(\d{3})+(\D|$))/g, '$1 ');
	}
	function main(cardsData){

		class Cards{
			constructor(cards){
				this.cards = cards ? cards : {};
				this.wrapper = document.querySelector('#cards-wrapper');
			}
			get(id){
				return this.cards[id]
			}
			set(id, key, value){
				let card = this.cards[id];
				card[key] = value;
			}
			delete(id){
				delete this.cards[id]
			}
			add(card){
				let id = card.id;
				this.cards[id] = card;
			}
			length(){
				return Object.keys(this.cards).length;
			}
			forEach(foo){
				Object.values(this.cards).forEach(card=>{
					foo(card);
				});
			}

			render(type, arg){
				this.clearWrapper();
				if(type=="catalog" || !type){
					this.forEach(card=>{
						this.wrapper.append(card.getElement(type));
					});
					favorites.checkActive();
				}
				else if(type=="main"){
						let id = arg;
					this.wrapper.append(this.cards[id].getElement(type));
					favorites.checkActive(id);
					basket.refreshCalcContent(id);
				}
				else if(type=="category"){
					let category = arg;
					this.forEach(card=>{
						if(card.category.includes(category))
							this.wrapper.append(card.getElement(type));

					});
					favorites.checkActive();
				}
				else if(type=="favorites"){
					this.forEach(card=>{
						this.wrapper.append(card.getElement());
					});
					favorites.checkActive();
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

			showFavorites(){
				this.render('favorites')
			}

			handlers (event){
				const target = event.target;

				if(target.classList.contains('add-favorite') ||
						target.classList.contains('like-each-card')) {
					favorites.addFavorite(target);
				}
				else if (target.classList.contains('add-each-card')) {
					basket.addBasket(target.dataset.goodsId);
				}
				/*else if (target.classList.contains('delete-each-card')) {
					basket.deleteBasket(target.dataset.goodsId);
				}*/
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
					className : 'card-wrapper',
					innerHTML : `
								<div class="card-img-wrapper">
									<img class="card-img-top" data-each-id="${id}" src="${img}" alt="">
									<button class="add-favorite"
										data-id="${id}"></button>
								</div>
								<div class="card-body">
									<a href="#" class="card-title" data-each-id="${id}">${title}</a>
									<div class="card-price">${space(price)} ₽</div>
								</div>`,
				};
				this.main = {
					className : 'each-good',
					innerHTML : `
								<p><a href="#">Категория</a> > Какой-то товар</p>
								<div class="each-good-content">
									<img class="each-good-img" src="${img}" alt="">
									<div class="each-good-description">
										<h1 class="each-good-title">Main title</h1>
										<p class="each-good-title">${title}</p>
										<p class="each-good-price">${space(price)} ₽ <button class="like-each-card"
									 data-id="${id}"></button></p>
										<div class="calc">
											<button class="add-card" data-goods-id="${id}">Добавить товар</button>
										</div>
									</div>
								</div>`
				};
				this.basket = {
					className : 'basket',
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
											<button class="goods-add-wishlist"
												data-goods-id="${id}"></button>
											<button class="goods-delete" data-goods-id="${id}"></button>
										</div>
										<div class="calc">
											<button class="delete-each-card" data-goods-id="${id}">-</button>
											<div class="calc-content">1</div>
											<button class="add-each-card" data-goods-id="${id}">+</button>
										</div>
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
					basketWrapper : document.querySelector('#basket-wrapper'),
					mainBtn : document.querySelector('#basket-main-btn'),
					addBtn : document.querySelector('.add-card'),
				};
				this.counter = document.querySelector('#basket-main-btn span');
				this.cards = new Cards();
			}

			updateBasketCounter(){
				this.counter.textContent = this.cards.length();
			}

			refreshCalcContent(id) {
				document.querySelectorAll(".calc-content").forEach( cc => {
					let card = this.cards.get(id);
					cc.innerHTML = card ? card.cntInBasket : basket.removeCard()
				});
				if(this.cards.get(id)){
					this.elements.addBtn.textContent = 'Добавлено в корзину';
					this.elements.addBtn.classList.add("add-card-active");
				} else {
					this.elements.addBtn.textContent = 'Добавить в корзину';
					// this.elements.addBtn.classList.remove("add-card-active");
				}
			}

			plusInBasket(id){
				let card = this.cards.get(id);
				if (card)
				{
					card.cntInBasket++;
					this.cards.set(id, 'cntInBasket', card.cntInBasket);
				}
				else {
					this.cards.add(cards.get(id));
					this.cards.set(id, 'cntInBasket', 1);
				}

				this.updateBasketCounter();
				this.refreshCalcContent(id);
			}
			addBasket(id) {
				this.cards.add(cards.get(id));
				this.cards.set(id, 'cntInBasket', 1);

				this.updateBasketCounter();
				this.refreshCalcContent(id);
			};

			deleteBasket(id) {
				let card = this.cards.get(id);
				if(!card)
					return;
				if(card.cntInBasket > 1)
					card.cntInBasket--;
				else
					this.cards.delete(id);
					this.elements.addBtn(id).textContent = 'Добавить в корзину';
				this.elements.addBtn(id).classList.add("add-card-active");

				this.updateBasketCounter();
				this.refreshCalcContent(id);
			};

			removeCard(id){
				this.cards.delete(id)
			}

			showBasketWrapper(){
				basket.elements.basketWrapper.innerHTML = '';
				this.calcTotalPrice();
				favorites.checkActive();
				this.cards.forEach(card=>{
					this.elements.basketWrapper.append(card.getElement('basket'));
				});
			}

			calcTotalPrice(){
				let sum = 0;
				this.cards.forEach(card=>{sum += card.price})
				document.querySelector('.basket-total>span').textContent = space(sum)
			}

			showBasket(){
				this.elements.modal.style.display = 'flex';
			}

			closeBasket(){
				this.elements.modal.style.display = 'none';
			}

			clearBasket(){
				basket.elements.basketWrapper.innerHTML = '';
			}

			handlers(event) {
				let target = event.target;
				if(target.classList.contains('nav-elements')){
					basket.showBasket();
					basket.showBasketWrapper();
				}
				else if (target.id == 'basket-close') {
					basket.closeBasket();
				}
				else if (target.classList.contains('goods-delete')) {
					basket.removeCard();
				}
				else if (target.classList.contains('add-each-card')) {
					basket.plusInBasket(target.dataset.goodsId);
				}
				else if (target.classList.contains('delete-each-card')) {
					basket.deleteBasket(target.dataset.goodsId);
				}
				else if (target.classList.contains('goods-add-wishlist')) {
					favorites.addFavorite(target);
				}
			};
		}

		class Category {
			constructor(){
				this.element = document.querySelector('#category');
			}
			handlers(event){
				const target = event.target;
				if(target.classList.contains('category-item')) {
					cards.showCategory(target.dataset.category);
				}
			}
		}

		class Favorites{
			constructor(){
				this.showBtn = document.querySelector('#favorites-btn');
				this.counter = document.querySelector('#favorites-btn span');
				this.cards = new Cards();
			}

			updateFavoritesCounter(){
				this.counter.textContent = Object.keys(this.cards.cards).length;
			}

			checkActive(id){
				if(id){
					let btn = document.querySelectorAll('.like-each-card');
					if(this.cards.get(id)){
						btn.classList.add("active");
					} else {
						btn.classList.remove("active");
					}
				} if(id){
					let btn = document.querySelectorAll('.goods-add-wishlist');
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

			handlers(event){
				let target = event.target;
				console.log(target);
				if(target.id == 'favorites-btn') {
					favorites.cards.showFavorites()
				}
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
		class Tools{
			constructor(){
				this.elements = {
					"home": document.querySelector('.logo'),
				}
			}

			goHome(){
				cards.render();
			}
		}

		cards = new Cards();
		basket = new Basket();
		category = new Category();
		favorites = new Favorites();
		search = new Search();
		tools = new Tools();
		cardsData.forEach(({id, category, title, price, img}) => {
			cards.add(new Card(id, category, price, title, img));
		});
		cards.render();
		cards.wrapper.addEventListener('click', cards.handlers, cards);

		basket.elements.mainBtn.addEventListener('click', basket.handlers);
		basket.elements.modal.addEventListener('click', basket.handlers);

		category.element.addEventListener('click', category.handlers);

		favorites.showBtn.addEventListener('click', favorites.handlers);

		search.input.addEventListener('submit', search.handler);
		// search.clear.addEventListener('click', search.clearSearch);

		tools.elements.home.addEventListener('click', tools.goHome);
	}
	main(cardsData);
});
