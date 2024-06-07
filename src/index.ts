import joplin from "api";
import { MainEntrance } from "./main_entrance";
 
joplin.plugins.register({
  onStart: async function () {
    console.info("Export2Git plugin started!");
    await MainEntrance.init();

    joplin.settings.onChange(async (event: any) => {
      console.log("Settings changed");
      await MainEntrance.loadSettings();
      await MainEntrance.registerExportAndRunScript();
    });
  },
});
