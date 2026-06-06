[Environment]::SetEnvironmentVariable("GITHUB_TOKEN", $null, "Process")
gh issue create --title "CRITICAL: IDOR in Push Notifications allows arbitrary push messages to any user" --body-file bug1.txt --repo "durdana3105/peer-learning"
gh issue create --title "CRITICAL: Mass PII Leak (Email addresses) in Peer Discovery via over-fetching" --body-file bug2.txt --repo "durdana3105/peer-learning"
