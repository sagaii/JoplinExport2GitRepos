import joplin from 'api'

const { promisify } = require('util');
const exec = promisify(require('child_process').exec);

//本地文件系统
const fs = joplin.require('fs-extra')
const path = require('path')
const { access, constants } = require('fs').promises

//------------------------------------------------------

export class Export2git {
  /**
   * 注册插件命令
   *
   * @returns 无返回值
   */
  public async register () {
    const dialogs = joplin.views.dialogs

    const msgDlghandle = await dialogs.create('export2gitDialog')
    await dialogs.setHtml(
      msgDlghandle,
      '<p style="text-align: center">' +
        'Set your GitRepos Folder in Settings/Options -> File Export an Settings to export  your file and commit to git.' +
        '</p>'
    )
    await dialogs.setButtons(msgDlghandle, [
      {
        id: 'ok'
      }
    ])

    const installDir = await joplin.plugins.installationDir()
    const chromeCssFilePath = installDir + '/style.css'
    await (joplin as any).window.loadChromeCssFile(chromeCssFilePath)

    await joplin.commands.register({
      name: 'exportMd2Git',
      label: 'Export as MD and Commit to Git',
      iconName: 'fas fa-file-export',
      execute: async () => {
        console.info('Export as MD and Commit to Git')
        await this.ExportAsMarkdown(msgDlghandle)
        console.info('Commit to Git')
        await this.CommitToGit(msgDlghandle)
        console.info('Execute Batch Script')
        await this.ExecuteScript()
      }
    })
  }

