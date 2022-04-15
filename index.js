#!/usr/bin/node

// Require the necessary discord.js classes
const {Client, Intents} = require( `discord.js` );
const {} = require( `/etc/Projects/MasBot/vars.json` );

// Create a new Discord client instance
const client = new Client({intents: [Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES]});

// For troubleshooting. Really doesn't need to be async but it is.
client.once(`ready`, (async ()=>{
    console.log(`Ready`);
  }));


  
// Everything past this point is used for troubleshooting.
client.once(`reconnecting`, () => {
    console.log(`Reconnecting!`);
  });
  
  client.once(`disconnect`, () => {
    console.log(`Disconnect!`);
  });
  
  client.on(`warn`, async (info) => {
    console.error(new Date() + `: Discord client encountered a warning`);
    console.log(info);
  });
  client.on(`error`, async (error) => {
    console.error(new Date() + `: Discord client encountered an error`);
    console.log(error);
  });
  client.on(`unhandledReject`, console.log);
  
  client.login(token);