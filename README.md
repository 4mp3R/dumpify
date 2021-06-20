## Dumpify

Dumpify allows you to dump the list of tracks saved in your Spotify account into a text file in the format `Number). Artist - Album - Track`.

### Setup & Usage

- Run `yarn install` or `npm install`
- Create a new app on the [Spotify Dashboard](https://developer.spotify.com/dashboard/applications)
  - Set `Website` to `http://localhost:1337`
  - Add `http://localhost:1337/callback` to your redirect URIs
  - Once a new app is created you'll get Client ID and Client Secret for it
- Crete a `config.json` config file by cloning the `config.json.template` and filling it in with Client ID and Secret from the previous step
- Run `yarn dump` of `npm run dump`
- Open the link proposed by the app in a web browser
- Go back to the terminal and follow the progress. You'll be notified once the dump is complete
- The list of tracks will be written to the `tracks.txt` file
