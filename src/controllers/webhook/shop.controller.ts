import type { FastifyReply, FastifyRequest } from "fastify";

import { getCourseById } from "../../services/database/course.service";
import { assignCourseToUser, upsertUser } from "../../services/database/user.service";
import { sendWelcomeEmail } from "../../services/emailNotifications/sendWelcomeEmail";

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
  const user = await upsertUser(email, initialPassword);

  for (const product of products) {
    // TODO: Replace code with identifier if needed or search by course code instead of id
    const course = await getCourseById(product.code);
    if (!course) {
      console.error(`Course with id: ${product.code} not found. User: ${email}`);
      // TODO Add notification on slack for dev team
      continue;
    }

    await assignCourseToUser(user.uuid, course.uuid);
    // TODO Create a slack channel for the user
  }

  await sendWelcomeEmail(email, initialPassword);

  return res.send(true);
}
