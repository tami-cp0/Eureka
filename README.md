# Eureka
Greek Vocabulary: Εὕρηκα (Heurēka)
Meaning: "I have found it!" or "I have discovered it."


# Project Management API

This API provides endpoints for managing tasks and projects within a project management system. Below are the details for each operation you can perform.

## Base URL

https://shadow-devs-project-backend.vercel.app/api

## Endpoints

### 1. Get Tasks

**Method**: `GET`  
**Path**: `/tasks/get?project_id=[PROJECT-ID]`

**Description**: Retrieve tasks based on the provided project ID.

**Request Parameters**:

- **Compulsory**:
  - `project_id` (string): The unique identifier of the project for which tasks are to be retrieved.

### 2. Create Task

**Method**: `POST`  
**Path**: `/tasks/create?title=[TITLE]&due_date=[DUE-DATE]&project_id=[PROJECT-ID]`

**Description**: Create a new task within a project.

**Request Parameters**:

- **Compulsory**:
  - `title` (string): The title of the task.
  - `due_date` (string): The due date of the task, represented as a millisecond string obtained by converting the value of a `datetime-local` input with `new Date(datetime input value as a string).getTime().toString()`.
  - `project_id` (string): The unique identifier of the project to which the task belongs.
- **Optional**:
  - `description` (string): A brief description of the task.

### 3. Update Task

**Method**: `PUT`  
**Path**: `/tasks/update?title=[TITLE]&due_date=[DUE-DATE]&project_id=[PROJECT-ID]&status=[STATUS]&task_id=[TASK-ID]`

**Description**: Update an existing task's details.

**Request Parameters**:

- **Compulsory**:
  - `title` (string): The updated title of the task.
  - `due_date` (string): The updated due date of the task, represented as a millisecond string obtained by converting the value of a `datetime-local` input with `new Date(datetime input value as a string).getTime().toString()`.
  - `project_id` (string): The unique identifier of the project to which the task belongs.
  - `status` (string): The status of the task. It should be either "Completed" or "Not completed".
  - `task_id` (string): The unique identifier of the task to be updated.
- **Optional**:
  - `description` (string): The updated description of the task.

### 4. Delete Task

**Method**: `DELETE`  
**Path**: `/tasks/delete?project_id=[PROJECT-ID]&task_id=[TASK-ID]`

**Description**: Delete an existing task from a project.

**Request Parameters**:

- **Compulsory**:
  - `project_id` (string): The unique identifier of the project to which the task belongs.
  - `task_id` (string): The unique identifier of the task to be deleted.

### 5. Create Project

**Method**: `POST`  
**Path**: `/projects/create?title=[TITLE]&owner_uid=[OWNER-UID]`

**Description**: Create a new project.

**Request Parameters**:

- **Compulsory**:
  - `title` (string): The title of the project.
  - `owner_uid` (string): The unique identifier of the project owner. This can be obtained by finding the current user from Firebase using `getAuth().currentUser.uid`. The `getAuth` function should be imported from `firebase/auth`.
- **Optional**:
  - `description` (string): A brief description of the project.

### 6. Update Project

**Method**: `PUT`  
**Path**: `/projects/update?title=[TITLE]&project_id=[PROJECT-ID]`

**Description**: Update an existing project's details.

**Request Parameters**:

- **Compulsory**:
  - `title` (string): The updated title of the project.
  - `project_id` (string): The unique identifier of the project to be updated.
- **Optional**:
  - `description` (string): The updated description of the project.

### 7. Get Projects

**Method**: `GET`  
**Path**: `/projects/get?owner_uid=[OWNER-UID]`

**Description**: Retrieve projects based on the provided owner UID.

**Request Parameters**:

- **Compulsory**:
  - `owner_uid` (string): The unique identifier of the project owner. This can be obtained by finding the current user from Firebase using `getAuth().currentUser.uid`. The `getAuth` function should be imported from `firebase/auth`.

### 8. Delete Project

**Method**: `DELETE`  
**Path**: `/projects/delete?project_id=[PROJECT-ID]`

**Description**: Delete an existing project.

**Request Parameters**:

- **Compulsory**:
  - `project_id` (string): The unique identifier of the project to be deleted.

## Notes

- All date-related fields (`due_date`) should be passed as millisecond strings. Convert the value from a `datetime-local` input using:

  ```javascript
    new Date(datetime input value as a string).getTime().toString()

  ```

- Ensure that the `status` for tasks is either `Completed` or `Not completed` when updating a task.
- Wherever `owner_uid` is required, it can be obtained by finding the current user from Firebase using:
  ```javascript
  getAuth().currentUser.uid;
  ```
  The `getAuth` function should be imported from `firebase/auth`.
README.md
Displaying README.md.
