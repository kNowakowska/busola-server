export async function postMessageToSlack(channel: string, message: string) {
  const result = await fetch("https://slack.com/api/chat.postMessage", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.SLACK_BOT_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      token: process.env.SLACK_BOT_TOKEN,
      channel,
      text: message,
    }),
  });

  const data = await result.json();

  if (!data?.ok) {
    throw new Error(`Failed to post message to Slack: ${data?.error}`);
  }
  return data;
}
