cd /d D:\Repos\JoplinExport2GitRepos
call npm run dist
copy  D:\Repos\JoplinExport2GitRepos\publish\*.*  C:\Users\sagaii\.config\joplin-desktop\plugins\*.*
 
  
:: Check if Joplin.exe is running
tasklist /FI "IMAGENAME eq Joplin.exe" 2>NUL | find /I /N "Joplin.exe">NUL
if "%ERRORLEVEL%"=="0" (
    :: Kill the Joplin.exe process
    echo Joplin is running. Killing the process...
    taskkill /F /IM Joplin.exe
    timeout /t 2 /nobreak >nul
) else (
    echo Joplin is not running.
)

:: Start Joplin.exe
echo Starting Joplin...
start "" "C:\Users\sagaii\AppData\Local\Programs\Joplin\Joplin.exe"
  
