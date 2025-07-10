@echo off
cd C:\python\mynodeproject
set dt=%DATE:~6,4%-%DATE:~3,2%-%DATE:~0,2%
mysqldump -u pbl408 -pgpuasamu mylab > backup_mylab%dt%.sql
