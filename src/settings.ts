import joplin from 'api'
import {
  SettingItem,
  SettingItemType,
  SettingItemSubType,
  ToolbarButtonLocation
} from 'api/types'

export class Settings {
  public async register () {
    //添加操作按钮
    await joplin.views.toolbarButtons.create(
      'exportMd2Git',
      'exportMd2Git',
      ToolbarButtonLocation.EditorToolbar
    )

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
      }
    })
  }
}
