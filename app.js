require("dotenv").config();
require("./config/database").connect();
const express = require('express');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require('cors');

const User = require("./model/user");
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
  const user = await User.findOne({"id": id});

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

app.get('/solicitudes', (req, res) => {
  res.json({
    "solicitudes": [
      {
        "id": 1,
        "idCliente": 105680645,
        "valor": 2000000,
        "plazo": 36,
      },
      {
        "id": 2,
        "idCliente": 998889076,
        "valor": 6000000,
        "plazo": 36,
      },
      {
        "id": 3,
        "idCliente": 13058385,
        "valor": 10000000,
        "plazo": 36,
      }
    ]
  })
});

app.post('/solicitudes', (req, res) => {
    try {

    const { valor, plazo } = req.body;

    if (!(valor && plazo)) {
      res.status(400).send("All input is required");
    }

    const solicitud = {
      "valor": valor,
      "plazo": plazo
    }

    res.status(201).json(solicitud);

  } catch (err) {
    console.log(err);
  }
})

app.get('/creditos', (req, res) => {
  res.json({
    "creditos": [
      {
        "id": 1,
        "idCliente": 123,
        "valor": 5000000,
        "plazo": 36,
        "cuotas": [
          {
            "id": 1,
            "fecha": "01-01-2021",
            "capital": 1000,
            "interes": 300,
            "pagada": false
          },
          {
            "id": 2,
            "fecha": "01-01-2021",
            "capital": 1000,
            "interes": 300,
            "pagado": false
          },
          {
            "id": 3,
            "fecha": "01-01-2021",
            "capital": 1000,
            "interes": 300,
            "pagado": false
          },
          {
            "id": 4,
            "fecha": "01-01-2021",
            "capital": 1000,
            "interes": 300,
            "pagado": false
          },
        ]
      },
      {
        "id": 2,
        "idCliente": 2,
        "valor": 3000000,
        "plazo": 24
      },
      {
        "id": 3,
        "idCliente": 3,
        "valor": 8000000,
        "plazo": 12
      },
    ]
  })
})

app.post('/creditos', (req, res) => {
  try {

    const { valor, plazo, tasa } = req.body;

    if (!(valor && plazo && tasa )) {
      res.status(400).send("All input is required");
    }

    const credito = {
      "valor": valor,
      "plazo": plazo,
      "tasa": tasa
    }

    res.status(201).json(credito);

  } catch (err) {
    console.log(err);
  }
});

app.delete('/user/:id', async (req, res) => {
  const id = req.params.id;

  const user = await User.deleteOne({"id": id});
});

app.listen(3000, () => {
  console.log('server started');
});
