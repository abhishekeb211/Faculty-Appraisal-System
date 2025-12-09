# Backend README

## Faculty Appraisal System - Backend API

This is the Flask backend server for the Faculty Appraisal System.

### Setup Instructions

1. **Install Python dependencies:**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Ensure MongoDB is running:**
   ```bash
   # Check if MongoDB is running
   mongosh

   # If not running, start it
   # Windows: net start MongoDB
   # Mac/Linux: sudo systemctl start mongod
   ```

3. **Create test users:**
   ```bash
   python scripts/create_test_users.py
   ```

4. **Start the server:**
   ```bash
   python app.py
   ```

The server will start on `http://127.0.0.1:5000`

### Test Credentials

| Role | User ID | Password |
|------|---------|----------|
| Faculty | faculty_test | Faculty@123 |
| Admin | admin_test | Admin@123 |
| HOD | hod_test | HOD@123 |
| Dean | dean_test | Dean@123 |
| Director | director_test | Director@123 |
| Verification | verify_test | Verify@123 |
| External | external_test | External@123 |

### API Endpoints

See `implementation_plan.md` for complete API documentation.

### Troubleshooting

**MongoDB Connection Error:**
- Ensure MongoDB is running: `mongosh`
- Check connection string in `.env`

**CORS Error:**
- Verify frontend is running on `http://localhost:5173`
- Check CORS configuration in `app.py`

**Import Error:**
- Ensure all dependencies are installed: `pip install -r requirements.txt`
