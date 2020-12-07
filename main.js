let form = document.querySelector('#form'),
	categories = document.querySelector('input[value=categories]'),
	inputs = document.querySelectorAll('input[name=check'),
	categoriesBlock = document.querySelector('.categoriesJoke'),
	searchTag = document.querySelector('#search'),
	renderJoke = document.querySelector('.render-joke'),
	favoriteJoke = document.querySelector('.favorite-joke'),
	favoriteJokesArr = [],
	currentBlock




// скрываем инпут с категориями 
inputs
	.forEach(input => {
		input.addEventListener('change', e => {
			if (e.target.value !== 'categories') {
				categoriesBlock.classList.add('hide')

			} else {
				categoriesBlock.classList.remove('hide')
			}
			if (e.target.value !== 'search') {
				searchTag.classList.add('hide')
			} else {
				searchTag.classList.remove('hide')
			}
		})
	})



form
	.addEventListener('submit', submitForm);
// слушатель при выборе категорий
categories
	.addEventListener('change', async () => {
		let categories = await getFile('categories');
		renderCategories(categories)

	})


// submit
async function submitForm(e) {
	e.preventDefault();
	renderJoke.innerHTML = '';
	let typeEl = document.querySelector('input[name=check]:checked');
	let type = typeEl.value;
	if (type === 'search') {
		let searchVal = searchTag.value
		searchVal = searchVal === '' ? 'Hello' : searchVal.trim()
		type = `search?query=${searchVal}`
	} else if (type === 'categories') {
		let checkCategories = document.querySelector('input[name=category]:checked');
		let categoryTipe = checkCategories.value
		type = `random?category=${categoryTipe}`

	}

	let data = await getFile(type)
	// если в ответе массив-перебираем его и создаем Joke
	if (type.indexOf('search') > -1) {
		data.result
			.forEach(joke => {

				Joke.createJoke(joke)
			})
		// или создаем сразу
	} else {
		Joke.createJoke(data)
	}

}
// запрос файлика
async function getFile(value) {
	let data = await fetch(`https://api.chucknorris.io/jokes/${value}`);
	let json = await data.json()

	return json

}
// выводим доступные категории
function renderCategories(categories) {

	categoriesBlock.innerHTML = '';
	categories.
	forEach((category, index) => {

		let label = document.createElement('label'),
			input = document.createElement('input');

		label.innerHTML = category;
		input.type = 'radio';
		input.value = category;
		input.name = 'category';
		input.className = ' categoryJo';
		input.checked = index === 0 ? true : false;

		label.prepend(input);
		categoriesBlock.append(label)
	});


}

function formatDate(date) {
	var d = new Date(date),
		month = '' + (d.getMonth() + 1),
		day = '' + d.getDate(),
		year = d.getFullYear();

	if (month.length < 2)
		month = '0' + month;
	if (day.length < 2)
		day = '0' + day;

	return [year, month, day].join('-');
}

class Joke {
	constructor() {
		this.keyLocalName = 'favourite'
	}
	// Создаем экземпляр класса 
	static createJoke(data) {

		let newJoke = new Joke;
		for (let key in data) {
			newJoke[key] = data[key];

		}
		newJoke.renderJoke(renderJoke)
		// console.log('newJoke: ', newJoke);

	}
	// рендер шутки
	renderJoke(mainDiv) {
		let jokeDiv = document.createElement('div');
		// console.log(this.categories);
		jokeDiv.classList.add('single-joke');
		jokeDiv.setAttribute('data-id', `${this.id}`)
		// добавляем сердечко
		let hurt = document.createElement('div');
		hurt.classList.add('hurt')
		hurt.innerHTML = ` <svg width="20" height="17" viewBox="0 0 20 17" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path d="M18.4134 1.66367C17.3781 0.590857 15.9575 0 14.413 0C13.2585 0 12.2012 0.348712 11.2704 1.03637C10.8008 1.38348 10.3752 1.80814 10 2.3038C9.62494 1.80829 9.19922 1.38348 8.7294 1.03637C7.79877 0.348712 6.74149 0 5.58701 0C4.04251 0 2.62177 0.590857 1.58646 1.66367C0.563507 2.72395 0 4.17244 0 5.74252C0 7.35852 0.630341 8.83778 1.98364 10.3979C3.19427 11.7935 4.93423 13.2102 6.94916 14.8507C7.63718 15.411 8.41705 16.046 9.22684 16.7224C9.44077 16.9015 9.71527 17 10 17C10.2846 17 10.5592 16.9015 10.7729 16.7227C11.5826 16.0461 12.363 15.4108 13.0513 14.8503C15.0659 13.2101 16.8059 11.7935 18.0165 10.3978C19.3698 8.83778 20 7.35852 20 5.74238C20 4.17244 19.4365 2.72395 18.4134 1.66367Z" fill="#FF6767"/>
		</svg>`


		jokeDiv.innerHTML += `
					<div class="id-joke">
					<p>ID:<a href="${this.id}">${this.id}</a></p>
					</div>
					<div class="text-joke">${this.value}</div>
					<div class="info-joke">
						<p class="update-joke">${this.updated_at =formatDate(this.updated_at)}</p>
						
						${this.categories.length>0 ? `<p class="categoty-joke">${this.categories}</p>` : ``}
					</div>`
		// слушатель на лайк
		hurt.addEventListener('click', () => {
			this.addFavourite()
		})

		jokeDiv.prepend(hurt)
		mainDiv.append(jokeDiv)
	}