  //------------------------------------------------------
  private async ExportAsMarkdown (handle) {
    const dialogs = joplin.views.dialogs
    const note = await joplin.workspace.selectedNote()
    if (note) {
      const fileExportPath = await joplin.settings.value('fileExportPath')
      if (fileExportPath === '') {
        console.info('No Local GitRepos Folder Path')
        await dialogs.open(handle)
        return
      }

      let content = note.body
      let title = note.title.replace(/\//g, '-').replace(/\s/g, '-') // Replace spaces and slashes with hyphens
      const fullPath = `${fileExportPath}/${title}.md`
      console.info('fullPath: ', fullPath)

      // Create subfolder path
      const attachmentFolder = `${fileExportPath}/${title}_att`
      // Ensure subfolder exists
      await fs.ensureDir(attachmentFolder)

      // Extract and export joplin resource
      const pattern = /:\/([0-9a-fA-F]{32})/g // Regular expression to joplin resource
      let match
      while ((match = pattern.exec(content)) !== null) {
        try {
          const resourceId = match[1] // Get resource ID
          console.info('resourceId: ', resourceId)

          if (!resourceId) {
            continue // Skip Id
          }

          // Download image and save to subfolder
          const resourceFilePath = await this.saveResourceFile(
            resourceId,
            attachmentFolder
          )

          if (resourceFilePath) {
            // Convert absolute resourceFilePath to relative path
            const relativeResourceFilePath = path.relative(
              path.dirname(fullPath),
              resourceFilePath
            )

            // Update content with new image path
            content = content.replace(
              `:/` + resourceId,
              relativeResourceFilePath
            )
          }
        } catch (error) {
          console.error(`Error exporting resource -image : ${error.message}`)
        }
      }

      console.info('Write MD File:', fullPath)

      await fs.outputFile(fullPath, content).then(() => {
        console.info('Finished File exported')
        joplin.settings.value('showExportConfirmationPopup').then(value => {
          if (value) {
            dialogs
              .setHtml(
                handle,
                `<p style="text-align: center">File exported to ${fullPath}</p>`
              )
              .then(() => {
                dialogs.setButtons(handle, [{ id: 'ok' }])
              })
              .then(() => {
                dialogs.open(handle)
              })
          }
        })
      })
    } else {
      console.info('No note is selected')
    }
  }

  //------------------------------------------------------
  private async saveResourceFile (resourceId, attachmentFolder) {
    try {
      // 获取资源的详细信息，包括 MIME 类型
      const resource = await joplin.data.get(['resources', resourceId], {
        fields: ['mime']
      })
      if (!resource || !resource.mime) {
        throw new Error(
          'Failed to retrieve resource mime type or resource does not exist.'
        )
      }

      console.info('resource', resource.mime)

      // 确定文件扩展名
      let extension = ''
      switch (resource.mime) {
        case 'image/jpeg':
          extension = 'jpg'
          break
        case 'image/png':
          extension = 'png'
          break
        case 'image/gif':
          extension = 'gif'
          break
        case 'application/pdf':
          extension = 'pdf'
          break
        // 根据需要添加更多 MIME 类型和扩展名的映射
        default:
          throw new Error(`Unsupported MIME type: ${resource.mime}`)
      }

      // 生成唯一文件名
      const uniqueFileName = `res_${resourceId}.${extension}`

      // 生成完整文件路径
      const filePath = `${attachmentFolder}/${uniqueFileName}`
      console.info('save filePath', filePath)

      // 异步获取资源文件内容
      const resourceData = await joplin.data.get(
        ['resources', resourceId, 'file'],
        { fields: ['id', 'mime', 'filename', 'data'] }
      )

      // 检查返回的数据是否是 Buffer
      if (resourceData && resourceData.body) {
        // 直接使用 Uint8Array 写入文件
        await fs.outputFile(filePath, resourceData.body)

        console.info(`File saved successfully: ${filePath}`)
        return filePath
      } else {
        console.error('Received data is not a buffer:', resourceData)
      }
      return ''
    } catch (error) {
      console.error(`Error saving resource file: ${error.message}`)
      return ''
    }
  }

  //------------------------------------------------------
  private isGitRepository (folderPath: string): boolean {
    try {
      // Construct the path to the .git folder
      const gitFolderPath = path(folderPath, '.git')
      // Check if the .git folder exists and is accessible
      access(gitFolderPath, constants.R_OK)
      return true
    } catch (error) {
      // If the .git folder does not exist or is not accessible, it's not a Git repository
      return false
    }
  }

  //------------------------------------------------------
  // 提交到git仓库
  //
  private async CommitToGit (msgDlghandle) {
    const dialogs = joplin.views.dialogs

    const localReposPath = await joplin.settings.value('fileExportPath')

    // Check if localReposPath exists
    if (!fs.existsSync(localReposPath) && this.isGitRepository(localReposPath)) {
      return
    }
    // Change directory to the local repository path
    process.chdir(localReposPath)

    // Add all files to the Git repository
    exec('git add .', (error, stdout, stderr) => {
      if (error) {
        console.error(`Error adding files: ${error.message}`)
        return
      }
      // Check if stderr contains a warning
      if (stderr && stderr.includes('warning:')) {
        console.warn(`Warning adding files: ${stderr}`)
      } else if (stderr) {
        console.error(`Stderr adding files: ${stderr}`)
        return
      }
      console.info(`Add files stdout: ${stdout}`)

      // Commit the changes
      exec(
        'git commit -m "Automated commit from Joplin plugin"',
        (error, stdout, stderr) => {
          if (error && stderr.includes('error:')) {
            console.error(`Error committing files: ${error.message}`)
            return
          }
          // Check if stderr contains a warning
          if (stderr && stderr.includes('warning:')) {
            console.warn(`Warning committing files: ${stderr}`)
          } else if (stderr && stderr.includes('error:')) {
            console.error(`Stderr committing files: ${stderr}`)
            return
          }
          console.info(`Commit stdout: ${stdout}`)

          // Push the changes to the remote repository
          exec(`git push `, (error, stdout, stderr) => {
            if (error && stderr.includes('error:')) {
              console.error(`Error pushing to remote: ${error.message}`)
              return
            }
            // Check if stderr contains a warning
            if (stderr && stderr.includes('warning:')) {
              console.warn(`Warning pushing to remote: ${stderr}`)
            } else if (stderr && stderr.includes('error:')) {
              console.error(`Stderr pushing to remote: ${stderr}`)
              return
            }
            console.info(`Push stdout: ${stdout}`)
          })
        }
      )
    })
  }
  //------------------------------------------------------

  private async  ExecuteScript(): Promise<void> {
    
    const batchScriptFilePath = await joplin.settings.value('batchScriptFilePath')
    if (batchScriptFilePath === '') {
      console.info('batchScriptFilePath is empty.')      
      return
    }

    let batchScriptWorkspacePath = await joplin.settings.value('batchScriptWorkspacePath')
    if (batchScriptWorkspacePath === '') {      
      batchScriptWorkspacePath=await joplin.settings.value('fileExportPath')
    }
    if (batchScriptWorkspacePath === '') {      
      batchScriptWorkspacePath=path.dirname(batchScriptFilePath)
    }
    console.info('batchScriptWorkspacePath',batchScriptWorkspacePath)      


    return new Promise((resolve, reject) => {
      // Determine the script file extension
      const extension = path.extname(batchScriptFilePath).toLowerCase();
  
      // Determine the command to execute based on the file extension
      let command = '';
      switch (extension) {
        case '.bat':
          command = `cmd /c "${batchScriptFilePath}"`;
          break;
        case '.sh':
          command = `sh "${batchScriptFilePath}"`;
          break;
        case '.ps1':
          command = `powershell -ExecutionPolicy Bypass -File "${batchScriptFilePath}"`;
          break;
        default:
          return reject(new Error('Unsupported script file type.'));
      }
  
      // Determine the working directory
      let workingDirectory = batchScriptWorkspacePath || path.dirname(batchScriptFilePath);
  
      // Check if the working directory exists
      if (!fs.existsSync(workingDirectory)) {
        return reject(new Error(`Working directory does not exist: ${workingDirectory}`));
      }
  
      // Execute the script
      exec(command, { cwd: workingDirectory }, (error, stdout, stderr) => {
        if (error) {
          return reject(new Error(`Error executing script: ${stderr}`));
        }
        console.log(stdout);
        resolve();
      });
    });
  }

   //------------------------------------------------------



}
