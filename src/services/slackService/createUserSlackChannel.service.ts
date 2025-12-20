export async function createSlackChannel(name: string) {
  const creationResult = await fetch("https://slack.com/api/conversations.create", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.SLACK_BOT_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      token: process.env.SLACK_BOT_TOKEN,
      name,
      is_private: false,
    }),
  });

  const creationData = await creationResult.json();

  if (!creationData?.ok) {
    throw new Error(`Failed to create Slack channel: ${creationData?.error}`);
  }

  const invitationResult = await fetch("https://slack.com/api/conversations.invite", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.SLACK_BOT_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      token: process.env.SLACK_BOT_TOKEN,
      channel: creationData?.channel?.id,
      users: [process.env.SLACK_TEACHER_USER_ID, process.env.SLACK_WEBHOOK_APP_USER_ID],
    }),
  });

  const invitationData = await invitationResult.json();

  if (!invitationData?.ok) {
    throw new Error(`Failed to invite user to Slack channel: ${invitationData?.error}`);
  }
  return creationData?.channel;
}
