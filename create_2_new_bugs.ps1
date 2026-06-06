$env:GITHUB_TOKEN = ""

$issues = @(
  @{
    Title = "Insecure Direct Object Reference (IDOR) in Push Notification Sending (/api/notifications/send-push)"
    Body = "The `/send-push` endpoint falls back to standard user authentication but blindly trusts the `user_id` provided in the request body. It does not verify whether `req.body.user_id` matches the authenticated `req.user.id`. As a result, any authenticated user can send arbitrary push notifications (phishing, spam, or inappropriate content) to any other user's devices."
  },
  @{
    Title = "PostgREST Filter Injection via Search Parameter in Discover API (/api/match/discover)"
    Body = "The `getSupabaseDiscover` controller manually concatenates the `search` query parameter into a Supabase `.or()` filter string. While it escapes double quotes, it fails to sanitize PostgREST syntax characters such as `,`, `(`, `)`, and `.`. An attacker can inject arbitrary PostgREST operators to bypass intended access controls, extract hidden fields, or cause Denial of Service via expensive nested queries."
  }
)

foreach ($issue in $issues) {
  $title = $issue.Title
  $body = $issue.Body
  gh issue create --repo "durdana3105/peer-learning" --title $title --body $body
  Start-Sleep -Seconds 2
}
