export function parseGitDiff(diff: string) {
    const files = [];

    const matches = diff.matchAll(/diff --git a\/(.+?) b\/(.+?)\n/g);

    for (const match of matches) {
        files.push({
            file: match[1],
            status: "modified"
        });
    }

    const additions = (
        diff.match(/^\+(?!\+\+)/gm) || []
    ).length;

    const deletions = (
        diff.match(/^\-(?!\-\-)/gm) || []
    ).length;

    return {
        files_changed: files.length,
        insertions: additions,
        deletions: deletions,
        files
    };
}