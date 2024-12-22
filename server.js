import express from 'express';

const app = express();

app.use(express.json());
const port = process.env.PORT || 8080;

// PRE MIDDLEWARE

// ROUTES
app.get('/', (req, res) => {
    res.send('Hello World');
})

// POST MIDDLEWARE

// LISTEN
app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})