document.addEventListener('DOMContentLoaded', () => {

	const search = document.querySelector('.search'),
		cartBtn = document.getElementById('cart'),
		wishlistBtn = document.getElementById('wishlist'),
		goodsWrapper = document.querySelector('.goods-wrapper'),
		cart = document.querySelector('.cart'),
	 	category = document.querySelector('.category'),
	 	cardCounter = cartBtn.querySelector('.counter'),
	 	wishlistCounter = wishlistBtn.querySelector('.counter'),
	 	cartWrapper = document.querySelector('.cart-wrapper'),
	 	cardTitle = document.querySelector('.card-title');

	let wishlist = [],
			eachlist = [];

	let goodsBasket = {};

	const loading = (nameFunction) => {
		const spinner = `<div id="spinner"><div class="spinner-loading">
		<div><div><div></div>
		</div><div><div></div></div>
		<div><div></div></div><div>
		<div></div></div></div></div></div>`;

		if (nameFunction === 'renderCart') {
			goodsWrapper.innerHTML = spinner;
		}
		if (nameFunction === 'renderBasket') {
			cartWrapper.innerHTML = spinner;
		}
		if (nameFunction === 'openEachCard') {
			goodsWrapper.innerHTML = spinner;
		}
		//console.log(nameFunction);
	}; // спиннер

	// запрос на сервер
	const getGoods = (handler, filter) => {
		loading(handler.name); // спиннер
		// когда мы обращаемся к функции handler.name мы получаем её имя
		fetch('db/db.json')
			.then(response => response.json()) // получили промисы
			.then(filter)
			.then(handler);
	};
		// или так => 
		// .then((response) => {
		// 	return response.json()
		// })
	
	// генерация карточек
	const createCartGoods = (id, title, price, img) => {
		const card = document.createElement('div');
		card.className = 'card-wrapper col-12 col-md-6 col-lg-4 col-xl-3 pb-3';
		card.innerHTML = `
		<div class="card">
			<div class="card-img-wrapper">
				<img class="card-img-top" src="${img}" alt="">
				<button class="card-add-wishlist ${wishlist.includes(id) ? 'active' : '' }"
					data-goods-id="${id}"></button>
			</div>
			<div class="card-body justify-content-between">
				<a href="#" class="card-title ${eachlist.includes(id)}" data-each-id="${id}">${title}</a>
				<div class="card-price">${space(price)} ₽</div>
			</div>
		</div>`; // if includes => true => +active
		return card;
	};

	// рендер товаров в карзине
	const createCardGoodsBasket = (id, title, price, img) => {
		const card = document.createElement('div');
		card.className = 'goods';
		card.innerHTML = `
		<div class="goods-img-wrapper">
				<img class="goods-img" src="${img}" alt="">

			</div>
			<div class="goods-description">
				<h2 class="goods-title">${title}</h2>
				<p class="goods-price">${space(price)} ₽</p>

			</div>
			<div class="goods-price-count">
				<div class="goods-trigger">
					<button class="goods-add-wishlist ${wishlist.includes(id) ? 'active' : '' }"
						data-goods-id="${id}"></button>
					<button class="goods-delete" data-goods-id="${id}"></button>
				</div>
				<div class="calc-content">${goodsBasket[id]>0 ? goodsBasket[id] : removeGoods(id)}</div>
		</div>`; // if includes => true => +active
		return card;
	};

	const createEachCard = (id, title, price, img) => {
		const card = document.createElement('div');
		card.className = 'each-good';
		card.innerHTML = `
			<img class="each-good-img" src="${img}" alt="">
			<div class="each-good-description">
				<h2 class="each-good-title">${title}</h2>
				<p class="each-good-price">${(price)} ₽</p>
				<div class="calc">
					<button class="delete-each-card" data-goods-id="${id}">-</button>
					 <div class="calc-content">${goodsBasket[id]>0 ? goodsBasket[id] : 0}</div> 
					<button class="add-each-card" data-goods-id="${id}">+</button>
				</div>
			</div>
			<button class="like-each-card ${wishlist.includes(id) ? 'active' : '' }"
			 data-goods-id="${id}"></button>`; // if includes => true => +active
		return card;
	};

	console.log(calcCont);

	// рендеры
	const renderCart = item => {
		goodsWrapper.textContent = ''; //убирает предыдущие карточки со страницы

		if (item.length) {
			item.forEach(({ id, title, price, imgMin}) => {
				goodsWrapper.append(createCartGoods(id, title, price, imgMin));
			}); // включили на сайте все карточки
		} else {
			goodsWrapper.textContent = '❌ Извините, мы не нашли товаров по вашему запросу!';
		} 
	};
	// [1,2,3,4].forEach(item => console.log(item))
	
	const renderBasket = item => {
		cartWrapper.textContent = ''; //убирает предыдущие карточки со страницы

		if (item.length) {
			item.forEach(({ id, title, price, imgMin}) => {
				cartWrapper.append(createCardGoodsBasket(id, title, price, imgMin));
			}); // включили на сайте все карточки
		} else {
			cartWrapper.innerHTML = '<div id="cart-empty">Ваша корзина пока пуста</div>';
		} 
	};

	const openEachCard = item => {
		goodsWrapper.textContent = ''; // Убирает предыдущие карточки со страницы
		//console.log(item);

		if (item.length) {
			item.forEach(({ id, title, price, imgMin}) => {
				goodsWrapper.append(createEachCard(id, title, price, imgMin));
			}); // Включили на сайте все карточки
		} else {
			goodsWrapper.textContent = '❌ Извините, мы не нашли товаров по вашему запросу!';
		} 
	};

	// калькуляция
	const calcTotalPrice = goods => {
		// let sum = goods.reduce((accum, item)=> {
		// 	return accum + item.price * goodsBasket[item.id];
		// }, 0); 
		let sum = 0;
		for (const item of goods) {
			sum += item.price * goodsBasket[item.id];
		}
		// let newSum.value = sum.value.replace(/[^\d.,]/g, '').replace(/(.{3})/g, '$1 ').trim();
		cart.querySelector('.cart-total>span').textContent = space(sum);//sum.toFixed(2); 
		//console.log(newSum);
	}; // сумма товаров в карзине

	const space = arg => {
		arg.toFixed(2);
		arg += '';
		if (arg.includes('.')) {
			let minSum = arg.substring(arg.length - 2);
			// minSum.style.fontSize = 'small';//.style.fontSize = 'small';
			// console.log(minSum);String.prototype.slice()
		}
		return arg.replace(/(\d)(?=(\d{3})+(\D|$))/g, '$1 ');
	}

	function checkCount() {
		// увеличиваем колличество сердечек в их счётчике 
		wishlistCounter.textContent = wishlist.length;
		// взяли длину массива которую вернул .keys и изменили цифровое значение карзины
		cardCounter.textContent = Object.keys(goodsBasket).length;
	}; 

	// фильтры
	const showCardBasket = goods => {
		const basketThings = goods.filter(item => goodsBasket.hasOwnProperty(item.id));
		// переменная с товарами из корзины 
		calcTotalPrice(basketThings);
		return basketThings;
	};

	const showWishlist = () => {
		getGoods(renderCart, goods => goods.filter(item => wishlist.includes(item.id)))
	};

	// откоыть карточку
	const openEach = (id) => {
		getGoods(openEachCard, goods => goods.filter(item => item.id.includes(id)));
		goodsWrapper.textContent = '';
	};

	const randomSort = item => item.sort(() => Math.random() - 0.5);
	// или так =>
	// const randomSort = (item) => {
	// 	return item.sort(() => Math.random() - 0.5);
	// };

	// работа с хранилищем
	const getCookie = name => {
	  let matches = document.cookie.match(new RegExp(
	    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
	  ));
	  return matches ? decodeURIComponent(matches[1]) : undefined;
	};

	const cookieQuery = get => {
		if (get) {
			if (getCookie('goodsBasket')) {
				// Object.assign({}, {}) данные второго объекта добавляются к первому
				Object.assign(goodsBasket, JSON.parse(getCookie('goodsBasket')));
				//goodsBasket = JSON.parse(getCookie('goodsBasket'));
				// плохой вариант потому что массив переприсваивается
			}
			checkCount();
		} else {
			document.cookie = `goodsBasket=${JSON.stringify(goodsBasket)}; max-age=86400e3`
		}
		//console.log(goodsBasket);
	};

	const storageQuery = get => {
		if (get) {
			if (localStorage.getItem('wishlist')) {
				wishlist.push(...JSON.parse(localStorage.getItem('wishlist')));
				// оператор '...' передаёт каждый элемент массива по отдельности
				//то же самое >>>
				// const wishlistStorage = JSON.parse(localStorage.getItem('wishlist'));
				// wishlistStorage.forEach(id => wishlist.push(id)); 
			}
			checkCount();
		} else {
			localStorage.setItem('wishlist', JSON.stringify(wishlist)); 
			// localStorage(объект который может хранить api браузера и его данные)
		}
	}; // берёт wishlist и отправляет в localStorage (записывает лайки в массив)




	// события
	const openCart = event =>{
		event.preventDefault();
		cart.style.display = 'flex';
		document.addEventListener('keydown', closeCart);
		getGoods(renderBasket, showCardBasket);
	}; // открыть окно
	// Выйти


	const closeCart = event => {
		const target = event.target; 
		// .target возвращает элемент по которомуу кликнули
		if (target===cart ||
			target.classList.contains('cart-close') ||
			event.keyCode === 27) {
			cart.style.display = '';
			document.removeEventListener('keydown', closeCart);
		}; // закрыть окно по клику на esc, в не окна и по крестику
	}; 

	// выбор категорий в левом столбце
	const choiceCategory = event => {
		event.preventDefault();
		const target = event.target;

		if (target.classList.contains('category-item')) {
			const cat = target.dataset.category; // получили data атрибут

			getGoods(renderCart, goods => goods
				.filter((item) => item.category.includes(cat)));
		};
		// или так =>
		// if (target.classList.contains('category-item')) {
		// 	const category = target.dataset.category; // получили data атрибут
		// 	// console.log(target.dataset) // получили все data атрибуты
		// 	getGoods(renderCart, (goods) => {
		// 		const newGoods = goods.filter(item => {
		// 			return item.category.includes(category);
		// 			// includes возвращает true если в массиве 
		// 			// category есть нужная категория товара 
		// 		});
		// 		return newGoods // возвращаем то что перебрали
		// 	});
		// };
	};


	const searchGoods = event => {
		event.preventDefault();

		const input = document.querySelector('#search'); // получили поле
		const inputValue = new RegExp(input.value.trim(), 'i'); // .trim() убирает все пробелы по бокам
		if (inputValue !== '') { 
			const searchString = new RegExp(inputValue, 'i'); // i при поиске не учитывает регистр
			//из строки создаём регулярное выражение которое возвращает объект
			getGoods(renderCart, goods => goods.filter(item => inputValue.test(item.title)));	
				// .test Метод RegExp, тестирует совпадение в строке. Возвращет истину либо ложь.
		} else {
			search.classList.add('error');
			setTimeout( () => {
				search.classList.remove('error');
			}, 2000) // если поле пустое то его обводка анимируется
		}
		input.value = ''; // очистка поля
	};

	// добавление и удаление лайков в корзине лайков
	const toggleWishlist = (id, elem) => {
		if(wishlist.includes(id)){
			wishlist.splice(id); // удаляет 1ый элемент по данному id
			elem.classList.remove('active');
		} else {
			wishlist.push(id);
			elem.classList.add('active');
		} // если в wishlist есть id то убираем если нет то добавляем
		checkCount();
		storageQuery();
		console.log(wishlist.length);

	}; // проверяет есть ли этот элемент в коллекции Wishlist

	// добавление товаров в карзину
	const addBasket = id => {
		createCardGoodsBasket[id] = goodsBasket[id]>0 ? ++goodsBasket[id] : 1;

		refreshCalcContent(id);
		checkCount();
		cookieQuery();
	};

	// удаление товаров из карзины
	const deleteBasket = id => {
		goodsBasket[id] = goodsBasket[id]>1 ? --goodsBasket[id] : removeGoods();

		refreshCalcContent(id);
		checkCount();
		cookieQuery();
	};

	const removeGoods = id => {
		delete goodsBasket[id];
		checkCount();
		cookieQuery();
		getGoods(renderBasket, showCardBasket);
	};


	// определяем куда кликнули и что вызываем
	const handlerGoods = event => {
		const target = event.target;

		if (target.classList.contains('card-add-wishlist')) {
			toggleWishlist(target.dataset.goodsId, target);
		};
		if (target.classList.contains('like-each-card')) {
			toggleWishlist(target.dataset.goodsId, target);
		}; // если у цели этот класс добавляем товар в wishlist
		if (target.classList.contains('add-each-card')) {
			addBasket(target.dataset.goodsId);
			calcCont.textContent = 0;
		} // если у цели  этот класс добавляем товар в корзину
		if (target.classList.contains('delete-each-card')) {
			deleteBasket(target.dataset.goodsId);
		}
		if (target.classList.contains('card-title')) {
			openEach(target.dataset.eachId);
		}
	};

	const handlerBasket = event => {
		const target = event.target;
		if (target.classList.contains('goods-add-wishlist')) {
			toggleWishlist(target.dataset.goodsId, target);
		}; // можно ставить лайки в корзине
		if (target.classList.contains('goods-delete')) {
			removeGoods(target.dataset.goodsId);
		}; // удаление товара
	};

	const refreshCalcContent = id => {
		document.querySelectorAll(".calc-content").forEach( cc => {
				cc.innerHTML = goodsBasket[id]>0 ? goodsBasket[id] : 0;
		});
	}

	// инициализация (сокрытая для пользователя)
	{
		getGoods(renderCart, randomSort);
		storageQuery('get');
		cookieQuery('get');

		cartBtn.addEventListener('click', openCart);
		cart.addEventListener('click', closeCart);
		category.addEventListener('click', choiceCategory);
		search.addEventListener('submit', searchGoods);
		goodsWrapper.addEventListener('click', handlerGoods);
		cartWrapper.addEventListener('click', handlerBasket);
		wishlistBtn.addEventListener('click', showWishlist);
	}
});