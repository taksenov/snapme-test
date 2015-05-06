$(function()
{
    $carousel = $('.carousel');
    $carousel.carousel();

    disableOverscroll();


    function removePhotolink()
    {
        $('#links')[0].removeChild(this.parentNode);
    }

    $('.removeLink').click(removePhotolink);

    $('#add-link').click(function()
    {
        $("#new-link-url").attr('size', 10).css({'display': 'inline-block'}).focus();
    });

    function handleInput(e)
    {
        var input = $("#new-link-url");
        if (e.keyCode == 13)
        {
            var parser = document.createElement('a');
            parser.href = $(this).val();

            if (parser.host != 'snapme.ru')
                parser.href = $(this).val();
            else
                parser.href = '//' + $(this).val();

            var domains = parser.hostname.split('.');
            var first = domains.pop();
            var second = domains.pop();
            var host = [second, first].join('.');

            input.after(
                "<div class = 'photolink'>" +
                    "<a target='_blank' href='" + parser.href + "'>" + host + '</a>' +
                    "<img class = 'removeLink' src='img/cross.svg'>" +
                "</div>");
            $('.removeLink').click(removePhotolink);
            input.val('');
            input.css('display', 'none');
        }
        else
        {
            var maxSize = 20;
            var minSize = 7;
            var size = Math.min(maxSize, Math.max(minSize, $(this).val().length));

            $(this).attr('size', size);
        }
    }

    $('#new-link-url').keyup(handleInput);

    $('#payment-free').click(function()
    {
        var freeOfCharge = $('#payment-free')[0].checked;
        if (freeOfCharge)
        {
            disableCheckbox('.payment-type-option');
            enableCheckbox('#payment-type-free');
            $.each($('.payment'), function(i, val) { val.checked = false;} )
        }
        else
        {
            enableCheckbox('.payment-type-option');
        }
    });

    $('.payment').change(function()
    {
        $('#payment-free')[0].checked = false;

        if ($('.payment:checked').length == 0)
            enableCheckbox('#payment-type-free');
        else
            disableCheckbox('#payment-type-free');
        enableCheckbox('.payment-type-option');
    });

    var newName = $('#new-photo-type-name');
    var lastId = 4;

    $('#new-link-url').on('blur', function()
    {
        this.value = '';
        this.style.display = 'none';
    });

    $('#add-photo-type').click(function()
    {
        if (newName.val() == '')
            $('#new-photo-type-name').focus();
        else
        {
            $('#insert-place').before(
                "<div class = 'snapme-photo-type'>" +
                "<input class = 'checkbox' id = 'id" + lastId + "' name = 'photo-type[]' value = 'type" + lastId + "' type='checkbox' checked>" +
                "<label for= 'id" + lastId + "'>" + newName.val() + "</label>" +
                "</div>");
            newName.val('');
            lastId++;
        }
    });

    $('#new-photo-type-name').on('focus', function()
    {
        $(this).css('margin-left', '7px');
    });

    $('#new-photo-type-name').on('blur', function()
    {
        $(this).css('margin-left', '2px');
    });

    $("form").bind("keypress", function (e)
    {
        if (e.keyCode == 13)
        {
            return false;
        }
    });

    $("#new-photo-type-name").bind("keypress", function (e)
    {
        if (e.keyCode == 13)
        {
            $('#add-photo-type').click();
        }
    });

    $('.social').click(function()
    {
        $counter = $('#' + this.getAttribute('id') + '-counter');
        var count = parseInt($counter.html());
        $counter.html(++count);
    });

    $('form').on('submit', onsubmit);
});

function enableCheckbox(select)
{
    $(select).addClass('checkbox-enabled');
    $(select).removeClass('checkbox-disabled');
}

function disableCheckbox(select)
{
    $(select).removeClass('checkbox-enabled');
    $(select).addClass('checkbox-disabled');
}

function checkForPresence(fields)
{
    return fields.reduce( function(prev, cur) { return prev && isset(cur); }, true);
}

function isset(select)
{
    return $(select).val() != '';
}

function onsubmit()
{
    var fields = ['#snapme-form-second-name', '#snapme-form-name', '#snapme-form-email', '#snapme-form-city', '#snapme-form-phone'];

    if (checkForPresence(fields))
        mailme(fields.map(function (select) { return $(select).val() }));

    return false;
}

function mailme(params)
{
    var photoTypes = [];
    var paymentTypes = [];



    $.each($('[name="payment-type[]"]'), function(_, check)
    {
        if (check.checked)
            paymentTypes.push(check.value);
    });

    $.each($('[name="photo-type[]"]'), function(_, check)
    {
        if (check.checked)
            photoTypes.push(check.value);
    });

    $.post("mail.json", { 'second-name': params[0], 'name': params[1], 'email': params[2],
                         'city': params[3], 'phone': params[4], 'payment-type[]': paymentTypes, 'photo-type[]': photoTypes  },
        function(data)
        {
            if (data.err)
            {
                $("#snapme-form-submit").val('Ошибка');
                alert('Ошибка при отправке сообщения.' + data.err);
                return;
            }
            if (data.ok)
            {
                var form = $('form');
                form.fadeOut(400, function()
                {
                    form.after('<p>Спасибо, мы свяжемся с Вами в ближайшее время</p>');
                });
            }
        }, "json");
}

function disableOverscroll()
{
}


