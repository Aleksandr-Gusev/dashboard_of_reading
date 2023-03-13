$(document).ready(function(){
    


// ***********************появление формы и оверлея
$('.navbar__btn').on('click', function(){
    $('.overlay, #consultation').fadeIn('slow');
});

$('.modal_close').on('click', function(){
    $('.overlay, #consultation').fadeOut('slow');
});
//****************************************** */

function validateForm(form){
    $(form).validate({
        rules: {
            name: { required: true,
                    minlength: 2
                },
            surname: {  required: true,
                        minlength: 2
                    },
            phone: "required",
            email: {
                required: true,
                email: true
            }
        },
        messages: {
            name: {
                required:"Пожалуйста, введите свое имя",
                minlength: jQuery.validator.format("Введите не менее {0} - х символов")
            },
            surname: "Пожалуйста, введите свою фамилию",
            phone: "Пожалуйста, введите свой номер телефона",
            email: {
                required: "Пожалуйста, введите свою электронную почту",
                email: "Неправильно введен адрес почты"
            }
        }
    });
}

validateForm('#consultation form');

$('input[name=phone]').mask("+7 (999) 999-99-99");

//*******************************Отправка на почту +  ********************************/

$('form').submit(function(e){
    e.preventDefault();             //отмена перезагрузки страницы при нажатии на кнопку отправки
    $.ajax({
        type: "POST",
        url: "mailer/smart.php",    // обработчик
        data: $(this).serialize()    //подготовка данных перед отправкой
    }).done(function(){             // когда выполнили операцию то делаем следующую
        $(this).find("input").val(""); //очистка инпутов после отправки
        /* $('#consultation').fadeOut(); // скрытие форм
        $('.overlay, #accept').fadeIn('slow'); */ // вывод формы с сообщением
        $('form').trigger('reset');      // очистка форм     
    });      
    return false;                    
}); 


});

window.addEventListener('DOMContentLoaded', () => {
    const menu = document.querySelector('.burger__menu'),
    menuItem = document.querySelectorAll('.burger__menu_item'),
    hamburger = document.querySelector('.burger');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('burger_active');
        menu.classList.toggle('burger__menu_active');
    });

    menuItem.forEach(item => {
        item.addEventListener('click', () => {
            hamburger.classList.toggle('burger_active');
            menu.classList.toggle('burger__menu_active');
        })
    })
})

// обработчики


//поиск элементов
const form = document.querySelector('.enter_form');
const nameInput = document.querySelector('#name');
const pageInput = document.querySelector('#size');
const timeInput = document.querySelector('#time');
const bookList = document.querySelector('#bookList');
const emptyList = document.querySelector('#emptyList');


let mas_book = [];

//проверяем пусто ли в хранилище*****************************************************************
if (localStorage.getItem('books')){
    mas_book = JSON.parse(localStorage.getItem('books'));
}

// проходим по всем элементам массива и рендерим страницу
mas_book.forEach(function(e){
    // для отображения нужного класса, используется тернарный оператор
    const cssClass = e.done ? "name_book name_book_done" : "name_book";
     
    // формирование разметки для новой задачи
    const taskHTML = `<li class="list_item" id="${e.id}">
                        <span class="${cssClass}">${e.name}</span>
                        <div class="wrapper">
                            <div class="progress_wrapper">
                                <div class="progress" style="width: ${e.procent_for_progress}px;">
                                    <span class="progress__text">${e.procent}%</span>
                                </div>
                            </div>
                        </div>
                        <div class="progress_input">
                            <input type="number" class="progress_input__enter" id="pages" placeholder="прочитано стр." required min="0" step="1">
                            <button type="submit" class="progress_input__btn" data-action="add">ОК</button>
                        </div>
                        <div class="list_item__buttons">
                            <button type="button" data-action="done" class="btn-action">
                                <img src="./img/done.png" alt="done" width="18" height="18" class="btn_size">
                            </button>
                            <button type="button" data-action="delete" class="btn-action">
                                <img src="./img/delete.png" alt="done" width="18" height="18" class="btn_size">
                            </button>
                        </div>
                    </li>`;
                    /* document.getElementsByClassName('progress')[0].style = `width: ${procent_for_progress}px`;  */   //изменение стиля
    // Добавлем разметку на страницу
    bookList.insertAdjacentHTML('beforeend', taskHTML);
});
//**********************************************************************************
checkEmptyList();
// добавление книги
form.addEventListener('submit', addBook);

// удаление задачи
bookList.addEventListener('click', deleteBook);

//отмечаем задачу завершенной
bookList.addEventListener('click', doneTask);

//ввод прочитанных страниц
bookList.addEventListener('click', enterPages);


