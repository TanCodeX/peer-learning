[Environment]::SetEnvironmentVariable("GITHUB_TOKEN", $null, "Process")

$bug1Title = "CRITICAL: IDOR in Push Notifications allows arbitrary push messages to any user"
$bug1Body = @"
**Description**
The `sendPushNotification` endpoint in `backend/controllers/notificationController.js` suffers from Insecure Direct Object Reference (IDOR). While the route is authenticated using `requireAuth`, the backend blindly accepts the `user_id` from the `req.body` payload rather than enforcing it to be the currently authenticated user (`req.user.id`).

Because of this, any authenticated user can send an arbitrary push notification (which could contain phishing links or abusive content) to **any other user** in the system just by specifying their `user_id` in the JSON body.

**Impact**
- **Abuse/Spam**: Attackers can spam all users with push notifications.
- **Phishing**: Attackers can send notifications containing malicious URLs (`action_url`) to steal credentials.

**Suggested Fix**
Enforce that the notification can only be sent to the authenticated user's own ID, or require an admin role for sending arbitrary notifications.
```javascript
const targetUserId = req.body.user_id;
if (req.user.id !== targetUserId && !req.roles.includes("admin")) {
  return res.status(403).json({ error: "Forbidden" });
}
```
"@

$bug2Title = "CRITICAL: Mass PII Leak (Email addresses) in Peer Discovery via over-fetching"
$bug2Body = @"
**Description**
The `getSupabaseDiscover` endpoint in `backend/controllers/matchController.js` fetches peer users from the `profiles` table using the Supabase Service Role key (`getSupabaseAdmin()`), which bypasses all Row Level Security (RLS). 

In the query, it uses `select("*")` and returns the full profile objects directly in the API response:
```javascript
let query = supabaseAdmin.from("profiles").select("*").neq("id", userId).limit(100);
// ...
res.status(200).json({ success: true, recommendations: matched.slice(0, limit) });
```
Because the `profiles` table contains the `email` column (and potentially flags like `is_admin`), this endpoint leaks the PII (emails) of up to 100 users per request to any authenticated user.

**Impact**
- Mass harvesting of user email addresses by simply querying the `/api/match/discover` endpoint with different filters or search terms.
- Privacy violation and exposure of internal administration flags.

**Suggested Fix**
Instead of `select("*")`, explicitly select only the public fields required for the frontend to render the peer cards (e.g., `id, name, skills, interests, learning_goals`). Do not select or return the `email` column.
"@

gh issue create --title $bug1Title --body $bug1Body --repo "durdana3105/peer-learning"
gh issue create --title $bug2Title --body $bug2Body --repo "durdana3105/peer-learning"
