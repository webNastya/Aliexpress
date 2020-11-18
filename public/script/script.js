document.addEventListener('DOMContentLoaded', () => {
	class Catalog{
		constructor(){}
		showCards(){
			this.show("/",{});
		}
		openCard(id){
			this.show("/card",{"id": id});
		}

		showCategory(category){
			this.show("/category",{"category": category});
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
			// else if (target.classList.contains('add-each-card')) {
			// 	basket.addBasket(target.dataset.goodsId);
			// }
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

	catalog = new Catalog();
	favorites = new Favorites();

	document.querySelector('#cards-wrapper').addEventListener('click', catalog.handlers);

	// document.querySelector('#basket-main-btn').addEventListener('click', basket.handlers);
	// document.querySelector('#basket').addEventListener('click', basket.handlers);

	document.querySelector('#category').addEventListener('click', catalog.handlers);

	document.querySelector('#favorites-btn').addEventListener('click', favorites.handlers);

	// document.querySelector('#search').addEventListener('submit', search.handler);

	document.querySelector('.logo').addEventListener('click', () => {
		catalog.showCards();
	});
});
