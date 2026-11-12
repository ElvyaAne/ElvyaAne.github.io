# Adding coding notes

Everything on the Coding notes pages comes from one file: `coding/topics.json`.
Edit it on GitHub (pencil icon), commit, and the site updates in a minute or two.
Every topic already has a card. Until a topic has pages, its card says "pages coming soon" and its page shows a "Still in the notebook" placeholder.

## 1. Upload the pages

Take a photo or scan of each notebook page (JPG or PNG is best, so they show right on the page).
Upload them to `coding/files/<topic id>/` (on GitHub: **Add file → Upload files**, and type the folder path in front of the name), for example:

```
coding/files/git/page-01.jpg
coding/files/git/page-02.jpg
```

## 2. Point the topic at its pages

Find the topic in `coding/topics.json` (ids: `html`, `css`, `javascript`, `ruby-cpp`, `react`, `linux-terminal`, `github-git`, `sql`) and fill in its `"pages"` list. To add a brand new topic, add a block inside `"topics": [ ... ]` (put a comma between blocks):

```json
{
  "id": "git",
  "title": "Git & GitHub",
  "tag": "tools",
  "when": "Summer 2025",
  "blurb": "Branches, commits and how not to lose my work.",
  "thoughts": "Optional: a few lines about learning this.\n\nA blank line starts a new paragraph.",
  "pages": ["files/git/page-01.jpg", "files/git/page-02.jpg"],
  "documents": []
}
```

- `id` is the topic's web address: this one lives at `coding/topic.html?t=git`. Lowercase, no spaces.
- `tag`, `when`, `blurb` and `thoughts` are all optional.
- `"together": true` marks notes that cover two things in one set (like Ruby + C++); the card says "one set of notes".
- The first page becomes the card's cover. To use a different picture, add `"cover": "files/git/page-03.jpg"`.
- A page can carry its own caption: `{ "file": "files/git/page-01.jpg", "caption": "merge vs rebase" }`.
- Topics show in the order they're listed.
- `documents` works like the class notes: `{ "title": "All pages", "file": "files/git/git-notes.pdf", "note": "6 pages" }` for a PDF or a link.
