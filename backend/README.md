# BarSan Flask Backend

A Flask-based REST API for the BarSan table reservation system using SQLAlchemy and SQLite.

## Features

- **Authentication**: JWT-based authentication for users and admins
- **Reservations**: Complete reservation management system
- **Admin Panel**: Administrative interface for managing reservations and tables
- **Database**: SQLite database with SQLAlchemy ORM
- **CORS**: Cross-origin resource sharing enabled
- **Docker**: Containerized deployment ready

## Quick Start

### Local Development

1. **Clone and setup**:
\`\`\`bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
\`\`\`

2. **Environment setup**:
\`\`\`bash
cp .env.example .env
# Edit .env with your configuration
\`\`\`

3. **Run the application**:
\`\`\`bash
python run.py
\`\`\`

The API will be available at `http://localhost:5000`

### Docker Deployment

1. **Using Docker Compose**:
\`\`\`bash
docker-compose up -d
\`\`\`

2. **Using Docker directly**:
\`\`\`bash
docker build -t barsan-backend .
docker run -p 5000:5000 barsan-backend
\`\`\`

## API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /auth/me` - Get current user
- `POST /auth/logout` - User logout
- `POST /auth/admin/login` - Admin login
- `POST /auth/admin/logout` - Admin logout

### Reservations
- `POST /reservations/temp` - Create temporary reservation
- `POST /reservations` - Create actual reservation
- `GET /reservations/my` - Get user's reservations (requires auth)
- `GET /reservations/<number>` - Get reservation by number
- `DELETE /reservations/<number>` - Cancel reservation

### Cafes
- `GET /cafes` - Get all active cafes
- `GET /cafes/<id>` - Get cafe details
- `GET /cafes/<id>/availability` - Get available time slots
- `GET /cafes/<id>/zones/<zone_id>/tables` - Get zone tables

### Admin
- `GET /admin/dashboard/<cafe_id>` - Get dashboard stats
- `GET /admin/reservations/<cafe_id>` - Get cafe reservations
- `PUT /admin/reservations/<id>` - Update reservation
- `GET /admin/tables/<cafe_id>` - Get cafe tables

## Database Schema

The application uses SQLite with the following main models:

- **User**: Customer accounts
- **Cafe**: Restaurant/cafe information
- **Zone**: Seating areas within cafes
- **Table**: Individual tables
- **Reservation**: Confirmed reservations
- **TemporaryReservation**: 15-minute holds
- **Admin**: Administrative users
- **Role**: Admin roles and permissions

## Configuration

Key environment variables:

\`\`\`env
SECRET_KEY=your-secret-key
JWT_SECRET_KEY=your-jwt-secret
DATABASE_URL=sqlite:///barsan.db
FRONTEND_URL=http://localhost:3000
PORT=5000
\`\`\`

## Default Admin Account

- **Username**: `admin`
- **Password**: `admin123`
- **Email**: `admin@barsan.cafe`

## Development

### Project Structure
\`\`\`
backend/
├── app.py              # Main Flask application
├── models.py           # Database models
├── auth.py             # Authentication routes
├── reservations.py     # Reservation routes
├── cafes.py           # Cafe routes
├── admin.py           # Admin routes
├── utils.py           # Utility functions
├── requirements.txt   # Python dependencies
├── run.py            # Application runner
└── Dockerfile        # Docker configuration
\`\`\`

### Adding New Features

1. **Models**: Add new models to `models.py`
2. **Routes**: Create new blueprint files
3. **Utils**: Add utility functions to `utils.py`
4. **Register**: Import and register blueprints in `app.py`

## Testing

Test the API endpoints:

\`\`\`bash
# Health check
curl http://localhost:5000/health

# Register user
curl -X POST http://localhost:5000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","fullName":"Test User"}'

# Admin login
curl -X POST http://localhost:5000/auth/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
\`\`\`

## Production Deployment

1. **Set environment variables**:
\`\`\`bash
export SECRET_KEY="your-production-secret"
export JWT_SECRET_KEY="your-production-jwt-secret"
export FLASK_ENV="production"
\`\`\`

2. **Use a production WSGI server**:
\`\`\`bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
\`\`\`

3. **Set up reverse proxy** (nginx recommended)

## License

MIT License - see LICENSE file for details.
