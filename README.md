# Joplin Plugin - Save Note as MD and Commit to Git Repository

# Description
This is a simple plugin is based on the Save Note as MdD(https://joplinapp.org/plugins/plugin/com.joshthor.export/)

and i fixed export note to md lost images . 

also add a new feature that auto execute git commit to git repository in the export folder. 
 
## Installation

1. Download the latest release
2. In Joplin go to Settings > Plugins > Install plugin from file
3. Upload the io.sagaii.export2git.jpl file
4. Restart Joplin

## Usage
hat allows for quick and easy export of the current note as a .md file in the folder of your choosing. It was originally made to provide a way to export single notes as .md files, as I believed there was no way in the tool to do so. You can do that without any plugins through the notes window, right click, and export. However, this plugin remains as it speeds up the workflow and removes unnessesary clicks for some users.
This plugin adds a small file export button to the toolbar in the editing window. 
After your export path is set, simply click that to save your file. Optional confirmation window can be enabled in the settings to provide visual confirmation that your file is saved, if you prefer.
Once your path is set, all you have to do is click a single button in your toolbar, and the file will export to the path you selected without any additional clicks. 


1. Go to Settings > File Export Settings
2. Set the folder where you want the .md files to be saved
3. Navigate to the note you want to export
4. Click the "Export as MD" button in the toolbar
5. The note will be saved as a .md file in the folder you specified

## Updates

### 1.0.3
- Added a "Git Commit" option to the settings. Off by default. Enabling will commit the file to the git repository in the export folder.
- Export Image to MD subfolder 

### 1.0.2
- Added a "Swap spaces for dashes" option to the settings. Off by default. Enabling will replace spaces in the file name with dashes. This is useful if you want to use the file name in a URL or do a lot of terminal work.
- Swapped slashes for dashes in the file name to prevent unnecessary folder creation.
### 1.0.1
- Added a "Show confirmation dialog" option to the settings. Off by default. Enabling makes a popup on save to give the user feedback. Can be disabled cause its annoying.
- Added a popup when the save icon is clicked if the path is not set to prevent user confusion.
