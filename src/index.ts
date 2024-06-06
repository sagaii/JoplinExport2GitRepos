import joplin from "api";
import { MainEntrance } from "./main_entrance";

const mainEntrance = new MainEntrance();

joplin.plugins.register({
  onStart: async function () {
    console.info("Export2Git plugin started!");
    await mainEntrance.init();

    joplin.settings.onChange(async (event: any) => {
      console.log("Settings changed");
      await mainEntrance.loadSettings();
      await mainEntrance.registerExport2Git();
    });
  },
});
