$(document).ready(function() {
    $('#summernote').summernote({
        lang:'ru-RU',
        minHeight: 500,
        maxHeight: null,
        focus: true,
        placeholder: 'Расскажите что-нибудь интересное!',
        fontNames: ['Arial', 'Times New Roman', 'Helvetica']
    });
});