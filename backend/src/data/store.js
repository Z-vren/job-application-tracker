const fs = require('fs').promises;
const path = require('path');

const dataFile = path.join(__dirname, '..', '..', 'data', 'db.json');

async function readData() {
  try {
    const raw = await fs.readFile(dataFile, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    if (err.code === 'ENOENT') {
      return { users: [], applications: [] };
    }
    throw err;
  }
}

async function writeData(data) {
  await fs.writeFile(dataFile, JSON.stringify(data, null, 2));
}

async function findUserByEmail(email) {
  const data = await readData();
  return data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

async function findUserById(id) {
  const data = await readData();
  return data.users.find((u) => u.id === id);
}

async function addUser(user) {
  const data = await readData();
  data.users.push(user);
  await writeData(data);
  return user;
}

async function getApplicationsForUser(userId) {
  const data = await readData();
  return data.applications.filter((app) => app.userId === userId);
}

async function addApplication(application) {
  const data = await readData();
  data.applications.push(application);
  await writeData(data);
  return application;
}

async function updateApplication(userId, appId, updates) {
  const data = await readData();
  const index = data.applications.findIndex(
    (app) => app.id === appId && app.userId === userId
  );

  if (index === -1) {
    return null;
  }

  data.applications[index] = { ...data.applications[index], ...updates };
  await writeData(data);
  return data.applications[index];
}

async function deleteApplication(userId, appId) {
  const data = await readData();
  const initialLength = data.applications.length;
  data.applications = data.applications.filter(
    (app) => !(app.id === appId && app.userId === userId)
  );

  const deleted = data.applications.length !== initialLength;
  if (deleted) {
    await writeData(data);
  }
  return deleted;
}

module.exports = {
  readData,
  writeData,
  findUserByEmail,
  findUserById,
  addUser,
  getApplicationsForUser,
  addApplication,
  updateApplication,
  deleteApplication,
};

