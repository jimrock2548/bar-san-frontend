#!/usr/bin/env python3
"""
Run script for BarSan Flask Backend
"""
import os
from app import app, create_tables, seed_data

if __name__ == '__main__':
    # Create tables and seed data on first run
    create_tables()
    seed_data()
    
    # Run the Flask application
    debug_mode = os.getenv('FLASK_ENV') == 'development'
    port = int(os.getenv('PORT', 5000))
    
    print(f"🚀 BarSan Flask API starting on port {port}")
    print(f"📊 Database: {os.getenv('DATABASE_URL', 'sqlite:///barsan.db')}")
    print(f"🌐 Frontend URL: {os.getenv('FRONTEND_URL', 'http://localhost:3000')}")
    
    app.run(
        debug=debug_mode,
        host='0.0.0.0',
        port=port
    )
