const express = require('express');
const app = express();

const todosRouter = require('./routes/todos');

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use('/todos', todosRouter);

app.get('/', (req, res) => {
    res.redirect('/todos');
});

app.listen(3000, () => {
    console.log('서버 실행 중: http://localhost:3000');
});

















