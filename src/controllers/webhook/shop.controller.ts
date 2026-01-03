import type { FastifyReply, FastifyRequest } from "fastify";

import { getCourseById } from "../../services/database/course.service";
import {
  assignCourseToUser,
  updateUserSlackChannel,
  upsertUser,
} from "../../services/database/user.service";
import { sendWelcomeEmail } from "../../services/emailNotifications/sendWelcomeEmail";
import { createSlackChannel } from "../../services/slackService/createUserSlackChannel.service";

import { generateInitialPassword } from "../../utils/generateInitialPassword";

interface ShopProduct {
  product_id: number;
  name: string;
  code: string;
}
interface OrderPaidWebhook {
  order_id: number;
  email: string;
  products: ShopProduct[];
}

export async function handleShopWebhook(req: FastifyRequest, res: FastifyReply) {
  // TODO: When event schema is known add check for event type
  // order.paid event should be handled
  const { email, products } = req.body as OrderPaidWebhook;

  const initialPassword = generateInitialPassword();

  let user = await upsertUser(email, initialPassword, req.log);

  if (!user.slackChannel) {
    try {
      // TODO Replace with user name and last name if available
      const channelName = `${email.toLowerCase().replace(/[@.+]/g, "_")}-${user.uuid}`;
      const slackChannel = await createSlackChannel(channelName);

      user = await updateUserSlackChannel(user.uuid, slackChannel.id, req.log);
    } catch (error) {
      req.log.error({ msg: "Error creating Slack channel", error });
      return res.status(400).send({ error: "Nie udało się zaktualizować danych użytkownika" });
    }
  } else {
    req.log.info({
      msg: "User already has a Slack channel, skipping creation",
      email,
      slackChannel: user.slackChannel,
    });
  }

  for (const product of products) {
    // TODO: Replace code with identifier if needed or search by course code instead of id
    const course = await getCourseById(product.code, req.log);
    if (!course) {
      req.log.error({ msg: "Course not found", courseId: product.code, email, userId: user.uuid });
      // TODO Add notification on slack for dev team
      continue;
    }

    await assignCourseToUser(user.uuid, course.uuid, req.log);
  }

  await sendWelcomeEmail(email, initialPassword, req.log);

  return res.send(true);
}
