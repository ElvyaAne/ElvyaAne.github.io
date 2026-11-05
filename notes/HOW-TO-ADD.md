# Adding class notes

Everything on the Class notes pages comes from one file: `notes/courses.json`.
Edit it on GitHub (pencil icon), commit, and the site updates in a minute or two.

## Add a course

Add a block inside `"courses": [ ... ]` (put a comma between blocks):

```json
{
  "id": "mat1341",
  "code": "MAT 1341",
  "name": "Linear Algebra",
  "term": "Winter 2026",
  "blurb": "Vectors, matrices, and why everything is secretly a linear map.",
  "comments": [],
  "documents": []
}
```

- `id` is the course's web address: this one lives at `notes/course.html?c=mat1341`. Lowercase, no spaces, and don't change it once people have the link.
- `term` is the season and year, like `"Fall 2025"`, `"Winter 2026"` or `"Summer 2026"`. The course list groups courses by term, newest first; a course without a year shows under "Term to be added". Within a term, courses show in the order they're listed.

## Add a comment

Add to the course's `"comments"` list:

```json
{ "date": "2026-11-04", "title": "Midterm thoughts", "text": "First paragraph.\n\nSecond paragraph with **bold** and a [link](https://example.com)." }
```

- Newest dates show first. `title` is optional.
- `\n\n` starts a new paragraph. You can use `**bold**`, `*italics*`, `` `code` `` and `[text](url)`.

## Add a document

1. Upload the file to `notes/files/<course id>/` (on GitHub: **Add file → Upload files**, and type the folder path in front of the name).
2. Add to the course's `"documents"` list:

```json
{ "title": "Midterm cheat sheet", "file": "files/mat1341/midterm-cheatsheet.pdf", "note": "One page, front and back." }
```

For something hosted elsewhere (Google Drive, Notion, a repo), use `"url"` instead of `"file"`:

```json
{ "title": "Lecture notes", "url": "https://drive.google.com/...", "note": "Shared folder" }
```

The little tag next to each document (PDF, PNG, LINK…) comes from the file's extension. `note` is optional.

Tip: paste the whole file into https://jsonlint.com before committing if you're unsure about commas.
