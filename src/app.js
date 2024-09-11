const express = require('express');
const { engine } = require('express-handlebars');
const myconnection = require('express-myconnection');
const mysql = require('mysql');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.set('port', 5000);

// Configurar el motor de plantillas Handlebars
app.engine('.html', engine({
  extname: '.html',
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, 'views', 'layouts'),
  helpers: {
    ifCond: function (v1, operator, v2, options) {
      switch (operator) {
        case '==': return (v1 == v2) ? options.fn(this) : options.inverse(this);
        case '===': return (v1 === v2) ? options.fn(this) : options.inverse(this);
        case '!=': return (v1 != v2) ? options.fn(this) : options.inverse(this);
        case '!==': return (v1 !== v2) ? options.fn(this) : options.inverse(this);
        case '<': return (v1 < v2) ? options.fn(this) : options.inverse(this);
        case '<=': return (v1 <= v2) ? options.fn(this) : options.inverse(this);
        case '>': return (v1 > v2) ? options.fn(this) : options.inverse(this);
        case '>=': return (v1 >= v2) ? options.fn(this) : options.inverse(this);
        default: return options.inverse(this);
      }
    }
  }
}));

app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));

// Configuración del bodyParser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configurar conexión a la base de datos MySQL
app.use(myconnection(mysql, {
  host: '127.0.0.1',
  user: 'root',
  password: '',
  port: 3306,
  database: 'gestionagricola'
}, 'single'));

// Configuración de sesiones
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Rutas para el comerciante
app.get('/comerciante-dashboard', (req, res) => {
  res.render('dashboard/comerciante/comerciante-dashboard');
});

app.get('/comerciante/productos', (req, res) => {
  res.render('../views/dashboard/comerciante/productos/productos');
});

app.get('/comerciante/mercadeo', (req, res) => {
  res.render('dashboard/comerciante/mercadeo/index');
});

app.get('/comerciante/costos', (req, res) => {
  res.render('dashboard/comerciante/costos/index');
});

app.get('/comerciante/venta', (req, res) => {
  res.render('dashboard/comerciante/venta/index');
});

app.get('/comerciante/soporte', (req, res) => {
  res.render('dashboard/comerciante/soporte/index');
});

app.get('/comerciante/alertas', (req, res) => {
  res.render('dashboard/comerciante/alertas/index');
});

// Ruta para la página de inicio
app.get('/', (req, res) => {
  if (req.session.loggedin) {
    switch (req.session.role) {
      case 'Administrador':
        return res.redirect('/admin-dashboard');
      case 'Agricultores/Productores':
        return res.redirect('/agricultor-dashboard');
      case 'Comerciante':
        return res.redirect('/comerciante-dashboard');
      default:
        return res.redirect('/user-dashboard');
    }
  } else {
    res.redirect('/index');
  }
});

// Ruta para cerrar sesión
app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
      res.send('Error al cerrar sesión');
    } else {
      res.redirect('views/login/index.html');
    }
  });
});

// Iniciar el servidor
app.listen(app.get('port'), () => {


  console.log('Listening on port', app.get('port'));
});
