document.addEventListener('DOMContentLoaded', () => {
    class Search {
        constructor() {
        }

        search(url, body, callBack) {
            ajax(url, body, (res) => {
                console.log(res.responseText)
                document.querySelector('#content-wrapper').innerHTML = res.responseText
                if (callBack)
                    callBack()
            })
        }

        handlers(event) {
            const target = event.target;

            if (target.classList.contains('search-btn')) {
                search.search("/search", {"query": document.querySelector('#searchGoods').value}, ()=>{})
            }
        }
    }
    let search = new Search()

    document.querySelector('#search-btn').addEventListener('click', search.handlers);
})