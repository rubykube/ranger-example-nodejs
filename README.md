# ranger-example-nodejs

This source code shows simple example of working with Peatio Ranger service
using WebSocket channels.

# How it works

The program connects to running Ranger service using WebSocket protocol

If `--jwt` flag is specified, it tries to solve the authentication challenge
and subscribes to public and private member channels. If `--jwt` flag is not
specified then the program will just subscribe to public channels such as
global tickers update and market bids/asks tickers.

If `--jwt` flag is specified and the authentication challenge is failed, the
program will exit with exitcode 1.

After connecting and optinally solving the authentication challenge the
programm will start receiving messages from the WebSocket stream, all received
messages will be printed in following format in console:

```
[INFO] Channel: <channel-name> Payload: <data>
```

# First start

You need to ensure that you have installed dependencies required by this
example such as `ws` library.

Run `npm install`.

# Starting

Just run `node app.js`, if you want to specify hostname of ranger then you need
to use `--host` option, see section **Configuration** below.

# Configuration

The example supports few options:
- `--host` - Allows to specify hostname of Ranger. By default will be used
    address of workbench's ranger service: `ws.ranger.wb.local`.
- `--jwt` - Allows to specify a JWT token for authentication.
