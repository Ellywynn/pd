const db = require('../config/database');
const ApiError = require('../errors/ApiError');

class Post {
    async createPost(req, res) {
        const {title, user_id, content} = req.body;
        try {
            // TODO: data validation
            const q = 'INSERT INTO post (title, user_id, content)'
            + `values(${title}, ${user_id}, ${content})`;
            const newStudent = await db.query(q);
            console.log(newStudent);
            res.status(201).json(newStudent.rows[0]);
        } catch (error) {

        }
    }
    async getAllPosts(req, res) {
        const q = 'SELECT * FROM student';
        const data = await db.query(q);
        res.render('posts', { data });
    }
    async getOnePost(req, res) {
        const id = req.params.id;
        const student = await db.query(`SELECT * FROM student WHERE id=${id} LIMIT 1`);
        res.json(student.rows[0]);
    }
    async updatePost(req, res) {
        const {id, name, surname, class_id, email, tel, date_of_birth} = req.body;
        const q = 'UPDATE student SET name=$1, surname=$2, '
        + 'class_id=$3, email=$4, tel=$5, date_of_birth=$6 WHERE id=$7 RETURNING *';
        const student = await db.query(q, [name, surname, class_id, email, tel, date_of_birth, id]);
        res.json(student.rows[0]);
    }
    async deletePost(req, res) {
        const id = req.params.id;
        const student = await db.query(`DELETE FROM post WHERE post_id=${id}`);
        res.json(student.rows[0]);
    }
}

module.exports = new Post();