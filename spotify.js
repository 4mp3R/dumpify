const querystring = require('querystring');
const axios = require('axios');

function getAuthUrl(clientId, redirectUrl) {
  const authorizationParams = querystring.stringify({
    client_id: clientId,
    response_type: 'code',
    redirect_uri: redirectUrl,
    scope: 'user-library-read',
    state: 'pikachu',
  });

  return `https://accounts.spotify.com/authorize?${authorizationParams}`;
}

async function getAuthTokens(clientId, clientSecret, authCode, redirectUrl) {
  const basicAuthToken = Buffer.from(`${clientId}:${clientSecret}`).toString(
    'base64'
  );

  const {
    data: { access_token: accessToken, refresh_token: refreshToken },
  } = await axios.post(
    'https://accounts.spotify.com/api/token',
    // Will send the data as application/x-www-form-urlencoded
    querystring.stringify({
      code: authCode,
      grant_type: 'authorization_code',
      redirect_uri: redirectUrl,
    }),
    {
      headers: {
        Authorization: `Basic ${basicAuthToken}`,
      },
    }
  );

  return { accessToken, refreshToken };
}

async function fetchMusicTracks(accessToken, tracksPageUrl) {
  const {
    data: { offset, total, items, next },
  } = await axios.get(tracksPageUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  console.log(`Fetched ${offset} / ${total} tracks`);

  if (next) {
    return [...items, ...(await fetchMusicTracks(accessToken, next))];
  }

  return items;
}

function getMusicTracks(accessToken) {
  const firstPageUrl =
    'https://api.spotify.com/v1/me/tracks?' +
    querystring.stringify({
      limit: 50,
      offset: 0,
    });

  return fetchMusicTracks(accessToken, firstPageUrl);
}

function stringifyTrackInfo(trackInfo, index) {
  return [
    trackInfo.track.artists[0].name,
    trackInfo.track.album.name,
    trackInfo.track.name,
  ].join(' - ');
}

module.exports = {
  getAuthUrl,
  getAuthTokens,
  getMusicTracks,
  stringifyTrackInfo,
};
