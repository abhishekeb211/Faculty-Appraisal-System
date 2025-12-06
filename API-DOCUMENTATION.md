# API Documentation

Complete API endpoint reference for the Faculty Appraisal System frontend application.

## 📋 Table of Contents

- [Base Configuration](#base-configuration)
- [Authentication Endpoints](#authentication-endpoints)
- [User Management Endpoints](#user-management-endpoints)
- [Form Submission Endpoints](#form-submission-endpoints)
- [Status and Workflow Endpoints](#status-and-workflow-endpoints)
- [Verification Endpoints](#verification-endpoints)
- [Evaluation Endpoints](#evaluation-endpoints)
- [External Evaluator Endpoints](#external-evaluator-endpoints)
- [Department Management Endpoints](#department-management-endpoints)
- [Error Handling](#error-handling)

## Base Configuration

### Environment Variable

All API calls use the base URL from environment variable:

```javascript
const BASE_URL = import.meta.env.VITE_BASE_URL;
// Example: http://localhost:5000 or https://api.yourdomain.com
```

### Request Headers

All POST/PUT requests should include:

```javascript
headers: {
  'Content-Type': 'application/json',
}
```

### Response Format

Successful responses typically return JSON:

```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

Error responses:

```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

## Authentication Endpoints

### POST /login

User authentication endpoint.

**Request Body:**
```json
{
  "_id": "user123",
  "password": "userpassword"
}
```

**Response (Success):**
```json
{
  "_id": "user123",
  "name": "John Doe",
  "email": "john.doe@example.com",
  "role": "faculty",
  "dept": "Computer Science",
  "desg": "Professor",
  "department": "CS"
}
```

**Response (Error):**
```json
{
  "error": "Invalid credentials"
}
```

**Usage Example:**
```javascript
const response = await fetch(`${VITE_BASE_URL}/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ _id: userId, password: password })
});
```

---

### POST /send-otp

Send OTP for password reset.

**Request Body:**
```json
{
  "user_id": "user123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP sent successfully"
}
```

---

### POST /verify-otp

Verify OTP for password reset.

**Request Body:**
```json
{
  "user_id": "user123",
  "otp": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "token": "reset_token_here",
  "message": "OTP verified"
}
```

---

### POST /reset-user-password

Reset user password after OTP verification.

**Request Body:**
```json
{
  "user_id": "user123",
  "token": "reset_token_here",
  "new_password": "newpassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

---

### POST /forgot-password

Request password reset (alternative endpoint).

**Request Body:**
```json
{
  "user_id": "user123"
}
```

---

### POST /update-profile

Update user profile information.

**Request Body:**
```json
{
  "_id": "user123",
  "name": "Updated Name",
  "email": "updated@example.com"
}
```

## User Management Endpoints

### GET /users

Get all users in the system.

**Response:**
```json
[
  {
    "_id": "user123",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "faculty",
    "dept": "Computer Science",
    "desg": "Professor"
  },
  ...
]
```

---

### GET /users/:id

Get specific user by ID.

**Response:**
```json
{
  "_id": "user123",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "faculty",
  "dept": "Computer Science",
  "desg": "Professor"
}
```

---

### POST /users

Create a new user.

**Request Body:**
```json
{
  "_id": "newuser123",
  "name": "Jane Smith",
  "email": "jane@example.com",
  "password": "password123",
  "role": "faculty",
  "dept": "Mathematics",
  "desg": "Assistant Professor"
}
```

---

### PUT /users/:id

Update an existing user.

**Request Body:**
```json
{
  "name": "Updated Name",
  "email": "updated@example.com"
}
```

---

### DELETE /users/:id

Delete a user.

**Response:**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

---

### GET /all-faculties

Get all faculty members.

**Response:**
```json
[
  {
    "_id": "faculty123",
    "name": "John Doe",
    "dept": "Computer Science",
    "desg": "Professor"
  },
  ...
]
```

---

### GET /faculty/:department

Get all faculty members in a specific department.

**Example:** `GET /faculty/Computer%20Science`

**Response:**
```json
[
  {
    "_id": "faculty123",
    "name": "John Doe",
    "dept": "Computer Science",
    "desg": "Professor"
  },
  ...
]
```

## Form Submission Endpoints

All form endpoints follow the pattern: `/{department}/{userId}/{formPart}`

Where:
- `department`: Department name (e.g., "Computer Science")
- `userId`: User ID
- `formPart`: Form part identifier (A, B, C, D, or E)

### GET /{department}/{userId}/A

Get Part A (Teaching Performance) data.

**Response:**
```json
{
  "1": {
    "courses": { ... },
    "marks": 50
  },
  "2": {
    "courses": { ... },
    "marks": 30
  },
  "4": { ... },
  "7": { ... },
  "total_marks": 100
}
```

---

### POST /{department}/{userId}/A

Submit Part A (Teaching Performance) data.

**Request Body:**
```json
{
  "1": {
    "courses": {
      "CS101": {
        "semester": "Sem I",
        "result": 85,
        "co": { ... },
        "academic": { ... },
        "feedback": { ... }
      }
    },
    "marks": 50
  },
  "2": { ... },
  "4": { ... },
  "7": { ... },
  "total_marks": 100
}
```

---

### GET /{department}/{userId}/B

Get Part B (Research and Development) data.

**Response:**
```json
{
  "1": {
    "papers": [ ... ],
    "marks": 40
  },
  "2": {
    "conferences": [ ... ],
    "marks": 30
  },
  ...
  "total_marks": 100
}
```

---

### POST /{department}/{userId}/B

Submit Part B (Research and Development) data.

**Request Body:**
```json
{
  "1": {
    "papers": [
      {
        "title": "Research Paper Title",
        "journal": "Journal Name",
        "year": 2024,
        "impact": 5.2
      }
    ],
    "marks": 40
  },
  ...
  "total_marks": 100
}
```

---

### GET /{department}/{userId}/C

Get Part C (Self Development) data.

---

### POST /{department}/{userId}/C

Submit Part C (Self Development) data.

---

### GET /{department}/{userId}/D

Get Part D (Portfolio) data.

---

### POST /{department}/{userId}/D

Submit Part D (Portfolio) data.

---

### GET /{department}/{userId}/E

Get Part E (Extra-ordinary Contribution) data.

---

### POST /{department}/{userId}/E

Submit Part E (Extra-ordinary Contribution) data.

## Status and Workflow Endpoints

### GET /{department}/{userId}/get-status

Get form submission status for a user.

**Response:**
```json
{
  "partA": {
    "submitted": true,
    "verified": true,
    "status": "approved"
  },
  "partB": {
    "submitted": true,
    "verified": false,
    "status": "pending"
  },
  "partC": { ... },
  "partD": { ... },
  "partE": { ... },
  "overall": "in_progress"
}
```

---

### POST /{department}/{userId}/submit-form

Final form submission after all parts are completed.

**Request Body:**
```json
{
  "final_submission": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Form submitted successfully",
  "status": "submitted"
}
```

---

### GET /{department}/{userId}/generate-doc

Generate PDF document for completed appraisal.

**Response:**
- Returns PDF file as blob
- Content-Type: `application/pdf`

**Usage Example:**
```javascript
const response = await fetch(`${VITE_BASE_URL}/${dept}/${userId}/generate-doc`);
const blob = await response.blob();
const url = window.URL.createObjectURL(blob);
window.open(url);
```

---

### GET /{department}/all_faculties_final_marks

Get final marks for all faculty in a department.

**Response:**
```json
[
  {
    "_id": "faculty123",
    "name": "John Doe",
    "partA_marks": 50,
    "partB_marks": 40,
    "partC_marks": 30,
    "partD_marks": 20,
    "partE_marks": 10,
    "total_marks": 150
  },
  ...
]
```

---

### POST /{department}/send-to-director

Send department faculty marks to director for final review.

**Request Body:**
```json
{
  "faculty_ids": ["faculty123", "faculty456"]
}
```

---

### GET /{department}/{userId}/total

Get total marks for a specific faculty member.

**Response:**
```json
{
  "_id": "faculty123",
  "name": "John Doe",
  "partA_marks": 50,
  "partB_marks": 40,
  "partC_marks": 30,
  "partD_marks": 20,
  "partE_marks": 10,
  "total_marks": 150,
  "status": "approved"
}
```

## Verification Endpoints

### GET /faculty_to_verify/:verifierId

Get list of faculty assigned to a verifier for verification.

**Response:**
```json
[
  {
    "_id": "faculty123",
    "name": "John Doe",
    "dept": "Computer Science",
    "forms_to_verify": ["B"],
    "status": "pending"
  },
  ...
]
```

---

### POST /{department}/{facultyId}/B

Submit verification for Part B (Research) data.

**Request Body:**
```json
{
  "verified": true,
  "verifier_id": "verifier123",
  "comments": "Verified all research papers",
  "marks": 40
}
```

---

### POST /{department}/{userId}/{verifierId}/verify-research

Verify research data for a specific faculty member.

**Request Body:**
```json
{
  "verified": true,
  "comments": "All research papers verified",
  "marks_awarded": 40
}
```

---

### GET /{department}/verification-committee

Get verification committee members for a department.

**Response:**
```json
[
  {
    "_id": "verifier123",
    "name": "Verifier Name",
    "role": "verification_team"
  },
  ...
]
```

---

### POST /{department}/verification-committee/addfaculties

Add faculty members to verification committee.

**Request Body:**
```json
{
  "faculty_ids": ["faculty123", "faculty456"]
}
```

---

### POST /{department}/{facultyId}/verify-authority

Verify authority approval for a faculty member.

**Request Body:**
```json
{
  "verified": true,
  "authority_id": "authority123",
  "comments": "Approved"
}
```

## Evaluation Endpoints

### POST /{department}/hod_interaction_marks/:externalId/:facultyId

Submit HOD interaction marks for a faculty member.

**Request Body:**
```json
{
  "marks": 25,
  "comments": "Excellent interaction",
  "external_id": "external123"
}
```

---

### GET /external_interaction_marks/:externalId

Get external interaction marks for an external evaluator.

**Response:**
```json
{
  "data": {
    "faculty123": {
      "marks": 25,
      "comments": "Good performance"
    },
    ...
  }
}
```

---

### GET /total_marks/:department/:facultyId

Get total marks for a faculty member including all evaluations.

**Response:**
```json
{
  "partA": 50,
  "partB": 40,
  "partC": 30,
  "partD": 20,
  "partE": 10,
  "hod_marks": 25,
  "dean_marks": 20,
  "external_marks": 25,
  "total": 220
}
```

---

### POST /{department}/{facultyId}/hod-mark-given

Mark that HOD has given marks.

**Request Body:**
```json
{
  "hod_mark_given": true
}
```

---

### POST /{department}/{facultyId}/portfolio-given

Mark that portfolio marks have been given.

**Request Body:**
```json
{
  "portfolio_given": true
}
```

---

### POST /{department}/external_interaction_marks/:externalId/:facultyId

Submit external evaluator interaction marks.

**Request Body:**
```json
{
  "marks": 25,
  "comments": "Excellent performance"
}
```

## External Evaluator Endpoints

### GET /{department}/external-assignments/:externalId

Get faculty assignments for an external evaluator.

**Response:**
```json
[
  {
    "_id": "faculty123",
    "name": "John Doe",
    "dept": "Computer Science",
    "status": "assigned",
    "evaluation_status": "pending"
  },
  ...
]
```

---

### GET /{department}/get-externals

Get all external evaluators for a department.

**Response:**
```json
[
  {
    "_id": "external123",
    "name": "External Evaluator",
    "email": "external@example.com",
    "department": "Computer Science"
  },
  ...
]
```

---

### POST /{department}/assign-externals

Assign external evaluators to faculty members.

**Request Body:**
```json
{
  "assignments": [
    {
      "external_id": "external123",
      "faculty_id": "faculty123"
    },
    ...
  ]
}
```

---

### POST /{department}/create-external

Create a new external evaluator.

**Request Body:**
```json
{
  "_id": "external123",
  "name": "External Evaluator",
  "email": "external@example.com",
  "department": "Computer Science"
}
```

---

### GET /{department}/external-dean-assignments

Get external-dean assignment mappings.

**Response:**
```json
[
  {
    "external_id": "external123",
    "dean_id": "dean123",
    "department": "Computer Science"
  },
  ...
]
```

---

### GET /{department}/dean-external-mappings

Get dean-external mapping relationships.

---

### POST /{department}/dean-external-assignment/:externalId/:deanId

Assign a dean to an external evaluator.

**Request Body:**
```json
{
  "assigned": true
}
```

---

### POST /{department}/remove-dean-from-external

Remove dean assignment from external evaluator.

**Request Body:**
```json
{
  "external_id": "external123",
  "dean_id": "dean123"
}
```

## Department Management Endpoints

### GET /{department}/interaction-deans

Get interaction deans for a department.

**Response:**
```json
[
  {
    "_id": "dean123",
    "name": "Dean Name",
    "department": "Computer Science",
    "role": "dean"
  },
  ...
]
```

---

### GET /faculty/:department

Get faculty by department (alternative endpoint).

## Error Handling

### Common HTTP Status Codes

| Status Code | Meaning | Action |
|------------|---------|--------|
| 200 | Success | Process response data |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Check request body format |
| 401 | Unauthorized | User not authenticated |
| 403 | Forbidden | User lacks permissions |
| 404 | Not Found | Resource doesn't exist |
| 500 | Server Error | Backend server issue |

### Error Response Format

```json
{
  "success": false,
  "error": "Error message description",
  "code": "ERROR_CODE",
  "details": { ... }
}
```

### Error Handling Example

```javascript
try {
  const response = await fetch(`${VITE_BASE_URL}/endpoint`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Request failed');
  }

  const result = await response.json();
  return result;
} catch (error) {
  console.error('API Error:', error);
  toast.error(error.message);
  throw error;
}
```

## Rate Limiting

The API may implement rate limiting. If you encounter `429 Too Many Requests`:

- Wait before retrying
- Implement exponential backoff
- Reduce request frequency

## CORS Configuration

Ensure the backend API has CORS configured to allow requests from your frontend domain:

```
Access-Control-Allow-Origin: http://localhost:5173
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

## Notes

1. **Department Names**: Department names in URLs should be URL-encoded (e.g., "Computer Science" → "Computer%20Science")

2. **User IDs**: User IDs are typically MongoDB ObjectIds or custom identifiers

3. **Form Parts**: Form parts are single letters: A, B, C, D, E

4. **Authentication**: Most endpoints require user authentication (handled via localStorage userData)

5. **Base URL**: Always use `import.meta.env.VITE_BASE_URL` in frontend code

---

For architecture details, see [SYSTEM-ARCHITECTURE.md](./SYSTEM-ARCHITECTURE.md).  
For deployment information, see [DEPLOYMENT.md](./DEPLOYMENT.md).

