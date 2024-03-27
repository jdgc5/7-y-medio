const openModalBtnReglas = document.getElementById('reglas');
const modal2 = document.getElementById('modal2');
const closeBtn2 = document.getElementsByClassName('close2')[0];

openModalBtnReglas.addEventListener('click', function () {
    modal2.style.display = 'block';
});

closeBtn2.addEventListener('click', function () {
    modal2.style.display = 'none';
});

window.addEventListener('click', function (event) {
    if (event.target == modal2) {
        modal2.style.display = 'none';
    }
});
