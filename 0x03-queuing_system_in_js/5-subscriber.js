#!/usr/bin/env node
// method to subscribe to the channel holberton school channel
import { createClient } from 'redis';

// Create Redis client
const subscriber = createClient();

// On connect
subscriber.on('connect', () => {
  console.log('Redis client connected to the server');
});

// On error
  subscriber.on('error', (error) => { 
  console.error(`Redis client not connected to the server: ${error}`);
});

// Subscribe to holberton school channel
subscriber.subscribe('holberton school channel');


  subscriber.on('message', (channel, message) => {
  console.log(`${message}`);
  if (message === 'KILL_SERVER') {
    subscriber.unsubscribe();
    subscriber.quit();
  }
});
