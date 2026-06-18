const $=id=>document.getElementById(id);
const T=[
['Undo the last commit, keep the changes','git reset --soft HEAD~1','Removes the last commit but leaves all its changes staged, ready to re-commit.'],
['Undo the last commit AND discard changes','git reset --hard HEAD~1','Removes the last commit and throws away its changes. This cannot be undone, so use with care.'],
['Change the last commit message','git commit --amend -m "new message"','Rewrites the most recent commit message. Avoid on commits you have already pushed and shared.'],
['Unstage a file','git restore --staged <file>','Takes a file out of the staging area but keeps your edits in the working tree.'],
['Discard local changes to a file','git restore <file>','Reverts a file to the last committed version. The local changes are lost.'],
['Create and switch to a new branch','git switch -c <branch>','Creates a branch from the current commit and checks it out in one step.'],
['Switch to an existing branch','git switch <branch>','Moves to another branch (modern alternative to git checkout).'],
['Delete a local branch','git branch -d <branch>','Deletes a merged branch. Use -D to force-delete an unmerged one.'],
['Rename the current branch','git branch -m <new-name>','Renames the branch you are currently on.'],
['Stash uncommitted changes','git stash','Saves your uncommitted work and gives you a clean working tree.'],
['Re-apply stashed changes','git stash pop','Restores the most recently stashed changes and removes them from the stash.'],
['Abort an in-progress merge','git merge --abort','Cancels a merge with conflicts and returns to the state before it started.'],
['Stop tracking a file (keep it on disk)','git rm --cached <file>','Untracks a file, e.g. after adding it to .gitignore, without deleting it.'],
['Safely undo a pushed commit','git revert <commit>','Creates a new commit that reverses an old one. Safe for shared history.'],
['Force-push without overwriting others','git push --force-with-lease','Force-pushes only if no one else has pushed in the meantime. Safer than --force.'],
['See what changed in the last commit','git show --stat HEAD','Lists the files and line counts changed by the most recent commit.']
];
function render(){var i=parseInt($('task').value)||0;var t=T[i];$('out').innerHTML='<div style="font-size:17px;color:#fff;">'+t[1].replace(/</g,'&lt;')+'</div><div style="color:#888;font-size:13px;margin-top:10px;font-family:system-ui;">'+t[2]+'</div>';}
$('task').innerHTML=T.map(function(t,i){return '<option value="'+i+'">'+t[0]+'</option>';}).join('');
$('task').addEventListener('change',render);
$('copy').addEventListener('click',function(){navigator.clipboard.writeText(T[parseInt($('task').value)||0][1]);});
render();