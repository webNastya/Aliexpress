document.addEventListener('DOMContentLoaded', () => {
	const space = arg => {
		arg.toFixed(2);
		arg = arg.toString();
		return arg.replace(/(\d)(?=(\d{3})+(\D|$))/g, '$1 ');
	}
	class Catalog{
		constructor(){}
		showCards(){
			this.show("/",{});
			window.history.pushState({}, "index", "/");
		}
		openCard(id){
			this.show("/card",{"id": id});
			window.history.pushState({id: id}, "card", "/card?id=" + id);
		}

		showCategory(category){
			this.show("/category",{"category": category});
			window.history.pushState({category: category}, "category", "/category?cat=" + category);
		}

		addBasket(elem){
			let id = elem.dataset.id;

			var xhttp = new XMLHttpRequest();
			xhttp.open("POST", "/basket/add", true);
			xhttp.setRequestHeader("Content-Type", "application/json");
			xhttp.onreadystatechange = function() {
				if (this.readyState == 4 && this.status == 200) {
					if (this.responseText == "true")
						document.querySelector('#basket-main-btn span').textContent++
					// Заглушка
					catalog.showCards();
				}
			};
			xhttp.send(JSON.stringify({
				"card" : {
					"id": id
				}
			}));
		}

		show(url, body){
			var xhttp = new XMLHttpRequest();
			xhttp.open("POST", url, true);
			xhttp.setRequestHeader("Content-Type", "application/json");
			xhttp.onreadystatechange = function() {
				if (this.readyState == 4 && this.status == 200) {
					document.querySelector('#cards-wrapper').innerHTML = this.responseText;
				}
			};
			xhttp.send(JSON.stringify(body));
		}

		handlers (event){
			const target = event.target;

			if(target.classList.contains('add-favorite') ||
				target.classList.contains('like-each-card')) {
				favorites.addFavorite(target);
			}
			else if(target.classList.contains('add-cat-card')) {
				catalog.addBasket(target);
			}
			else if(target.classList.contains('add-card')) {
				basket.addBasket(target);
			}
			else if(target.classList.contains('basket-delete')) {
				basket.deleteBasket(target);
			}
			else if(target.classList.contains('add-each-card')) {
				basket.addOneToBasket(target);
			}
			else if(target.classList.contains('delete-each-card')) {
				if(document.querySelector('.calc-content[data-id="'+target.dataset.id+'"]').textContent <= 1)
					basket.deleteBasket(target);
				else
					basket.deleteOneInBasket(target);
			}
			else if (target.classList.contains('card-title') ||
				target.classList.contains('card-img-top')) {
				catalog.openCard(target.dataset.eachId);
			}
			else if(target.classList.contains('category-item')) {
				catalog.showCategory(target.dataset.category);
			}
		}
	}
	class Favorites{
		showFavorites(){
			catalog.show("/favorites", {});
			window.history.pushState({}, "favorites", "/favorites");
		}

		addFavorite(elem){
			let id = elem.dataset.id;
			let method = elem.classList.contains("active") ? "delete" : "add";

			var xhttp = new XMLHttpRequest();
			xhttp.open("POST", "/favorites/"+method, true);
			xhttp.setRequestHeader("Content-Type", "application/json");
			xhttp.onreadystatechange = function() {
				if (this.readyState == 4 && this.status == 200) {
					if (this.responseText == "true") {
						elem.classList.add('active')
						document.querySelector('#favorites-btn span').textContent++
					}
					else{
						elem.classList.remove('active');
						document.querySelector('#favorites-btn span').textContent--;
					}
				}
			};
			xhttp.send(JSON.stringify({
				"card" : {
					"id": id
				}
			}));
		}

		handlers(event){
			let target = event.target;
			if(target.id == 'favorites-btn') {
				favorites.showFavorites()
			}
		}

	}
	class Basket{
		showBasket(){
			catalog.show("/basket", {});
			window.history.pushState({}, "favorites", "/basket");
		}

		addBasket(elem){
			let id = elem.dataset.id;

			var xhttp = new XMLHttpRequest();
			xhttp.open("POST", "/basket/add", true);
			xhttp.setRequestHeader("Content-Type", "application/json");
			xhttp.onreadystatechange = function() {
				if (this.readyState == 4 && this.status == 200) {
					if (this.responseText == "true")
						document.querySelector('#basket-main-btn span').textContent++
					// Заглушка
					catalog.openCard(id);
				}
			};
			xhttp.send(JSON.stringify({
				"card" : {
					"id": id
				}
			}));
		}
		deleteBasket(elem){
			let id = elem.dataset.id;

			var xhttp = new XMLHttpRequest();
			xhttp.open("POST", "/basket/delete", true);
			xhttp.setRequestHeader("Content-Type", "application/json");
			xhttp.onreadystatechange = function() {
				if (this.readyState == 4 && this.status == 200) {
					if (this.responseText == "true") {
						let cnt = document.querySelector('#basket-main-btn span')
						cnt.textContent = cnt.textContent<=0 ? 0 : --cnt.textContent
					}
					// Заглушка
					basket.showBasket();
				}
			};
			xhttp.send(JSON.stringify({
				"card" : {
					"id": id
				}
			}));
		}
		addOneToBasket(elem){
			let id = elem.dataset.id;

			var xhttp = new XMLHttpRequest();
			xhttp.open("POST", "/basket/add/one", true);
			xhttp.setRequestHeader("Content-Type", "application/json");
			xhttp.onreadystatechange = function() {
				if (this.readyState == 4 && this.status == 200) {
					if (this.responseText == "true") {
						let price = document.querySelector('.basket-body[data-id="' + id + '"] ' +
							'.basket-btns p.basket-price').dataset.price;
						let total = document.querySelector('.total-int')
						let _total = +total.dataset.total + +price
						total.textContent = space(_total);
						total.dataset.total = _total;
					}
				}
			};
			xhttp.send(JSON.stringify({
				"card" : {
					"id": id
				}
			}));

		}
		deleteOneInBasket(elem){
			let id = elem.dataset.id;

			var xhttp = new XMLHttpRequest();
			xhttp.open("POST", "/basket/delete/one", true);
			xhttp.setRequestHeader("Content-Type", "application/json");
			xhttp.onreadystatechange = function() {
				if (this.readyState == 4 && this.status == 200) {
					if (this.responseText == "true") {
						let price = document.querySelector('.basket-body[data-id="' + id + '"] ' +
							'.basket-btns p.basket-price').dataset.price;
						let total = document.querySelector('.total-int')
						let _total = +total.dataset.total - +price
						total.textContent = space(_total);
						total.dataset.total = _total;
						document.querySelector('.calc-content[data-id="' + id + '"]').textContent--
					}
				}
			};
			xhttp.send(JSON.stringify({
				"card" : {
					"id": id
				}
			}));

		}

		handlers(event){
			let target = event.target;
			if(target.id == 'basket-main-btn') {
				basket.showBasket()
			}
		}

	}

	catalog = new Catalog();
	favorites = new Favorites();
	basket = new Basket();

	document.querySelector('#cards-wrapper').addEventListener('click', catalog.handlers);

	document.querySelector('#category').addEventListener('click', catalog.handlers);

	document.querySelector('#favorites-btn').addEventListener('click', favorites.handlers);
	document.querySelector('#basket-main-btn').addEventListener('click', basket.handlers);

	document.querySelector('.logo').addEventListener('click', () => {
		catalog.showCards();
	});
});
