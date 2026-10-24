# Updating Fun Haus and its games

## Your normal update routine

1. Open GitHub Desktop. Under Current repository, choose fun-haus, the-regulars, or mars-scout.
2. Click Fetch origin. If Pull origin appears, click it before you start editing.
3. Click Show in Explorer and open docs.
4. Save the updated files there.
5. Return to GitHub Desktop and review the changed files.
6. Write a short summary, such as "Update Mars Scout building controls", then click Commit to main.
7. Click Push origin. This publishes the update through GitHub Pages.
8. Wait for the deployment to finish in the repository's Actions page, then reload the live site. A hard refresh can help if an older version is cached.

Commit saves a version on your computer. Push uploads it to GitHub. The website changes after Push and a successful Pages deployment.

If you are only changing a game, choose that game's repository. The museum continues using the same game address; you do not need to republish the museum for every game update.

## Which files to update

| What you want to change | Repository | File or folder |
| --- | --- | --- |
| Museum layout, statues, movement or résumé | fun-haus | docs/index.html |
| Statue launch cards and game return bar | fun-haus | docs/museum-games.js |
| Game addresses shown in the museum | fun-haus | docs/apps.json |
| Separate project-list page | fun-haus | docs/projects.html |
| Complete convention research site | fun-haus | docs/research/ |
| PRGE documentary in the original lab | fun-haus | Embedded in docs/index.html |
| The Regulars game | the-regulars | docs/index.html |
| Regulars character models | the-regulars | docs/models/ |
| Mars Scout game | mars-scout | docs/index.html |

When Gemini gives you an updated Mars Scout HTML export, save it as docs/index.html inside the connected mars-scout repository. When Claude gives you a new Regulars export, replace docs/index.html and include any updated supporting model files in docs/models. Keep the relative file names and paths used by the game.

The old Downloads and OneDrive source folders are separate copies. Saving there does not update GitHub Desktop's connected repository. Use Show in Explorer to locate the right working folder.

The current museum still has its PRGE documentary and résumé embedded in index.html as well as separate copies. Changing the separate PRGE file updates the statue launcher; the original lab screen still uses the embedded copy. Ask for both copies to be synchronized when changing that documentary or résumé.

## How the statues work

Left: The Regulars. Middle: Mars Scout. Right: Beyond the Building convention research.

Aim at a statue and click, or move near it and press E. Choose Play in the preview. The game opens inside the museum with a permanent navigation bar. Press Esc to release the mouse, then choose Museum menu or Return to statue. The museum keeps your position because it stays open behind the game. Return unloads the game, so unsaved game progress is not retained.

Games menu also opens the same exhibits without walking. Visit the statues moves your museum starting point to the Display Hall. If the embedded game cannot capture the mouse, Open in new tab launches its direct site and leaves the museum open in its original tab.

## Live addresses

- Museum: https://alfred909.github.io/fun-haus/
- The Regulars: https://alfred909.github.io/the-regulars/
- Mars Scout: https://alfred909.github.io/mars-scout/

## Next website step

Do a visitor walkthrough in a normal desktop browser: enter the museum, find each statue, play, and return. Check mouse capture, movement, sound, loading and the return buttons in Chrome and Edge.

Then prepare the portfolio for employers: review the résumé, add a concise project description and your contribution for each exhibit, replace the abstract statue placeholders with recognizable project artwork, and provide an easy browse option for visitors on phones. A custom domain can follow once the content and navigation are settled.

