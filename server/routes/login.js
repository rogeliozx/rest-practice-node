const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');
const app = express();

app.post('/login', (req, res) => {
  const body = req.body;
  Usuario.findOne(
    {
      email: body.email
    },
    (err, UsuarioDB) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err
        });
      }
      if (!UsuarioDB) {
        return res.status(400).json({
          ok: false,
          err: {
            message: 'usuario or password. incorrect'
          }
        });
      }

      if (!bcrypt.compareSync(body.password, UsuarioDB.password)) {
        res.status(400).json({
          ok: false,
          err: {
            message: 'usuario. or password incorrect'
          }
        });
      }
      const token = jwt.sign(
        {
          usuario: UsuarioDB
        },
        process.env.SEED,
        { expiresIn: 60 * 60 * 24 * 30 }
      );
      res.status(200).json({
        ok: true,
        usuario: UsuarioDB,
        token
      });
    }
  );
});

module.exports = app;
