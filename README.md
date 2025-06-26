# Duplicati + Discord Cloudflare Workers

If you want to send notifications from your (self-hosted) [Duplicati](https://duplicati.com/) instance to Discord, then you can deploy this [Cloudflare worker](https://developers.cloudflare.com/workers/) to your Cloudflare account. When called, it modifies the incoming Duplicati notification data and sends an embedded message to a Discord webhook URL.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/LekoArts/duplicati-discord-cloudflare-worker)

## Instructions

1. Press the **Deploy to Cloudflare** button above and complete all steps. Make sure that the worker is successfully deployed.
1. Create a [webhook URL](https://support.discord.com/hc/en-us/articles/228383668-Intro-to-Webhooks) for a given Discord channel

   It will be in the following format:

   ```shell
   https://discord.com/api/webhooks/123/abcdef
   ```

   Copy the `123/abcdef` portion to your clipboard.

1. Open your Duplicati dashboard and select **"Edit"** on the backup you wish to receive notifications for. Navigate to **"Options"** and under **"Advanced options"** click the three dots to **"Edit as text"**.

   Add the `--send-http-json-urls` flag with your URL as following:

   ```text
   --send-http-json-urls=https://url-to-your-worker.com/123/abcdef
   ```

1. Save the backup configuration. Run a backup and check if it's working.

**Optional:** To only receive notifications when a backup results in a warning or error, add this under **"Advanced options"** as well (on a separate row):

```text
--send-http-level=Warning,Error,Fatal
```

### Discord thread / forum channel

If you want to send notifications to a [Discord thread](https://support.discord.com/hc/en-us/articles/4403205878423-Threads-FAQ) or to a post inside a [forum channel](https://support.discord.com/hc/en-us/articles/6208479917079-Forum-Channels-FAQ), you need to pass a `thread_id` to the Cloudflare worker. Here's how you can do that:

1. Navigate to the thread / forum post, right-click it, and choose **"Copy Link"**.

   It will be in the following format:

   ```shell
   https://discord.com/channels/123/456
   ```

   The `456` is your `thread_id`.

1. Adjust the URL you're passing to the `--send-http-json-urls` flag by adding `?thread_id=<your-thread-id>` to the end of it:

   ```diff
   - --send-http-json-urls=https://url-to-your-worker.com/123/abcdef
   + --send-http-json-urls=https://url-to-your-worker.com/123/abcdef?thread_id=456
   ```
