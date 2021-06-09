const db = require('../config/database');

// лайкнут ли комментарий пользователем
async function isCommentLiked(comment_id) {
    if(!loggedIn) return 0;

    const q = `SELECT COUNT(comment_id) AS liked
            FROM comment_like
            WHERE comment_id = ${comment_id} AND user_id = ${loggedIn}`;
    const liked = await db.query(q);

    return liked[0][0].liked;
}
// лайкнут ли пост пользователем
async function isPostLiked(post_id) {
    if(!loggedIn) return 0;

    const q = `SELECT COUNT(post_id) AS liked
            FROM post_like
            WHERE post_id = ${post_id} AND user_id = ${loggedIn}`;
    const liked = await db.query(q);
    return liked[0][0].liked;
}

async function getPosts(result) {
    const posts = [];
    for(const post of result[0]) {
        const post_id = post.post_id;
        const title = post.title;
        const author = post.author;
        const content = post.content;
        const likes = post.likes;
        const last_update = post.last_update;

        const result = await db.query(` SELECT COUNT(user_id) AS comments
                                        FROM comment WHERE post_id = ${post_id}`);

        const comments = result[0][0].comments;

        let avatar_path = post.avatar_path;
        avatar_path = validateAvatar(avatar_path);

        const liked = await isPostLiked(post_id);

        const result_post = {
            post_id,
            title,
            author,
            avatar_path,
            content,
            likes,
            comments,
            last_update,
            liked
        };
        posts.push(result_post);
    }

    return posts;
}

function validateAvatar(avatar_path) {
    if(avatar_path !== 'default.png') 
        return '/users/' + avatar_path;

    return '/' + avatar_path;
}

module.exports = { 
    getPosts,
    validateAvatar,
    isPostLiked,
    isCommentLiked
}