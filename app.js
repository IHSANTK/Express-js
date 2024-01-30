const express = require('express');
const path = require('path');
const fs = require('fs');
const cookieSession = require('cookie-session');
const { v4: uuidv4 } = require('uuid');

const app = express();


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res) => {
  res.redirect('/form');
});

app.get('/form', (req, res) => {
  const userId = req.query.id;
  const user = getUserById(userId);
  res.render('form', { user });
});

app.get('/index', (req, res) => {
  const data = readData();
  res.render('index', { data });
});

app.post('/add-user', (req, res) => {
  const { id, name, number, email, password } = req.body;

  if (id) {
    
    editUser(id, name, number, email, password);
  } else {
    
    addUser(name, number, email, password);
  }

 
  const updatedData = readData();
  res.render('index', { data: updatedData });
});

app.post('/delete-user', (req, res) => {
  const idToDelete = req.body.id;
  deleteUser(idToDelete);
  
  const updatedData = readData();
  res.render('index', { data: updatedData });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

function getUserById(userId) {
  const data = readData();
  return data.find(user => user.id === userId) || {};
}

function readData() {
  try {
    const dataPath = path.join(__dirname, 'data.json');
    const data = fs.readFileSync(dataPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

function saveData(data) {
  const dataPath = path.join(__dirname, 'data.json');
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8');
}

function addUser(name, number, email, password) {
  const data = readData();
  const newId = uuidv4();
  data.push({ id: newId, name, number, email, password });
  saveData(data);
}

function editUser(id, name, number, email, password) {
  const data = readData();
  const existingUserIndex = data.findIndex(user => user.id === id);
  if (existingUserIndex !== -1) {
    data[existingUserIndex] = { id, name, number, email, password };
    saveData(data);
  }
}

function deleteUser(idToDelete) {
  const data = readData();
  const newData = data.filter(user => user.id !== idToDelete);
  saveData(newData);
}
