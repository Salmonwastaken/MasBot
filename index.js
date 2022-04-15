#!/usr/bin/node

// Require the necessary discord.js classes
const {Client, Intents, MessageEmbed} = require( `discord.js` );
const drbox = require(`dropbox`); // eslint-disable-line no-unused-vars
const {token,
  globalInterval,
  dropboxtoken,
  mascotchannelid,
  dropfolder} = require( `/etc/Projects/MasBot/vars.json` );
const fs = require(`fs`);

// Create a new Discord client instance
const client = new Client({intents: [Intents.FLAGS.GUILDS,
  Intents.FLAGS.GUILD_MESSAGES]});

// For troubleshooting. Really doesn't need to be async but it is.
client.once(`ready`, (async ()=>{
  console.log(`Ready`);
  setInterval(async () => {
    // Fetch channels and save them in a const
    const mascot = await client.channels.fetch(mascotchannelid).catch();
    // Make sure they were fetched properly and continue
    if ( mascot ) {
      const dbx = new drbox.Dropbox({accessToken: dropboxtoken});
      dbx.filesListFolder({path: dropfolder})
          .then((response) => {
            console.log(response.result.entries[0].path_lower);
            const filepath = response.result.entries[0].path_lower;
            dbx.filesGetTemporaryLink({path: filepath})
                .then((response) => {
                  const filelink = response.result.link;
                  console.log(filelink);
                  // mascotmessage = mascot.send({
                  //   content: `I found this file! {}`,
                  //   files: [{
                  //     attachment: response.,
                  //     name: file,
                  //   }],
                  // }).catch();
                })
                .catch((err) => {
                  console.log(err);
                });
          })
          .catch((err) => {
            console.log(err);
          });
    }
  }, globalInterval);
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
