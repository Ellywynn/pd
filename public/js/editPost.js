$(document).ready(function() {
    $('#summernote').summernote({
        minHeight: 300,
        maxHeight: 600,
        placeholder: 'Расскажите что-нибудь интересное!'
    });

    // валидация на пустое поле summernote
    $('.summernote-form').submit(function(event) {
        
        if (!$('#summernote').summernote('isEmpty')) {
            alert('valid');
            return;
        }

        alert('Заполните поле контента!');

        event.preventDefault();
    });
});