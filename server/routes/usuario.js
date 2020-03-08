const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const _ = require('underscore');
const Usuario = require('../models/usuario');
const {verificaToken,verificaAdminRole}=require('../middleware/autenticacion');

app.get('/usuario', verificaToken, (req, res) => {
  let desde = req.query.desde || 0;
  let limite = req.query.limite || 5;
  desde = Number(desde);
  limite = Number(limite);
  Usuario.find(
    {
      estado: true
    },
    'nombre email role estado google img'
  )
    .skip(desde)
    .limit(limite)
    .exec((err, usuarios) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err: err
        });
      }
      Usuario.count(
        {
          estado: true
        },
        (err, conteo) => {
          res.json({
            ok: true,
            usuarios,
            conteo
          });
        }
      );
    });
});

app.post('/usuario', [verificaToken,verificaAdminRole],(req, res) => {
  const body = req.body;
  const usuario = new Usuario({
    nombre: body.nombre,
    email: body.email,
    password: bcrypt.hashSync(body.password, 10),
    role: body.role
  });
  usuario.save((err, usarioDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err: err
      });
    }
    res.json({
      ok: true,
      usuario: usarioDB
    });
  });
});

app.put('/usuario/:id', [verificaToken,verificaAdminRole],(req, res) => {
  const id = req.params.id;
  const body = _.pick(req.body, ['nombre', 'email', 'role', 'estado']);
  Usuario.findByIdAndUpdate(
    id,
    body,
    {
      new: true,
      runValidators: true,
      context: 'query'
    },
    (err, UsuarioDB) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err: err
        });
      }
      res.json({
        ok: true,
        usuario: UsuarioDB
      });
    }
  );
});

app.delete('/usuario/:id', [verificaToken,verificaAdminRole],(req, res) => {
  const id = req.params.id;
  const cambiaEstado = {
    estado: false
  };
  Usuario.findByIdAndUpdate(
    id,
    cambiaEstado,
    {
      context: 'query'
    },
    (err, UsuarioDB) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err: err
        });
      }
      if (!UsuarioDB) {
        return res.status(404).json({
          ok: false,
          err: {
            message: 'Usuario no encontrado'
          }
        });
      }
      res.json({
        ok: true,
        usuario: UsuarioDB
      });
    }
  );
});

module.exports = app;
