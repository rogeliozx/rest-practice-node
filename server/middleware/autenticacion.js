const jwt = require('jsonwebtoken');
//verificar token
const verificaToken = (req, res, next) => {
  const token = req.get('Authorization'); //Authorization
  jwt.verify(token, process.env.SEED, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        ok: false,
        err
      });
    }
    req.usuario = decoded.usuario;
    next();
  });
};
const verificaAdminRole = (req, res, nex) => {
  const usuario = req.usuario;
  if (usuario.role === 'ADMIN_ROLE') {
    nex();
  } else {
    return res.json({
      ok: false,
      err: {
        message: 'El usuario no es administrador'
      }
    });
  }
};

module.exports = {
  verificaToken,
  verificaAdminRole
};
