const { writeFileSync } = require('fs');

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
const state = 'pikachu'; // TODO: verify state
const redirectUrl = `http://localhost:${port}/callback`;
const outFile = './tracks.txt';

app.get('/callback', async (req, res) => {
  const { error, code, state } = req.query;

  if (error) {
    const errorMessage = `Spotify authorization error: ${error}`;
    console.error(errorMessage);
    res.status(400).send(errorMessage);
    return;
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
  console.log(`Open in browser: ${getAuthUrl(clientId, redirectUrl)}`);
});
