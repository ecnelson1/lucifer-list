const express = require('express');
const cors = require('cors');
const client = require('./client.js');
const app = express();
const morgan = require('morgan');
const ensureAuth = require('./auth/ensure-auth');
const createAuthRoutes = require('./auth/create-auth-routes');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev')); // http logging

const authRoutes = createAuthRoutes();


app.use('/auth', authRoutes);

app.use('/api', ensureAuth);

app.get('/api/test', (req, res) => {
  res.json({
    message: `in this proctected route, we get the user's id like so: ${req.userId}`
  });
});

app.get('/characters', async(req, res) => {
  try {
    const data = await client.query(`
    SELECT
    characters.id,
    characters.name,
    characters.seasons,
    characters.is_divine,
    types.type as type,
    characters.type_id,
    characters.owner_id 
    FROM characters
    JOIN types
    ON characters.type_id = types.id
    `);

    res.json(data.rows);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});

app.get('./categories', async(req, res) => {
  try {
    const data = await client.query('SELECT * FROM types');

    res.json(data.rows);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});

app.get('/characters/:id', async(req, res) => {
  try {
    const id = req.params.id;
    const data = await client.query(`
    SELECT
    characters.id,
    characters.name,
    characters.seasons,
    characters.is_divine,
    types.type as type,
    characters.type_id,
    characters.owner_id 
    FROM characters
    JOIN types
    ON characters.type_id = types.id
    WHERE characters.id=$1`, [id]);
    
    res.json(data.rows[0]);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});
app.post('/characters', async(req, res) => {
  try {
    const data = await client.query(
      `INSERT into characters (name, seasons, is_divine, type_id, owner_id)
    values ($1, $2, $3, $4, $5)
    returning *`,
      [
        req.body.name,
        req.body.seasons,
        req.body.is_divine,
        req.body.type_id,
        1,
      ]);
    
    res.json(data.rows[0]);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});
app.put('/characters/:id', async(req, res) => {
  const id = req.params.id;
  try {
    const data = await client.query(`
    UPDATE characters 
    SET name=$1, seasons=$2, is_divine=$3, type_id=$4 
    WHERE id=$5 
    returning *;
    `,
    [
      req.body.name,
      req.body.seasons,
      req.body.is_divine,
      req.body.type_id,
      id,
    ]);
    
    res.json(data.rows[0]);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});
app.delete('/characters/:id', async(req, res) => {
  try {
    const id = req.params.id;
    const data = await client.query('DELETE FROM characters WHERE id=$1 RETURNING *', [id]);
    
    res.json(data.rows[0]);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});

app.use(require('./middleware/error'));

module.exports = app;
