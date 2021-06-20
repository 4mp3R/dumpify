const { writeFileSync } = require('fs');
const { v4: uuidv4 } = require('uuid');

const { clientId, clientSecret } = require('./config.json');
const {
  getAuthUrl,
  getAuthTokens,
  getMusicTracks,
  stringifyTrackInfo,
} = require('./spotify');
const { numberify } = require('./utils');

const express = require('express');
const app = express();

const port = 1337;
const state = uuidv4();
const redirectUrl = `http://localhost:${port}/callback`;
const outFile = './tracks.txt';

app.get('/callback', async (req, res) => {
  const { error, code, state: receivedState } = req.query;

  if (error) {
    throw new Error(`Spotify authorization error: ${error}`);
  }

  if (state !== receivedState) {
    throw new Error(`Received state differs from the sent one`);
  }

  const { accessToken } = await getAuthTokens(
    clientId,
    clientSecret,
    code,
    redirectUrl
  );

  console.log('Authenticated, fetching tracks...');

  const tracks = await getMusicTracks(accessToken);

  console.log(tracks.length, 'tracks fetched');

  writeFileSync(
    outFile,
    tracks.map(stringifyTrackInfo).sort().map(numberify).join('\n')
  );

  const doneMessage = `All done! You can find the list of your tracks in ${outFile}`;
  console.log(doneMessage);
  res.send(doneMessage);
});

app.listen(port, () => {
  console.log(`Open in browser: ${getAuthUrl(clientId, redirectUrl, state)}`);
});
