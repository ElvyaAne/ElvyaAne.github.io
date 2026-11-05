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
  "term": "Year 2 - Winter",
  "grade": "A",
  "blurb": "Vectors, matrices, and why everything is secretly a linear map.",
  "comments": [],
  "documents": []
}
```

- `id` is the course's web address: this one lives at `notes/course.html?c=mat1341`. Lowercase, no spaces, and don't change it once people have the link.
- `term` is the year of study and the term, like `"Year 1 - Fall"`, `"Year 1 - Winter"` or `"Year 2 - Summer"`. The course list shows one section per term, oldest first. Courses without a term go in "More courses" at the end. Within a term, courses show in the order they're listed.
- `grade` (optional) is your final grade, like `"A+"`. It shows as a small badge in the top corner of the course box. Leave it out for a course that isn't finished.

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

## After changing notes.js or notes.css

Bump the `?v=` number on `notes.js` and `notes.css` in `notes/index.html` and `notes/course.html`, so browsers fetch the new version instead of a cached one.
