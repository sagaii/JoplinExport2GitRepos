import joplin from 'api'
import {
  SettingItem,
  SettingItemType,
  SettingItemSubType 
} from 'api/types'

export namespace  Settings {
  export async function register () {
  
    //设置菜单
    await joplin.settings.registerSection('fileExport2GitSettings', {
      label: 'File Export2Git Settings',
      iconName: 'fas fa-file-export'
    })

    await joplin.settings.registerSettings({
       
      fileExportPath: {
        value: '',
        type: SettingItemType.String,
        subType: SettingItemSubType.DirectoryPath,
        section: 'fileExport2GitSettings',
        public: true,
        label: 'Local GitRepos Folder Path'
      },
      // add checkbox setting labeled "show export confirmation popup"
      showExportConfirmationPopup: {
        value: false,
        type: SettingItemType.Bool,
        section: 'fileExport2GitSettings',
        public: true,
        label: 'Show export confirmation popup'
      },
      //add a checkbox setting labeled 'swap spaces for dashes in filename"
      swapSpacesForDashes: {
        value: false,
        type: SettingItemType.Bool,
        section: 'fileExport2GitSettings',
        public: true,
        label: 'Swap spaces for dashes in filename'
      },

      batchScriptFilePath: {
        value: '',
        type: SettingItemType.String,
        subType: SettingItemSubType.FilePath,
        section: 'fileExport2GitSettings',
        public: true,
        label: 'After Export and Execute Batch Script File Path'
      },
      batchScriptWorkspacePath: {
        value: '',
        type: SettingItemType.String,
        subType: SettingItemSubType.DirectoryPath,
        section: 'fileExport2GitSettings',
        public: true,
        label: 'Batch Script Workspace Path(empty will use the same as the export path)'
      }
    })
  }
}
