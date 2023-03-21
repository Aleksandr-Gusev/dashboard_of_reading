window.addEventListener('DOMContentLoaded', () => {
//************** отображение бургер меню */
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


// обработчики


//поиск элементов
const form = document.querySelector('.enter_form');
const nameInput = document.querySelector('#name');
const pageInput = document.querySelector('#size');
const timeInput = document.querySelector('#time');
const bookList = document.querySelector('#bookList');
const emptyList = document.querySelector('#emptyList');

//определение текущей даты
/* let today = new Date();
var dd = parseInt(String(today.getDate()).padStart(2, '0'));
var mm = parseInt(String(today.getMonth() + 1).padStart(2, '0')); //January is 0!
var yyyy = today.getFullYear();
today = dd + '/' + mm + '/' + yyyy; */


let mas_book = [];


//проверяем пусто ли в хранилище*****************************************************************
if (localStorage.getItem('books')){
    mas_book = JSON.parse(localStorage.getItem('books'));
}

//определение текущей даты 
let today = Date.parse(new Date());



// проходим по всем элементам массива и рендерим страницу 
mas_book.forEach(function(e){
    // для отображения нужного класса, используется тернарный оператор
    const cssClass = e.done ? "name_book name_book_done" : "name_book";
    //запись id сообщения
    e.messageId = `m${e.id}`;             
    //Определение остатка дней на прочтение
    const day_today = Math.floor(today / (1000 * 60 * 60 * 24));
    const d = Math.floor(e.date_start / (1000 * 60 * 60 * 24)) + parseInt(e.time);
    const day = d - day_today;
    const read_today = Math.round((e.size - e.fact) / day);
    
    // формирование разметки для новой задачи 
    const taskHTML = `<li class="list_item" id="${e.id}">
                        <div class="wrapper__img_message">
                        <div class='message hide m${e.id}'>Осталось дней: ${day} <br>Сегодня прочитать страниц: ${read_today}</div>
                        <img src="./img/message.png" alt="done" width="22" height="22" class="img_message" id="m${e.id}">
                        </div>
                        <span class="${cssClass}">${e.name}</span>
                        <div class="wrapper">
                            <div class="progress_wrapper">
                                <div class="progress" style="width: ${e.procent_for_progress}px;">
                                    <span class="progress__text">${e.procent}%</span>
                                </div>
                            </div>
                        </div>
                        <div class="progress_input">
                            <input type="number" class="progress_input__enter" id="pages" placeholder="${e.fact}" required min="0" step="1">
                            <button type="submit" class="progress_input__btn ${e.id}" data-action="add">ОК</button>
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
//обновление данных при нажатии на ОК
bookList.addEventListener('click', enterPages2);

//**************************************** tooltip******************************************
bookList.addEventListener('mousemove', e => {

        for (let i = 0; i < mas_book.length; i++){
            if (e.target.id == mas_book[i].messageId){
                
            const message = document.querySelector(`.${mas_book[i].messageId}`);
           
            message.classList.remove('hide');
            message.classList.add('show');
            
            }
        }
    
  });
bookList.addEventListener('mouseout', e => {
    for (let i = 0; i < mas_book.length; i++){
        if (e.target.id == mas_book[i].messageId){
            
        const message = document.querySelector(`.${mas_book[i].messageId}`);
        message.classList.remove('show');
        message.classList.add('hide');
        }
    }
  });
//************************************************************************************* 
function addBook(e){
    e.preventDefault(); //отмена стандартного опведения страницы 

    // дастаем текст из инпута
    const nameText = nameInput.value;
    const sizeText = pageInput.value;
    const timeText = timeInput.value;
    const date_start = Date.parse(new Date());
    

    //объект который будет хранить данные по задачам

    const newBook = {
        id: `i${Date.now()}`,         //генерируется милисекунда 
        name: nameText,
        size: sizeText,
        time: timeText,
        fact: "",
        procent:"",
        procent_for_progress:"",
        messageId:"",
        date_start:date_start,
        done: false
    }
    mas_book.push(newBook);
    saveToLocalStorage();       // сохраняем в хранилище

    // для отображения нужного класса, используется тернарный оператор
    const cssClass = newBook.done ? "name_book name_book_done" : "name_book";
    //запись id сообщения
    newBook.messageId = `m${newBook.id}`; 
    // формирование разметки для новой книги
    const taskHTML = 
                    `<li class="list_item" id="${newBook.id}">
                        <div class="wrapper__img_message">
                        <div class='message hide m${newBook.id}'>Осталось дней:  <br>Сегодня прочитать страниц: </div>
                        <img src="./img/message.png" alt="done" width="22" height="22" class="img_message" id="m${newBook.id}">
                        </div>
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
                        <button type="submit" class="progress_input__btn ${newBook.id}" data-action="add">ОК</button>
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
        
        const pagesFact = document.querySelectorAll('#pages');      // Находим нужный элемент
        
        const id = parentNode.id;                             // определяем id задачи  

        const i = mas_book.findIndex(function(e){                // возвращает индекс
            if(e.id == id) {return true;}
        }) 
        const factText = pagesFact[i].value;                    // записываем значение
        
        if (factText == ""){return};                            // выходим из функции если в инпут не ввели количество прочитаннх страниц

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


function enterPages2(e){
//****************************обновление данных при нажание на ОК ******************

    for (let i = 0; i < mas_book.length; i++){
    if (e.target.classList[1] == `${mas_book[i].id}`){
               
        //Определение остатка дней на прочтение
        const day_today = Math.floor(today / (1000 * 60 * 60 * 24));
        const d = Math.floor(mas_book[i].date_start / (1000 * 60 * 60 * 24)) + parseInt(mas_book[i].time);
        const day = d - day_today;
        const read_today = Math.round((mas_book[i].size - mas_book[i].fact) / day);
        const liList = document.querySelector(`.m${mas_book[i].id}`);
        liList.innerText = "Осталось дней: " + day + "\n Сегодня прочитать страниц: " + read_today;
    }
    }

//**********************************************************************************
}

//************************************модальное окно********************/
const modal = document.querySelector('.overlay'),
      modalTrigger = document.querySelector('#donate'),
      modalClose = document.querySelector('.modal_close');

      // показ модального окна через определеннное время
      const modalTimer = setTimeout(visio_modal, 120000);
        
        function visio_modal(){
            modal.classList.toggle('show_modal');
            clearInterval(modalTimer);
        }

        modalTrigger.addEventListener('click', visio_modal);
        modalClose.addEventListener('click', visio_modal);



        // закрытие модального окна при нажатии в другом месте
        modal.addEventListener('click', (e)=>{
        if (e.target == modal){
            visio_modal();
        }
        });
        // закрытие модального окна при нажатии Escape
        document.addEventListener('keydown', (e)=>{
        if (e.code == "Escape"){
            visio_modal();
        }
        });

        
});
