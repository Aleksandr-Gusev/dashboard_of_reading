// *********************вывод статистики***********************************

//const btnStat = document.querySelector('#idStat');

//btnStat.addEventListener('click', showStat);
mas_stat = [];
const bookList = document.querySelector('#bookList');
const grafic = document.querySelectorAll('.grafic');
const count = 20;

 
const taskHTML2 = `<li class="list_item list_head">
    
                                <span style="color:white;"></span>
                                <div class="wrapper_date">
                                <div style="width:150px;height:26px;" class="item_date">Книга прочитана</div>
                                <div style="width:100px;height:26px;" class="item_date">Прочитана за, дн.</div>
                                <div style="width:100px;height:26px;" class="item_date">Прочитано, стр.</div>
                                
                                <div style="width:34px;"></div>
                                </div>
                                </li>`;
    
    bookList.insertAdjacentHTML('beforeend', taskHTML2);
    
    // формирование разметки для новой задачи 
    if (localStorage.getItem('books_done')){
        mas_stat = JSON.parse(localStorage.getItem('books_done'));
    }        

    mas_stat.forEach(e =>{
        
        if (e.done == true){
            
            const buf = new Date(e.date_end);
            let month = buf.getMonth();
            date_end = buf.toLocaleDateString("ru-RU");
            console.log(month);
            //определение за сколько причитана книга
            const result = Math.floor((parseInt(e.date_end) - parseInt(e.date_start)) / (1000 * 60 * 60 * 24));
            console.log(result);
            const taskHTML = `<li class="list_item" id="${e.id}">
    
                                <span style="color:white;">${e.name}</span>
                                <div class="wrapper_date">
                                <div style="width:150px;height:26px;" class="item_date">${date_end}</div>
                                <div style="width:100px;height:26px;" class="item_date">${result}</div>
                                <div style="width:100px;height:26px;" class="item_date">${e.fact}</div>
                                
                                <div class="list_item__buttons">
                                    <button type="button" data-action="delete" class="btn-action">
                                        <img src="./img/delete.png" alt="done" width="18" height="18" class="btn_size">
                                    </button>
                                </div>
                                </div>
                                </li>`;
    
    bookList.insertAdjacentHTML('beforeend', taskHTML);
    
            grafic.forEach( e =>{
                if (e.id == month){
                    console.log(e.id);
                    
                    var numberPattern = /\d+/g;
                    let x = getComputedStyle(e).height.match(numberPattern);
                    console.log(Number(x[0])+count);
                    e.style = `height:${Number(x[0])+count}px; bottom:0px;`;
                }
            });
            

        }
    });
