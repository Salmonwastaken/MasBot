#!/usr/bin/node

// Require the necessary discord.js classes
const {Client, Intents} = require( `discord.js` );
const {Dropbox} = require(`dropbox`); // eslint-disable-line no-unused-vars
const {Token,
  globalInterval,
  dropboxToken,
  mascotchannelId,
  dropboxFolder,
  danId} = require( `/etc/Projects/MasBot/vars.json` );

// Create a new Discord client instance
const client = new Client({intents: [Intents.FLAGS.GUILDS,
  Intents.FLAGS.GUILD_MESSAGES]});


// For troubleshooting. Really doesn't need to be async but it is.
client.once(`ready`, (async ()=>{
  const dbx = new Dropbox({accessToken: dropboxToken});
  console.log(dbx.auth.getRefreshToken());
  console.log(dbx.auth.getAccessToken());
  dbx.auth.setRefreshToken(refresh);

  // idk man all these clowns just keep revoking acces tokens
  // so we get a new one every ~3 hours
  setInterval(async () => {
    newToken = dbx.auth.checkAndRefreshAccessToken();
    console.log(newToken);
    dbx.auth.setAccessToken(newToken);
  }, 10000);

  console.log(`Ready`);
  setInterval(async () => {
    // Fetch channels and save them in a const
    const Mascot = await client.channels.fetch(mascotchannelId).catch();
    const Dan = await client.users.fetch(danId).catch();
    // Make sure they were fetched properly and continue
    if ( Mascot ) {
      dbx.filesListFolder({path: dropboxFolder})
          .then((fileList) => {
            const fileName = fileList.result.entries[0].name;
            const filePath = fileList.result.entries[0].path_lower;
            if ( fileName && filePath ) {
              dbx.filesGetTemporaryLink({path: filePath})
                  .then((fileLink) => {
                    const Link = fileLink.result.link;
                    const mascotMessage = Mascot.send({
                      content: ``,
                      files: [{
                        attachment: Link,
                        name: fileName,
                      }],
                    }).catch();
                    if ( mascotMessage ) {
                      dbx.filesDeleteV2({path: filePath})
                          .then((response) => {
                            console.log('Succesfully deleted file: ' +
                            response.result.metadata.path_display);
                          })
                          .catch((err) => {
                            console.log(err);
                          });
                    }
                  })
                  .catch((err) => {
                    console.log(err);
                  });
            }
          })
          .catch((err) => {
            console.log(err);
            Mascot.send({
              content: `${Dan} Man what the fuck there are no images left.`,
            });
          });
    } else {
      console.log('Couldn\'t find that channel man, shit sucks big time.');
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

client.login(Token);
