import app from './app';
import 'reflect-metadata';

const port = 3001;

app.listen(port, () => {
    console.log(`app listening on port ${port}`);
});

