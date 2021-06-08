$(document).ready(() => {
    // лайки
    $('.comment').on('click', 'button.comment-likes', e => {
        const isLiked = $(this).hasClass('liked');
        let action = isLiked ? 'dislike' : 'like';
        console.log($(this));

        // $.ajax({
        //     type: 'POST',
        //     url: '/comment/' + action + '/' + $(this).attr('data-id'),
        //     success: () => {
        //         $(this).toggleClass('liked');
        //     },
        //     error: () => {
        //     }
        // });
    });
});