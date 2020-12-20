let catItem = document.querySelectorAll('.category-item')
function openCategory(){
    document.querySelector('.category').classList.toggle('show-main')
    catItem[0].classList.add('show-sub')
}
document.querySelector('.category').addEventListener('click', openCategory)

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