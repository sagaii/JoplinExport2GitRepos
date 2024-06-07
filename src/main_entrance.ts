import joplin from 'api'

import { Settings } from './settings'
import { ExportAndRunScript } from './export_and_runscript'
import { Logger } from './logger'

export namespace MainEntrance {
  export async function init () {
    console.log('Plugin init')
    Logger.displayMessage('Plugin init')
    await this.registerSetting()
    await this.loadSettings()
    await this.registerExportAndRunScript()
  }
  export async function registerSetting () {
    console.log('registerSetting')
    await  Settings.register()
  }

  export async function loadSettings () {
    console.log('loadSettings')
  }

  export async function registerExportAndRunScript () {
    console.log('registerExportAndRunScript')
    await  ExportAndRunScript.register()
  }
}
