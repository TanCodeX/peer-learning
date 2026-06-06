[Environment]::SetEnvironmentVariable("GITHUB_TOKEN", $null, "Process")
gh auth setup-git

# Ensure we're on a clean slate
git checkout main
git pull origin main

# Stash current changes (both notificationController.js and matchController.js)
git stash

# Issue 696: Notification Controller IDOR
git checkout main
git checkout -b fix-696-notification-idor
git stash apply
git checkout -- backend/controllers/matchController.js # Revert matchController on this branch
git add backend/controllers/notificationController.js
git commit -m "Fix IDOR in Push Notifications (#696)"
git push origin fix-696-notification-idor
gh pr create --head 'riddhima25bet10005-a11y:fix-696-notification-idor' --title 'Fix: IDOR in Push Notifications (#696)' --body 'This PR resolves issue #696 by ensuring that the push notification is only dispatched if `req.user.id` matches the target `user_id`, preventing unauthorized users from spoofing push messages. Administrators bypass this restriction.' --repo 'durdana3105/peer-learning'

# Issue 697: Match Controller PII Leak
git checkout main
git checkout -b fix-697-pii-leak
git stash apply
git checkout -- backend/controllers/notificationController.js # Revert notificationController on this branch
git add backend/controllers/matchController.js
git commit -m "Fix Mass PII Leak in Peer Discovery (#697)"
git push origin fix-697-pii-leak
gh pr create --head 'riddhima25bet10005-a11y:fix-697-pii-leak' --title 'Fix: Mass PII Leak in Peer Discovery (#697)' --body 'This PR resolves issue #697 by replacing the highly permissive `select("*")` query with an explicit list of necessary public fields required by the frontend application. This ensures that sensitive information, such as emails stored in the profiles table, are not leaked to authenticated users during peer searches.' --repo 'durdana3105/peer-learning'

# Clean up
git checkout main
git stash drop
