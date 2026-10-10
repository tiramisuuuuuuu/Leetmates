import type { PushSubscription } from 'web-push';
import { Hono } from 'hono';
import { AppVariables } from '../types/variables';
import { db } from '../db';
import { pushSubscriptionsTable } from '../db/schema';
import { eq } from 'drizzle-orm';
import webpush from 'web-push';

webpush.setVapidDetails(
  process.env.VAPID_SUBJECT!,
  process.env.VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

const pushRoutes = new Hono<{ Variables: AppVariables }>();

pushRoutes.get('/public-key', (c) => {
  return c.json({
    publicKey: process.env.VAPID_PUBLIC_KEY,
  });
});

pushRoutes.post('/subscribe', async (c) => {
  const uid = c.get('uid');
  const subscription = (await c.req.json()) as PushSubscription;

  if (
    !subscription.endpoint ||
    !subscription.keys?.p256dh ||
    !subscription.keys?.auth
  ) {
    return c.json({ error: 'Invalid subscription' }, 400);
  }

  await db
    .insert(pushSubscriptionsTable)
    .values({
      userId: uid,
      endpoint: subscription.endpoint,
      subscription,
    })
    .onConflictDoUpdate({
      target: pushSubscriptionsTable.endpoint,
      set: { userId: uid, subscription },
    });

  return c.json({ success: true });
});

pushRoutes.post('/test', async (c) => {
  const uid = c.get('uid');

  const subscriptions = await db
    .select()
    .from(pushSubscriptionsTable)
    .where(eq(pushSubscriptionsTable.userId, uid));

  if (subscriptions.length === 0) {
    return c.json(
      { error: 'No push subscription found. Enable notifications first.' },
      404
    );
  }

  const results = await Promise.allSettled(
    subscriptions.map(({ subscription }) =>
      webpush.sendNotification(
        subscription as PushSubscription,
        JSON.stringify({
          title: 'Leetmates',
          body: 'Your Web Push test worked!',
        })
      )
    )
  );

  for (const [index, result] of results.entries()) {
    if (result.status === 'fulfilled') {
      console.log('Push sent:', result.value.statusCode);
    } else {
      if (
        result.status === 'rejected' &&
        (result.reason?.statusCode === 404 || result.reason?.statusCode === 410)
      ) {
        // subscription became invalid for some reason
        await db
          .delete(pushSubscriptionsTable)
          .where(eq(pushSubscriptionsTable.id, subscriptions[index].id));
      } else {
        console.error('Push failed:', result.reason);
      }
    }
  }

  const sent = results.filter((result) => result.status === 'fulfilled').length;

  return c.json({ sent, total: subscriptions.length });
});

export default pushRoutes;
