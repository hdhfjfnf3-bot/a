@echo off
echo ========================================
echo   Nova Store - API Server (port 3001)
echo ========================================

set SUPABASE_URL=https://lopqvaepgpzemswxiqzr.supabase.co
set SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxvcHF2YWVwZ3B6ZW1zd3hpcXpyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzUzNzQ1NiwiZXhwIjoyMDg5MTEzNDU2fQ.kwEeEVnaJFUmiGZpqjLddZLE6TOnlNwd_RPBhQ2md_Y
set SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxvcHF2YWVwZ3B6ZW1zd3hpcXpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1Mzc0NTYsImV4cCI6MjA4OTExMzQ1Nn0.yexOMO1kSQwDtTXBVxY8MlS14q6RYJxC6CD90C3TzUY
set PORT=3001
set SESSION_SECRET=nova-secret-key-2024

echo API Server starting on http://localhost:3001 ...
pnpm --filter @workspace/api-server run dev
