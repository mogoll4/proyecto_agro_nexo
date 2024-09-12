const express = require('express');
const router = express.Router();
const db = require('../db'); // Asumiendo que tienes un archivo db.js para la conexión a MySQL

// Obtener todos los productos
router.get('/productos', (req, res) => {
    const query = 'SELECT * FROM productos';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// Agregar un producto
router.post('/productos', (req, res) => {
    const { name, price } = req.body;
    const query = 'INSERT INTO productos (name, price) VALUES (?, ?)';
    db.query(query, [name, price], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Producto agregado', id: result.insertId });
    });
});

// Eliminar un producto
router.delete('/productos/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM productos WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Producto eliminado' });
    });
});

module.exports = router;
