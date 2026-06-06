[Environment]::SetEnvironmentVariable("GITHUB_TOKEN", $null, "Process")
gh auth setup-git

# Push and PR for 687
git push origin fix-687-jwt-algo
gh pr create --title "Fix: JWT Algorithm Confusion in requireAuth.js (#687)" --body "This PR resolves issue #687 by verifying that the JWT header algorithm is strictly HS256 to prevent public-key algorithm confusion attacks. It also ensures that the secret does not have a PEM header." --repo "durdana3105/peer-learning"

# Switch to 688
git stash
git checkout main
git checkout -b fix-688-sql-injection
git stash pop
git add backend/controllers/matchController.js
git commit -m "Fix SQL injection in Supabase Peer Discovery (#688)"
git push origin fix-688-sql-injection
gh pr create --title "Fix: SQL Injection in Supabase Peer Discovery (#688)" --body "This PR resolves issue #688 by stripping out special PostgREST characters (such as commas and parentheses) from the search input before it is interpolated into the `.or()` filter string. This completely prevents attackers from bypassing the double-quote escaping to inject arbitrary SQL logic." --repo "durdana3105/peer-learning"
