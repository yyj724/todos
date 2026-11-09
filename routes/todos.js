
const express = require('express');
const router = express.Router();
const db = require('../db');

// 1. 할 일 목록 + 필터
router.get('/', async (req, res) => {
    try {
        const filter = req.query.filter || 'all';

        let sql = 'SELECT * FROM todos';

        if (filter === 'active') {
            sql += ' WHERE done = FALSE';
        } else if (filter === 'done') {
            sql += ' WHERE done = TRUE';
        }

        sql += ' ORDER BY id DESC';

        const [todos] = await db.query(sql);

        res.render('todos', { todos, filter });
    } catch (err) {
        console.error(err);
        res.status(500).send('목록 조회 오류');
    }
});

// 2. 할 일 등록
router.post('/', async (req, res) => {
    try {
        const { title, due_date } = req.body;

        await db.query(
            'INSERT INTO todos (title, due_date) VALUES (?, ?)',
            [title, due_date || null]
        );

        res.redirect('/todos');
    } catch (err) {
        console.error(err);
        res.status(500).send('등록 오류');
    }
});

// 3. 완료 / 미완료 변경
router.post('/:id/toggle', async (req, res) => {
    try {
        await db.query(
            'UPDATE todos SET done = NOT done WHERE id = ?',
            [req.params.id]
        );

        res.redirect('/todos');
    } catch (err) {
        console.error(err);
        res.status(500).send('완료 변경 오류');
    }
});

// 4. 수정 화면
router.get('/:id/edit', async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT * FROM todos WHERE id = ?',
            [req.params.id]
        );

        if (rows.length === 0) {
            return res.status(404).send('할 일을 찾을 수 없습니다.');
        }

        res.render('edit', { todo: rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).send('수정 화면 오류');
    }
});

// 5. 제목 및 마감일 수정
router.post('/:id/edit', async (req, res) => {
    try {
        const { title, due_date } = req.body;

        await db.query(
            'UPDATE todos SET title = ?, due_date = ? WHERE id = ?',
            [title, due_date || null, req.params.id]
        );

        res.redirect('/todos');
    } catch (err) {
        console.error(err);
        res.status(500).send('수정 오류');
    }
});

// 6. 할 일 삭제
router.post('/:id/delete', async (req, res) => {
    try {
        await db.query(
            'DELETE FROM todos WHERE id = ?',
            [req.params.id]
        );

        res.redirect('/todos');
    } catch (err) {
        console.error(err);
        res.status(500).send('삭제 오류');
    }
});

module.exports = router;

