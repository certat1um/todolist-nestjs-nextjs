# TODO-list fullstack application

## Key features

- **Task management** — create, complete, and delete tasks; each task has a text and a category
- **Undo on action** — completing or deleting a task shows a snackbar with an Undo button that auto-dismisses after a few seconds
- **Category filtering** — filter the task list by category; defaults to showing all
- **5-task limit** — backend enforces a maximum of 5 tasks per category and returns `400` if exceeded
- **UX states** — loading spinner, inline error messages, and an empty state when no tasks exist
- **REST API** — `GET /todos`, `POST /todos`, `PATCH /todos/:id`, `DELETE /todos/:id`, `GET /categories`
- **Tests** — Jest + React Testing Library on the frontend, Jest on the backend
- **Docker Compose** — single command to spin up the backend

## Demo screenshot

<img width="2232" height="1710" alt="image" src="https://github.com/user-attachments/assets/a636a9da-3736-4fcd-9544-09a092c59ace" />
