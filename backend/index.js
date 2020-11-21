import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { mongoUri } from './secret.js'

//Import routes
import testRouter from './routes/hello-world-route';
import userRouter from './routes/user-route.js';
import moduleRouter from './routes/module-route.js';
import classRouter from './routes/class-route.js';
import componentRouter from './routes/component-route.js';
import subcomponentRouter from './routes/subcomponent-route.js';
import commentRouter from './routes/comment-route.js';

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

//Connect to mongodb
const uri = mongoUri;
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true }
);
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
})

//Add routes
app.use('/helloworld', testRouter);
app.use('/user', userRouter);
app.use('/module', moduleRouter);
app.use('/class', classRouter);
app.use('/component', componentRouter);
app.use('/subcomponent', subcomponentRouter);
app.use('/comment', commentRouter);

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});