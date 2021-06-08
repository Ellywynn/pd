$(document).ready(function() {
    $('#summernote').summernote({
        tabsize: 2,
        lang: 'ru-RU',
        minHeight: 300,
        maxHeight: 600,
        placeholder: 'Расскажите что-нибудь интересное!'
    });

    // валидация на пустое поле summernote
    $('.summernote-form').submit(function(event) {
        if (!$('#summernote').summernote('isEmpty')) return;

        alert('Заполните поле контента!');

        event.preventDefault();
    });
});