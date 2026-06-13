# Smart Notification System

This project includes a Supabase-backed notification system for:

- realtime in-app alerts
- direct message notifications
- new session notifications
- announcements
- scheduled session reminders
- browser push notifications

## Database

Run these migrations in order:

```txt
supabase/migrations/20260518_app_bootstrap_and_notifications.sql
supabase/migrations/20260518_notification_automation.sql
```

Important tables:

```txt
notifications
push_subscriptions
session_participants
```

## Frontend

The notification UI is mounted in the navbar:

```txt
src/features/notifications/NotificationBell.tsx
src/features/notifications/useNotifications.ts
src/features/notifications/pushNotifications.ts
```

The bell fetches notification history, subscribes to Supabase Realtime, supports optimistic read updates, and can request browser notification permission.

## Edge Functions

Deploy these Supabase Edge Functions:

```bash
npx supabase functions deploy send-session-reminders
npx supabase functions deploy dispatch-push-notifications
npx supabase functions deploy send-push-notification
```

Schedule these in Supabase:

```txt
send-session-reminders: every minute
dispatch-push-notifications: every minute
```

Cron expression:

```txt
* * * * *
```

## Environment Variables

Frontend:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_VAPID_PUBLIC_KEY=
```

Supabase Edge Function secrets:

```txt
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
VAPID_PUBLIC_KEY
VAPID_PRIVATE_KEY
VAPID_SUBJECT
```

## Testing

Announcement:

```sql
select public.create_announcement_notification(
  'Platform update',
  'Smart notifications are now live.',
  '/dashboard'
);
```

Session notification:

```sql
insert into public.sessions (title, description, status, start_time)
values (
  'React Study Session',
  'Learn hooks and realtime patterns.',
  'upcoming',
  now() + interval '30 minutes'
);
```

Message notification:

```sql
insert into public.messages (sender_id, receiver_id, content, text)
values (
  gen_random_uuid(),
  'USER_ID',
  'Testing message notification',
  'Testing message notification'
);
```

The notification bell should update in realtime for the logged-in receiver.

## Operations

### Authentication Split

The notification dispatch pipeline uses two separate secrets:

- **CRON_SECRET**: Authorises the scheduled `/api/cron/dispatch-notifications` and reminder endpoints. Supply as `Authorization: Bearer <CRON_SECRET>`.
- **WEBHOOK_SECRET**: Authorises the `/api/notifications/send-push` endpoint for server-to-server calls (e.g. from Supabase Edge Functions). Supply as `Authorization: Bearer <WEBHOOK_SECRET>`.

Keep these secrets separate so that a compromised `CRON_SECRET` cannot be used to send arbitrary push notifications to individual users, and vice-versa.

### Queue-Depth Monitoring

Use the following query to check how many notifications are still pending delivery:

```sql
SELECT COUNT(*) AS pending
FROM notifications
WHERE push_sent_at IS NULL
  AND push_claimed_at IS NULL;
```

High queue depth may indicate that the `dispatch-push-notifications` cron function is not running or is erroring. Check Supabase Function logs and confirm the cron schedule is active.

### Batch Cap

The dispatcher atomically claims and processes up to **100** rows per invocation. If the queue consistently exceeds 100 pending rows, consider increasing the invocation frequency or raising the cap (update the `.limit(100)` call in `cronController.js`).

### 60-Second Cooldown

The cron schedule fires every minute. Allow at least a **60-second** cooldown between manual invocations to avoid overlapping with the scheduled run and potentially double-counting metrics.

### Manual Drain

To perform a **manual drain** of the notification queue (e.g. after an outage):

1. Verify the cron job is paused or will not fire concurrently.
2. Call the dispatch endpoint directly with the `CRON_SECRET`:

```bash
curl -X POST https://<your-backend>/api/cron/dispatch-notifications \
  -H "Authorization: Bearer <CRON_SECRET>"
```

3. Repeat until the response shows `"processed": 0`.
4. Re-enable the cron schedule.

### Subscription Expiry (410 / 404)

When `web-push` receives a `410 Gone` or `404 Not Found` response from a push service, it means the push subscription is no longer valid and should be removed from the database.

Handle these codes by deleting the expired subscription row from `push_subscriptions`:

- **410**: The subscription has been permanently cancelled by the user. Remove the record immediately.
- **404**: The endpoint was not found. Remove the record to prevent further failed attempts.

If you see a high rate of **410** or **404** errors in the push dispatch logs, users may have revoked browser notification permission. This is normal and the dead subscriptions will be pruned automatically once the expiry handler is implemented.
