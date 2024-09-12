const express = require('express');
const router = express.Router();

// Ruta para ver productos más vendidos
router.get('/productos-mas-vendidos', (req, res) => {
  if (req.session.loggedin && req.session.role === 'Comerciantes de Productos Agrícolas') {
    req.getConnection((err, conn) => {
      if (err) throw err;
      
      // Consulta para obtener los productos más vendidos
      const query = `
        SELECT pa.nombre, COUNT(v.idProducto) AS totalVentas
        FROM ProductoAgricola pa
        JOIN Venta v ON pa.idProducto = v.idProducto
        GROUP BY pa.nombre
        ORDER BY totalVentas DESC;
      `;
      
      conn.query(query, (err, productos) => {
        if (err) throw err;
        res.render('comerciante/productos-mas-vendidos', { productos });
      });
    });
  } else {
    res.redirect('/index');
  }
});

// Ruta para ver datos de mercado recolectados
router.get('/datos-mercado', (req, res) => {
  if (req.session.loggedin && req.session.role === 'Comerciantes de Productos Agrícolas') {
    req.getConnection((err, conn) => {
      if (err) throw err;
      
      // Consulta para obtener datos de mercado
      const query = `
        SELECT datosActualizados 
        FROM DatosMercado;
      `;
      
      conn.query(query, (err, datosMercado) => {
        if (err) throw err;
        res.render('comerciante/datos-mercado', { datosMercado });
      });
    });
  } else {
    res.redirect('/index');
  }
});

module.exports = router;