	addFavourite() {
		this.favourite = true;
		currentBlock = document.querySelector(`div[data-id=${this.id}`);
		currentBlock.classList.add('favourite')
		putLocalStorage(this)
		getLocalArr()

	}
}


// Пихалка в Локал 
function putLocalStorage(current) {
	let jokes = getLocalStorage();
	let pushJoke = false
	// Проверяем наличие шутки в массиве
	let findInArr = jokes.some(joke => joke.id === current.id)
	// если массив пустой,то добавляем шутку
	if (jokes.length <= 0) {
		jokes.push(current);
		pushJoke = true
		// если шутки нет в массиве ,то добавляем
	} else if (!findInArr) {
		jokes.push(current);
		pushJoke = true
		// если шутка есть,то удаляем ее из массива (по индексу)
	} else if (findInArr) {
		let index = jokes.some((joke, index) => {
			joke.id === current.id
			return index
		})
		jokes.slice(index, 1)

	}
	localStorage.setItem(this.keyLocalName, JSON.stringify(jokes))

}
// Забираем массив из Локал
function getLocalStorage() {

	let jokeLocal = localStorage.getItem(this.keyLocalName)
	// если локал не пустой
	if (jokeLocal !== null) {
		return JSON.parse(jokeLocal)
	}
	return []
}
// Забираем с локал и рисуем
function getLocalArr() {
	let renderFavouriteJokes = getLocalStorage();
	favoriteJoke.innerHTML = ''
	renderFavouriteJokes.forEach(item => {
		let jokeDiv = document.createElement('div');
		// console.log(this.categories);
		jokeDiv.classList.add('single-joke');
		jokeDiv.setAttribute('data-id', `${item.id}`)
		// добавляем сердечко
		let hurt = document.createElement('div');
		hurt.classList.add('hurt')
		hurt.innerHTML = ` <svg width="20" height="17" viewBox="0 0 20 17" fill="none" xmlns="http://www.w3.org/2000/svg">
	<path d="M18.4134 1.66367C17.3781 0.590857 15.9575 0 14.413 0C13.2585 0 12.2012 0.348712 11.2704 1.03637C10.8008 1.38348 10.3752 1.80814 10 2.3038C9.62494 1.80829 9.19922 1.38348 8.7294 1.03637C7.79877 0.348712 6.74149 0 5.58701 0C4.04251 0 2.62177 0.590857 1.58646 1.66367C0.563507 2.72395 0 4.17244 0 5.74252C0 7.35852 0.630341 8.83778 1.98364 10.3979C3.19427 11.7935 4.93423 13.2102 6.94916 14.8507C7.63718 15.411 8.41705 16.046 9.22684 16.7224C9.44077 16.9015 9.71527 17 10 17C10.2846 17 10.5592 16.9015 10.7729 16.7227C11.5826 16.0461 12.363 15.4108 13.0513 14.8503C15.0659 13.2101 16.8059 11.7935 18.0165 10.3978C19.3698 8.83778 20 7.35852 20 5.74238C20 4.17244 19.4365 2.72395 18.4134 1.66367Z" fill="#FF6767"/>
	</svg>`
		jokeDiv.classList.add('favourite')

		jokeDiv.innerHTML += `
				<div class="id-joke">
				<p>ID:<a href="${item.id}">${item.id}</a></p>
				</div>
				<div class="text-joke">${item.value}</div>
				<div class="info-joke">
					<p class="update-joke">${item.updated_at =formatDate(item.updated_at)}</p>
					
					${item.categories.length>0 ? `<p class="categoty-joke">${item.categories}</p>` : ``}
				</div>`

		jokeDiv.prepend(hurt)
		favoriteJoke.append(jokeDiv)


	})
}

getLocalArr()