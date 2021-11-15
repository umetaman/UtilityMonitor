const builder = require("electron-builder");
const Platform = builder.Platform;
const path = require("path");

try{
    builder.build({
        targets: Platform.WINDOWS.createTarget(),
        config: {
            productName: "Utility Monitor",
            directories: {
                output: path.resolve(__dirname, "appDist"),
            },
        },
    });
    console.log("Finish!");
}
catch(e){
    console.error(e);
}