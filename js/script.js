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