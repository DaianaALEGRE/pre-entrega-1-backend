import express from 'express';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import handlebars from 'express-handlebars';
import __dirname from './utils.js';
import viewsRouter from "./routes/views.router.js";
import { Server } from 'socket.io';

const app = express();
const PORT = 8080;

const httpServer = app.listen(PORT, () => { console.log(`Servidor Express iniciado en http://localhost:${PORT}/`); });
export const socketServer = new Server(httpServer);

app.use(express.json());
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');
app.use(express.static(__dirname + '/public'));
app.use('/',viewsRouter)

socketServer.on('connection', (socketClient) => {
  console.log('Socket conectado');
  socketClient.on('message', (data) => {
    console.log(data)
  })
})


app.use('/api/products', productRoutes);
app.use('/api/carts', cartRoutes);




