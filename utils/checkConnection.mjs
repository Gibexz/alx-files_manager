import dbClient from './db.js';

async function checkConnection() {
  console.log('Before connection:');
  console.log('Is DB connection alive?', dbClient.isAlive());

  // Establish the connection by creating an instance of DBClient
  await dbClient.client.connect();

  console.log('After connection:');
  console.log('Is DB connection alive?', dbClient.isAlive());
  console.log('Number of users:', await dbClient.nbUsers());
  console.log('Number of files:', await dbClient.nbFiles());
}

checkConnection();
