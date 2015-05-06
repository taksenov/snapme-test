/**
 * Created by admin on 04.05.2015.
 */
(function() {

    var app = {

        // -- инициализация при загрузке js
        initialize : function () {
            var _this = this;

            // -- имитация загрузки данных с сервера
            app.build();
            // -- имитация загрузки данных с сервера

            _this.setUpListeners();

            app.photografer = 1;
            app.model = 0;


        },
        // -- инициализация при загрузке js

        // объект, который содержит всю информацию
        //о товарах и о текущем заказе
        order: {
            goods : []
        },


        // -- имитация запрашивает данные с сервера и отрисовывает их в DOM
        build: function () {
            $.ajax({
                url: 'data.json',
                dataType: 'JSON'    //добавлено на основе вебинара по js-магазину
            }).done(function(data){



                $.each(data.data, function(index, val) {
                    app.order.goods.push({
                        'name' : val.name,
                        'links' : val.links,
                        'phone' : val.phone
                    });
                });

                console.log(data);
                console.log(app.order.goods);


                var html = app.fillTemplate('#template', data); // заполняем шаблон данными
                //$('.updates').append(html); // вставляем данные в DOM

                //var html = app.fillTemplate('#template', app.order.goods); // заполняем шаблон данными
                $('#valid').append(html); // вставляем данные в DOM

            }).fail(function(){
                console.log('ajax fail!');
            });

        },
        // -- имитация запрашивает данные с сервера и отрисовывает их в DOM

        // заполняем шаблон данными
        fillTemplate: function (sourceId, data){
            var source   = $(sourceId).html(),
                template = Handlebars.compile(source);

            return(template(data));
        },


        // -- обработчик событий над DOM элементами на странице
        setUpListeners: function () {

            // -- радиокнопка
            $('.form__radio-btns_div').on('click', app.setRadioButton);
            // -- радиокнопка

            // -- отправка поискового запроса и валидация
            $('#snapme-form-submit__search').on('click', app.submitForm);
            // -- отправка поискового запроса и валидация

            // -- удалить ошибку при вводе данных в инпуты
            $('form').on('keydown', 'input', app.removeError);
            // -- удалить ошибку при вводе данных в инпуты

        },
        // -- обработчик событий над DOM элементами на странице

        // -- функции вызываемые из setUpListeners ===============

        // -- радиокнопки, фотограф-модель
        setRadioButton: function (e) {
            e.preventDefault();

            var _this = $(this),
                radioDivBtn = _this.find('.snapme-form__radio-btns_div');

            if ( radioDivBtn.hasClass('snapme-form__radio-btns_checked') ) {
                return true;
            } else if (radioDivBtn.hasClass('snapme-form__radio-btns_unchecked')) {

                var thisID = radioDivBtn.attr('id');

                if ( thisID === 'snapme-form__photografer_div' ) {
                    $('#snapme-form__model_div').addClass('snapme-form__radio-btns_unchecked').removeClass('snapme-form__radio-btns_checked');
                    app.photografer = 1;
                    app.model = 0;
                } else {
                    $('#snapme-form__photografer_div').addClass('snapme-form__radio-btns_unchecked').removeClass('snapme-form__radio-btns_checked');
                    app.photografer = 0;
                    app.model = 1;
                }

                $('#' + thisID).removeClass('snapme-form__radio-btns_unchecked').addClass('snapme-form__radio-btns_checked');

            }

        },
        // -- радиокнопки, фотограф-модель

        // -- удаление тултипа и красной обводки с инпута при вводе в него данных
        removeError: function () {
            $(this).tooltip('destroy').parents('.form-group');
        },
        // -- удаление тултипа и красной обводки с инпута при вводе в него данных

        // -- Валидация введенного email и отправка почты
        submitForm: function (e) {
            e.preventDefault();

            var _this = this,
                form = $('form'),
                submitBtn = $('.snapme-form__submit-btn');

            if (app.validateForm(form) === false) return false;

            submitBtn.addClass('disabled');

            var str = form.serialize();

            str += '&photographer=' + app.photografer + '&model=' + app.model;

            console.log(str);


            $.ajax({
                url: 'search_form/search_process.php',
                type: 'GET',
                data: str
            })
            .done(function(msg) {
                $('#valid').html(msg);

            })
            .always(function() {
                submitBtn.removeClass('disabled');
            });

        },

        validateForm: function (form) {
            var input = form.find('#snapme-form-query'),
                valid = true,
                val = input.val(),
                tooltipPlacement = 'top',
                textError = 'Введите поисковый запрос. Это важно!';

            input.tooltip('destroy');

            if(val.length === 0){
                input.tooltip({
                    trigger: 'manual',
                    placement: tooltipPlacement,
                    title: textError
                }).tooltip('show');
                valid = false;
            }else{
            }

            return valid;
        },

        // -- пустая функция, чтоб не было ошибки с запятой в сетаплистенере
        someEmptyFunctuion: function () {}
        // -- пустая функция, чтоб не было ошибки с запятой в сетаплистенере

        // -- функции вызываемые из setUpListeners ===============

    }

    app.initialize();

}());



                //var data1 = {
                //   name : 'Тимофей Аксенов'
                //};
                //
                //var data2 = { updates: [
                //   {
                //      name: 'Jane Doe',
                //      update: 'Just Made my Breakfaast',
                //      from: 'Web',
                //      location: 'Canada'
                //   },
                //   {
                //     name: 'John Doe',
                //     update: 'What is going on with the weather?',
                //     from: 'Phone',
                //   }
                //]};
                //
                //console.log(data2);
                //
                //var template = Handlebars.compile( $('#template').html() );
                //$('.updates').append( template(data2) );









