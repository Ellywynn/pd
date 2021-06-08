$posts = $('.posts');

$(document).ready(() => {
    $('#search-input').bind('input', function() {
        $.ajax({
            type: 'GET',
            url: '/all?q=' + $('#search-input').val().trim(),
            success: (posts) => {
                if(posts.length > 0) {
                    appendLoadedPosts(posts);
                    return;
                }

                notFound();
            },
            error: () => {
                // если поиск завершен, показать все посты
                reloadPosts();
            }
        });
    });
});

function appendLoadedPosts(posts) {
    clearPosts();
    posts.map(post => {
        const postTemplate = 
            '<div class="post">' +
            '<div class="author-date">' +
            '<a href="/user/{{author}}" class="post-avatar">' +
            '<img src="{{avatar_path}}" alt=""></a>' +
            '<div><a class="post-author" href="/user/{{author}}">{{author}}</a>' +
            '<p class="post-time">{{last_update}}</p></div>' +
            '</div>' +
            '<a class="post-title" href="/post/{{post_id}}">{{title}}</a>' +
            '<div class="likes-comments"><p class="post-likes">' +
            '<i class="fa fa-heart"></i>{{likes}}</p>' +
            '<p class="post-comments"><i class="fa fa-comment"></i>{{comments}}</p></div></div>';
        $posts.append(Mustache.render(postTemplate, post));
    });
    found();
}

function reloadPosts() {
    clearPosts();
    $.ajax({
        type: 'GET',
        url: '/post',
        success: (posts) => {
            appendLoadedPosts(posts);
            found();
        },
        error: () => {
            console.error('can\'t load posts');
            notFound();
        }
    });
}

function notFound() {
    clearPosts();
    $('#not-found').css('visibility', 'visible');
}

function found() {
    $('#not-found').css('visibility', 'hidden');
}

function clearPosts() {
    $posts.html('');
}