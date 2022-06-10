//LiteLoaderScript Dev Helper
/// <reference path="P:\LLScriptHelper-Vscode-master\Library\/JS/Api.js" /> 
let session = null;

function initdb() {
    if (!file.exists("./plugins/SimpleWorldEditor/")) {
        file.mkdir("./plugins/SimpleWorldEditor/");
    }
    session = new DBSession("sqlite", {path: "./plugins/SimpleWorldEditor/swe.db"});
    session.exec(`
      CREATE TABLE IF NOT EXISTS "sweUser" (
        player  CHAR(100) NOT NULL,
        pos1x   INTEGER   ,
        pos1y   INTEGER   ,
        pos1z   INTEGER   ,
        pos2x   INTEGER   ,
        pos2y   INTEGER   ,
        pos2z   INTEGER  
      );`);
}

mc.listen("onServerStarted", () => {
    var secondPosAntiFlood=0;
    const cmd = mc.newCommand("superset", "Sets blocks to desired ones in the area", PermType.Any);
    cmd.mandatory("name", ParamType.RawText);
    cmd.optional("testparam", ParamType.RawText);
    cmd.overload(["name"]);
    cmd.setCallback((_cmd, ori, out, res) => {
        const pl = ori.player;
        mc.broadcast(`${res.name}`);
        var successMSG='tellraw '+pl.realName+'{"rawtext":[{"text":"§b§l[SWE]§r§9§o Area filled with '+res.name+'"}]} ';
        mc.runcmd(`${successMSG}`);
        /*}
        else{
            var noPosParamsMsg="tellraw "+pl.realName+'{"rawtext":[{"text":"§b§l[SWE]§r§9§o First or second position not set "}]} ';
            mc.runcmd(`${noPosParamsMsg}`);
        }*/
        out.success("superset command executed successfully");
    });
    //LiteXLoader Dev Helper
    /// <reference path="p:\BDS1.19.1.01\plugins/Library/JS/Api.js" /> 
    
    cmd.setup();
    initdb();
});
mc.listen("onDestroyBlock", function(pl,bl){
    firstPos=bl.pos;
    var firstPosMsg="tellraw "+pl.realName+'{"rawtext":[{"text":"§b§l[SWE]§r§9§o First position set as '+ bl.pos.x+" "+bl.pos.y+" "+bl.pos.z+'"}]} ';
    mc.runcmd(`${firstPosMsg}`)
    secondPosAntiFlood=0;
    setTimeout(() => {
        mc.runcmd("fill "+ bl.pos.x+" "+bl.pos.y+" "+bl.pos.z+" "+ bl.pos.x+" "+bl.pos.y+" "+bl.pos.z+" "+bl.name);
    }, 30);
    let stmt = session.prepare("UPDATE sweUser set pos1x='"+bl.pos.x+"', pos1y='"+bl.pos.y+"', pos1z='"+bl.pos.z+"' WHERE player='"+pl.realName+"';'").execute();
});
mc.listen("onUseItemOn", function(pl,it,bl,sid){
    secondPos=bl.pos;
    if(secondPosAntiFlood==0){
        let stmt = session.prepare("UPDATE sweUser set pos2x='"+bl.pos.x+"', pos2y='"+bl.pos.y+"', pos2z='"+bl.pos.z+"' WHERE player='"+pl.realName+"';'").execute();
        var secondPosMsg="tellraw "+pl.realName+'{"rawtext":[{"text":"§b§l[SWE]§r§9§o Second position set as '+ bl.pos.x+" "+bl.pos.y+" "+bl.pos.z+'"}]} ';
        mc.runcmd(`${secondPosMsg}`)
    }
    secondPosAntiFlood=secondPosAntiFlood+1;

        
});
