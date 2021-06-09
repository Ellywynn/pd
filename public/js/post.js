$(document).ready(() => {
    // лайки
    $('.comment').on('click', 'button.comment-likes', function(event) {
        const isLiked = $(this).hasClass('liked');
        let action = isLiked ? 'dislike' : 'like';

        $.ajax({
            type: 'POST',
            url: '/comment/' + action + '/' + $(this).attr('data-id'),
            success: () => {
                $(this).toggleClass('liked');
                const current = parseInt($(this).text());
                const newValue = action === 'like' ? current + 1 : current - 1;
                $(this).children('.like-count').text(newValue);
            },
            error: () => {return;}
        });
    });

    // TODO: лайки постов
    $('.post').on('click', 'button.post-likes', function(event) {
        const isLiked = $(this).hasClass('liked');
        let action = isLiked ? 'dislike' : 'like';

        $.ajax({
            type: 'POST',
            url: '/post/' + action + '/' + $(this).attr('data-id'),
            success: () => {
                $(this).toggleClass('liked');
                const current = parseInt($(this).text());
                const newValue = action === 'like' ? current + 1 : current - 1;
                $(this).children('.like-count').text(newValue);
            },
            error: () => {return;}
        });
    });
});