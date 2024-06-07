
import joplin from "api";

import { Settings } from "./settings"; 
import { Export2git } from "./export2git"; 
import { Logger } from "./logger";

class MainEntrance { 
 

  public async init() {
    console.log("Export2Git Plugin init"); 
    Logger.displayMessage("Export2Git Plugin init");
    await this.registerSetting();
    await this.loadSettings();    
    await this.registerExport2Git();

  }
 private async registerSetting(){
    console.log("registerSetting"); 
    await new Settings().register();
 }

  public async loadSettings() {
    console.log("loadSettings"); 
  }

  
  public async registerExport2Git() {
    console.log("registerExport2Git");  
    await new Export2git().register();
    
  }


}

export { MainEntrance };

