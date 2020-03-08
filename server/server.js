require('./config/config');
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.use(require('./routes/index'));

makeConnection = async () => {
  await mongoose.connect(
    process.env.URLDB,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    },
    (err, res) => {
      if (err) throw err;
      console.log('Database online');
    }
  );
};
makeConnection().catch(err => console.log(err));

app.listen(process.env.PORT, () => {
  console.log(`listen in port 3000`);
});
