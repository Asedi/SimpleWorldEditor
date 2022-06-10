//LiteLoaderScript Dev Helper
/// <reference path="P:\LLScriptHelper-Vscode-master\Library\/JS/Api.js" /> 

mc.listen("onServerStarted", () => {
    var secondPosAntiFlood=0;
    var firstPos;
    var secondPos;
    const cmd = mc.newCommand("superset", "Sets blocks to desired ones in the area", PermType.Any);
    cmd.mandatory("name", ParamType.RawText);
    cmd.optional("testparam", ParamType.RawText);
    cmd.overload(["name",firstPos.x]);
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
});
mc.listen("onDestroyBlock", function(pl,bl){
    firstPos=bl.pos;
    var firstPosMsg="tellraw "+pl.realName+'{"rawtext":[{"text":"§b§l[SWE]§r§9§o First position set as '+ bl.pos.x+" "+bl.pos.y+" "+bl.pos.z+'"}]} ';
    mc.runcmd(`${firstPosMsg}`)
    secondPosAntiFlood=0;
    setTimeout(() => {
        mc.runcmd("fill "+ bl.pos.x+" "+bl.pos.y+" "+bl.pos.z+" "+ bl.pos.x+" "+bl.pos.y+" "+bl.pos.z+" "+bl.name);
    }, 30);
        
});
mc.listen("onUseItemOn", function(pl,it,bl,sid){
    secondPos=bl.pos;
    if(secondPosAntiFlood==0){
        var secondPosMsg="tellraw "+pl.realName+'{"rawtext":[{"text":"§b§l[SWE]§r§9§o Second position set as '+ bl.pos.x+" "+bl.pos.y+" "+bl.pos.z+'"}]} ';
        mc.runcmd(`${secondPosMsg}`)
    }
    secondPosAntiFlood=secondPosAntiFlood+1;

        
});
