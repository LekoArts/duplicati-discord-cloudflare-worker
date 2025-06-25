# Duplicati + Discord Cloudflare Worker

If you want to send notifications from your (self-hosted) [Duplicati](https://duplicati.com/) instance to Discord, then you can deploy this [Cloudflare worker](https://developers.cloudflare.com/workers/) to your Cloudflare account. When called, it modifies the incoming Duplicati notification data and sends an embedded message to a Discord webhook URL.

## Instructions

### 1. [Mostly automatic](https://developers.cloudflare.com/workers/platform/deploy-buttons/)

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/LekoArts/duplicati-discord-cloudflare-worker)

### 2. Manual

1. Clone this repository and install the dependencies with `pnpm install`
1. Deploy the Cloudflare worker to your account by running `pnpm run deploy`

## Steps after worker is deployed

### 1. Get webhook URL for Discord channel

[Create a webhook](https://support.discord.com/hc/en-us/articles/228383668-Intro-to-Webhooks) URL for a given Discord channel …

- If you want to post to an ordinary channel, copy the default webhook URL as is. It will be in the following format: `https://discord.com/api/webhooks/123…/abcdef…`<br>
  Copy the `123…/abcdef…` portion of the URL.

- If you want to support [Discord threads](https://support.discord.com/hc/en-us/articles/4403205878423-Threads-FAQ), create a thread in Discord first. Then copy the link to it by right-clicking it and choose **Copy Link**.<br>The link will be in the form of `https://discord.com/channels/123…/987…`.
  Extract the last part after the slash ('/'), i.e. `987…` - that's the thread id. Then append this `?thread_id=987…` string to the previously defined webhook URL.<br>
  Copy the compounded string `123/abcdef?thread_id=987…` to your clipboard.

### 2. Merge the Cloudflare worker URL with the copied string

This should result in a string similar to `https://duplicati-discord-cloudflare-worker.<some_identifier>.workers.dev/123…/abcdef…`<br>
Or, for threads: `https://duplicati-discord-cloudflare-worker.<some_identifier>.workers.dev/123…/abcdef…?thread_id=987…`

### 3. Update Duplicati configuration
   
1. Open your Duplicati dashboard and select **Edit** on the backup you wish to receive notifications for.
2. Navigate to **Options** and under **Advanced options** click the three dots to **Edit as text**.
3. Add the `--send-http-json-urls` flag with your URL as following:
   ```text
   --send-http-json-urls=https://url-to-your-worker.com/123…/abcdef…                    # for ordinary channels
   
   --send-http-json-urls=https://url-to-your-worker.com/123…/abcdef…?thread_id=987…     # for thread support
   ```

1. Save the backup configuration. Run a backup and check if it's working.

### 4. Set level for sending notifications (optional)
To only receive notifications when a backup results in a warning or error, add this to the options as well (on a separate row)
```
--send-http-level=Warning,Error,Fatal
```
