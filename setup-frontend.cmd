@echo off
cd /d "%~dp0frontend"
call npm install
if not exist .env copy .env.example .env
pause