function addBook(e){
    e.preventDefault(); //отмена стандартного опведения страницы 

    // дастаем текст из инпута
    const nameText = nameInput.value;
    const sizeText = pageInput.value;
    const timeText = timeInput.value;
    

    //объект который будет хранить данные по задачам

    const newBook = {
        id: Date.now(),         //генерируется милисекунда 
        name: nameText,
        size: sizeText,
        time: timeText,
        fact: "",
        procent:"",
        procent_for_progress:"",
        done: false
    }
    mas_book.push(newBook);
    saveToLocalStorage();       // сохраняем в хранилище

    // для отображения нужного класса, используется тернарный оператор
    const cssClass = newBook.done ? "name_book name_book_done" : "name_book";
     
    // формирование разметки для новой книги
    const taskHTML = 
                    `<li class="list_item" id="${newBook.id}">
                    <span class="${cssClass}">${newBook.name}</span>
                    <div class="wrapper">
                        <div class="progress_wrapper">
                            <div class="progress">
                                <span class="progress__text"></span>
                            </div>
                        </div>
                    </div>
                    <div class="progress_input">
                        <input type="number" class="progress_input__enter" id="pages" placeholder="прочитано стр." required min="0" step="1">
                        <button type="submit" class="progress_input__btn" data-action="add">ОК</button>
                    </div>
                    <div class="list_item__buttons">
                        <button type="button" data-action="done" class="btn-action">
                            <img src="./img/done.png" alt="done" width="18" height="18" class="btn_size">
                        </button>
                        <button type="button" data-action="delete" class="btn-action">
                            <img src="./img/delete.png" alt="done" width="18" height="18" class="btn_size">
                        </button>
                    </div>
                </li>`;
    
    // Добавлем разметку на страницу
    bookList.insertAdjacentHTML('beforeend', taskHTML);
    

    //очищаем инпут и возвращаем на него фокус
    nameInput.value = "";
    pageInput.value = "";
    timeInput.value = "";
    
    // удаление сообщения
   
    checkEmptyList();
    
};

function deleteBook(e){
    if (e.target.dataset.action !== "delete"){return;}

    if (e.target.dataset.action == "delete"){                 // обращение к атрибуту кнопки data-action
        const parentNode = e.target.closest('li');            // поиск ближайшего родителя, родительская нода
        const id = parentNode.id;                             // определяем id задачи  
        

        // ищем индекс который удаляем
        const index = mas_book.findIndex(function(e){
            if(e.id == id) {return true;}
        })
        mas_book.splice(index, 1);                              // удаление 1 элемента начиная с index
        saveToLocalStorage();                                       // сохраняем в хранилище

        //удаляем задачу
        parentNode.remove();

        //показываем список дел пуст
        /* if(tasksList.children.length == 1){
            emptyList.classList.remove('none');
        }   */  
        checkEmptyList();
    }   

    
     
};

function doneTask(e){
    if (e.target.dataset.action !== "done"){return;}                 //сразу выходим из функции
    
    if (e.target.dataset.action == "done"){                         //обращение к атрибуту кнопки data-action
        const parentNode = e.target.closest('li');                  // поиск ближайшего родителя, родительская нода
        const bookTitle = parentNode.querySelector('.name_book'); // Находим нужный элемент
        bookTitle.classList.toggle('name_book_done');              //toggle переключает, добавляет и удаляет при нажатиях на кнопку
        
        const id = parentNode.id;                             // определяем id задачи  
        

        // ищем индекс который выполняем
        const book = mas_book.find(function(e){                // возвращает объект
            if(e.id == id) {return true;}
        })

        book.done = !book.done;
        //console.log(task);
        saveToLocalStorage();       // сохраняем в хранилище
    }   

};

function checkEmptyList(){
    if (mas_book.length == 0){
        const emptyListHTML = `<li id="emptyList">
        <img src="./img/wait.png" alt="empty" width="48">
        <div class="empty-list__title">Вы пока ничего не читаете</div>
    </li>`;
    bookList.insertAdjacentHTML("afterbegin", emptyListHTML);
    }
    if (mas_book.length > 0){
        const emptyElem = document.querySelector('#emptyList');
        emptyElem ? emptyElem.remove() : null;
    }
}

function enterPages(e){

    if (e.target.dataset.action !== "add"){return;}

    if (e.target.dataset.action == "add"){                         //обращение к атрибуту кнопки data-action
        const parentNode = e.target.closest('li');                  // поиск ближайшего родителя, родительская нода
        console.log(bookList);
        const pagesFact = document.querySelectorAll('#pages');      // Находим нужный элемент
        
        const id = parentNode.id;                             // определяем id задачи  

        const i = mas_book.findIndex(function(e){                // возвращает индекс
            if(e.id == id) {return true;}
        }) 
        const factText = pagesFact[i].value;                    // записываем значение
        
        // ищем индекс который выполняем
        const book = mas_book.find(function(e){                // возвращает объект
            if(e.id == id) {return true;}
        }) 
        book.fact = factText;
        let procent = Math.round(mas_book[i].fact / mas_book[i].size * 100 * 10) / 10;
        let procent_for_progress = Math.round(procent * 1.5);
        if (procent > 100){
            procent = 100;
            procent_for_progress = 150;
        }
        if (factText < 0) {procent = 0};

        

        const z = document.getElementsByClassName('progress')[i].style = `width: ${procent_for_progress}px`;    //изменение стиля
        document.getElementsByClassName("progress__text")[i].textContent=`${procent}%`;                         // изменение текста
        book.procent = procent;
        book.procent_for_progress = procent_for_progress;
        saveToLocalStorage();       // сохраняем в хранилище
}
}

// Сохраняем в хранилище массив
function saveToLocalStorage(){
    localStorage.setItem('books', JSON.stringify(mas_book));
}