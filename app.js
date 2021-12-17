require("dotenv").config();
require("./config/database").connect();
const express = require('express');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require('cors');

const User = require("./model/user");
const Solicitud = require("./model/solicitud");
const Credito = require("./model/credito");
const auth = require("./middleware/auth");

const app = express();

app.use(cors());
app.use(express.json({ limit: "50mb" }));

app.get('/', (req, res) => {
  res.send('Hello Express app!')
});

app.post("/register", async (req, res) => {
  try {
    // Get user input
    const { name, tipoid, id, email, dateborn, dateexp, ingresos, egresos, password } = req.body;

    // Validate user input
    if (!(name && tipoid && id && email && dateborn && dateexp && ingresos && egresos && password)) {
      res.status(400).send("All input is required");
    }

    // check if user already exist
    // Validate if user exist in our database
    const oldUser = await User.findOne({ id });

    if (oldUser) {
      return res.status(409).send("User Already Exist. Please Login");
    }

    //Encrypt user password
    encryptedPassword = await bcrypt.hash(password, 10);

    // Create user in our database
    const user = await User.create({
      name,
      tipoid,
      id,
      email: email.toLowerCase(), // sanitize: convert email to lowercase
      dateborn,
      dateexp,
      ingresos,
      egresos,
      password: encryptedPassword,
    });

    // Create token
    const token = jwt.sign(
      { user_id: user._id, id },
      process.env.TOKEN_KEY,
      {
        expiresIn: "2h",
      }
    );
    // save user token
    user.token = token;

    // return new user
    res.status(201).json(user);
  } catch (err) {
    console.log(err);
  }
});

app.post("/login", async (req, res) => {
  try {
    // Get user input
    const { id, password } = req.body;

    // Validate user input
    if (!(id && password)) {
      res.status(400).send("All input is required");
    }
    // Validate if user exist in our database
    const user = await User.findOne({ id });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      const token = jwt.sign(
        { user_id: user._id, id },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );

      // save user token
      user.token = token;

      // user
      res.status(200).json(user);
    }
    res.status(400).send("Invalid Credentials");
  } catch (err) {
    console.log(err);
  }
});

app.get('/users', async (req, res) => {
  const users = await User.find({});

  try {
    res.send(users);
  } catch (err) {
    res.status(500).send(err);
  }
})

app.get('/user/:id', async (req, res) => {
  const id = req.params.id
  const user = await User.findOne({ "id": id });

  try {
    res.send(user);
  } catch (err) {
    res.status(500).send(err);
  }
})

app.put('/user/:id', async (req, res) => {
  try {
    // Get user input 
    const { name, tipoid, email, dateborn, dateexp, ingresos, egresos } = req.body;

    user = {
      name,
      tipoid,
      email,
      dateborn,
      dateexp,
      ingresos,
      egresos
    }

    // Create user in our database
    await User.updateOne({ id: req.params.id }, user)
      .then(doc => {
        if (!doc) {
          return res.status(404).end();
        }
        return res.status(200).json(doc);
      })

  } catch (err) {
    console.log(err);
  }
})

app.get('/solicitudes', async (req, res) => {
  const solicitudes = await Solicitud.find({});

  try {
    res.send(solicitudes);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post('/solicitudes', async (req, res) => {
  try {

    const { idCliente, valor, plazo } = req.body;

    if (!(idCliente && valor && plazo)) {
      res.status(400).send("All input is required");
    }

    const solicitud = await Solicitud.create({
      idCliente,
      valor,
      plazo
    });

    res.status(201).json(solicitud);

  } catch (err) {
    console.log(err);
  }
})

app.get('/solicitud/:id', async (req, res) => {
  const id = req.params.id

  const solicitud = await Solicitud.findOne({ "id": id });

  try {
    res.send(solicitud);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get('/creditos', async (req, res) => {
  const creditos = await Credito.find({});

  try {
    res.send(creditos);
  } catch (err) {
    res.status(500).send(err);
  }
})

app.post('/creditos', async (req, res) => {
  try {

    const { idCliente, valor, plazo, tasa } = req.body;

    if (!(valor && plazo && tasa)) {
      res.status(400).send("All input is required");
    }

    var cuotas = [];
    const date = new Date();

    for (let i = 0; i < plazo; i++) {
      var c = {
        "numero": i + 1,
        "fecha": `01-${i}-2021`,
        "capital": valor / plazo,
        "interes": (valor - valor * (i / plazo)) * tasa
      }
      cuotas.push(c);
    }

    const credito = await Credito.create({
      idCliente,
      valor,
      plazo,
      tasa,
      cuotas,
      date
    });

    res.status(201).json(credito);

  } catch (err) {
    console.log(err);
  }
});

app.get('/credito/:id', async (req, res) => {
  const id = req.params.id

  const credito = await Credito.findOne({ "idCredito": id });

  try {
    res.send(credito);
  } catch (err) {
    res.status(500).send(err);
  }
})

app.delete('/user/:id', async (req, res) => {
  const id = req.params.id;

  const user = await User.deleteOne({ "id": id });
});

app.listen(3000, () => {
  console.log('server started');
});
