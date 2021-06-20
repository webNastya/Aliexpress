// category tabs
let catItem = document.querySelectorAll('.category-item'),
    category = document.querySelector('.category'),
    catCont = document.querySelector('.cat-container')
function openCategory(){
    category.classList.toggle('show-main')
    catItem[0].classList.add('show-sub')

    for (let i=0; i<catItem.length; i++){
        catItem[i].onmouseover = () => {
            for(let j=0; j<catItem.length; j++){
                if(catItem[j].classList.contains("show-sub")) {
                    catItem[j].classList.remove("show-sub")
                    break
                }
            }
            catItem[i].classList.add('show-sub')
        }
    }
}
function closeCategory(){
    category.classList.remove('show-main')
}
document.addEventListener('click', e => {
    const target = e.target;
    target === category ? openCategory() : target !== catCont ? closeCategory() : false;
});



//auth show
(function() {

    var _btns = document.querySelectorAll('.btn'),

        _eachBtn = function(callback) {
            Array.prototype.forEach.call(_btns, function(elem) {
                callback.call(this, elem);
            });
        },
        _initListener = function(e) {
            e.preventDefault();
            e.stopPropagation();
            _eachBtn(function(btn) {
                btn.classList.remove('dropdown-open')
            });
            this.classList.toggle('dropdown-open');
            document.addEventListener('touchend', function(event) {
                if (!event.target.classList.contains("loginPage")) {
                    _hideAll()
                }
            });
            document.addEventListener('click',function(event) {
                if (!event.target.classList.contains("loginPage")) {
                    _hideAll()
                }
            })
        },
        _hideAll = function() {
            _eachBtn(function(btn) {
                btn.classList.remove('dropdown-open');
            });
        };

    _eachBtn(function(btn) {
        btn.addEventListener('touchend', function(e) {
            _initListener.call(this, e);
        });

        btn.addEventListener('click', function(e) {
            _initListener.call(this, e);
        });
    });


})();
