rem  set Development plugins:  D:\Repos\JoplinExport2GitRepos\  （project root dir)


rem in vscode  execute package.json command "prepare"


@echo off
set "folder=C:\Users\sagaii\.config\joplin-desktop\tmp"

if exist "%folder%" (
    echo Deleting folder and its contents: %folder%
    rmdir /s /q "%folder%"
    if not exist "%folder%" (
        echo Folder and its contents successfully deleted: %folder%
    ) else (
        echo Failed to delete the folder: %folder%
    )
) else (
    echo Folder does not exist: %folder%
)

@echo on
 

set DEBUG=*

C:\Users\sagaii\AppData\Local\Programs\Joplin\Joplin.exe
 