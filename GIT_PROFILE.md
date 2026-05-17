# Git Profile Configuration

This project uses a specific Git profile to ensure commits are attributed to the correct account.

## Profile Details
- **Username:** eshainteriors
- **Email:** eshainteriors1@gmail.com

## Configuration
This project has been configured with local git settings (not global). These settings are stored in `.git/config` and will only apply when working in this directory.

### Verify Configuration
To verify the git profile is correctly set for this project, run:
```bash
git config --local user.name
git config --local user.email
```

Both should return:
- `eshainteriors`
- `eshainteriors1@gmail.com`

## Important Notes
- These settings are **local to this project only** and will not affect your other projects
- When you work in this project directory, all commits will automatically use the eshainteriors profile
- If you switch to a different project, that project's git configuration (or your global config) will be used instead

## For Future Reference
If you need to update these settings, use:
```bash
git config user.name "new-name"
git config user.email "new-email@example.com"
```

Or to view all local git settings:
```bash
git config --local --list
```
