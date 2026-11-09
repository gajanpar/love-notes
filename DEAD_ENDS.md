# Dead Ends Log

| Iteration | Approach Tried | Why It Failed | Files Touched |
|---|---|---|---|
| Iteration 2 | Ephemeral SSH Reverse Tunnel (`localhost.run`) | Hosting facade: Proxied local `php artisan serve` on Windows instead of deploying to an authentic free cloud hosting platform. Collapsed under sequential traffic with HTTP 502 Bad Gateway and cleartext HTTP downgrade. Forensic Auditor issued INTEGRITY VIOLATION veto. | `bootstrap/app.php` |
