const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json({ limit: "50mb" }));

app.get('/', (req, res) => {
  res.send('Hello Express app!')
});

app.get('/users', (req, res) => {
  res.json({
    "users": [
      {
        "name": "Jhon",
        "tipoid": "CC",
        "id": 105680645,
        "email": "abc@gmail.com",
        "dateborn": "01-01-1970",
        "dateexp": "01-01-2000",
        "ingresos": 2000000,
        "egresos": 1000000,
      },
      {
        "name": "Kate",
        "tipoid": "CC",
        "id": 998889076,
        "email": "abc@gmail.com",
        "dateborn": "01-01-1970",
        "dateexp": "01-01-2000",
        "ingresos": 2000000,
        "egresos": 1000000,
      },
    ]
  })
})

app.post('/users', async (req, res) => {
  try {

    const { name, tipoid, id, email, dateborn, dateexp, ingresos, egresos, password } = req.body;

    if (!(name && tipoid && id && email && dateborn && dateexp && ingresos && egresos && password)) {
      res.status(400).send("All input is required");
    }

    const user = {
      "name": name,
      "tipoid": tipoid,
      "id": id,
      "email": email,
      "dateborn": dateborn,
      "dateexp": dateexp,
      "ingresos": ingresos,
      "egresos": egresos
    }

    res.status(201).json(user);

  } catch (err) {
    console.log(err);
  }
});

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

app.listen(3000, () => {
  console.log('server started');
});
