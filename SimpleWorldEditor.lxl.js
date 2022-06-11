//LiteLoaderScript Dev Helper
/// <reference path="P:\LLScriptHelper-Vscode-master\Library\/JS/Api.js" /> 
let session = null;
var swandToggle=false;
function initdb() {
    if (!file.exists("./plugins/SimpleWorldEditor/")) {
        file.mkdir("./plugins/SimpleWorldEditor/");
    }
    session = new DBSession("sqlite", { path: "./plugins/SimpleWorldEditor/swe.db" });
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
let arr = [];
let clipboardArray = [];
var secondPosAntiFlood = 0;
mc.listen("onServerStarted", () => {
    const cmd1 = mc.newCommand("sset", "Sets blocks to desired ones in the area", PermType.Any);
    cmd1.mandatory("name", ParamType.RawText);
    cmd1.overload(["name"]);
    cmd1.setCallback((_cmd, ori, out, res) => {
        const pl = ori.player;
        var successMSG = 'tellraw ' + pl.realName + '{"rawtext":[{"text":"§b§l[SWE]§r§9§o Sucesfully filled area with ' + res.name + '"}]} ';
        mc.runcmd(`${successMSG}`);
        let stmt = session.prepare("SELECT * FROM sweUser WHERE player='" + pl.realName + "'");
        let row = stmt.fetch();
        arr[1] = row.pos1x;
        arr[2] = row.pos1y;
        arr[3] = row.pos1z;
        arr[4] = row.pos2x;
        arr[5] = row.pos2y;
        arr[6] = row.pos2z;
        mc.runcmd(`fill ${arr[1]} ${arr[2]} ${arr[3]} ${arr[4]} ${arr[5]} ${arr[6]} ${res.name}`);
    });
    //LiteXLoader Dev Helper
    /// <reference path="p:\BDS1.19.1.01\plugins/Library/JS/Api.js" /> 

    cmd1.setup();
    initdb();
    const cmd2 = mc.newCommand("scopy", "Copies the area selection", PermType.Any);
    cmd2.overload();
    cmd2.setCallback((_cmd, ori, out, res) => {
        copy(ori.player);
    });
    //LiteXLoader Dev Helper
    /// <reference path="p:\BDS1.19.1.01\plugins/Library/JS/Api.js" /> 

    cmd2.setup();
    const cmd3 = mc.newCommand("spaste", "Copies the area selection", PermType.Any);
    cmd3.overload();
    cmd3.setCallback((_cmd, ori, out, res) => {
        paste(ori.player);
    });
    //LiteXLoader Dev Helper
    /// <reference path="p:\BDS1.19.1.01\plugins/Library/JS/Api.js" /> 

    cmd3.setup();

    const cmd4 = mc.newCommand("sup", "Copies the area selection", PermType.Any);
    cmd4.overload();
    cmd4.setCallback((_cmd, ori, out, res) => {
        up(ori.player);
    });
    //LiteXLoader Dev Helper
    /// <reference path="p:\BDS1.19.1.01\plugins/Library/JS/Api.js" /> 

    cmd4.setup();

    const cmd5 = mc.newCommand("swand", "Turns on editing mode", PermType.Any);
    cmd5.overload();
    cmd5.setCallback((_cmd, ori, out, res) => {
        swandToggle ^= true;
    });
    //LiteXLoader Dev Helper
    /// <reference path="p:\BDS1.19.1.01\plugins/Library/JS/Api.js" /> 

    cmd5.setup();
});
mc.listen("onDestroyBlock", function (pl, bl) {
    if(swandToggle){
        firstPos = bl.pos;
        var firstPosMsg = "tellraw " + pl.realName + '{"rawtext":[{"text":"§b§l[SWE]§r§9§o First position set as ' + bl.pos.x + " " + bl.pos.y + " " + bl.pos.z + '"}]} ';
        mc.runcmd(`${firstPosMsg}`)
        secondPosAntiFlood = 0;
        setTimeout(() => {
            mc.runcmd("fill " + bl.pos.x + " " + bl.pos.y + " " + bl.pos.z + " " + bl.pos.x + " " + bl.pos.y + " " + bl.pos.z + " " + bl.name);
        }, 30);
        let stmt = session.prepare("UPDATE sweUser set pos1x='" + bl.pos.x + "', pos1y='" + bl.pos.y + "', pos1z='" + bl.pos.z + "' WHERE player='" + pl.realName + "';'").execute();
    }

});
mc.listen("onUseItemOn", function (pl, it, bl, sid) {
    if(swandToggle){    
        secondPos = bl.pos;
        var blok;
        if (secondPosAntiFlood == 0) {
            let stmt = session.prepare("UPDATE sweUser set pos2x='" + bl.pos.x + "', pos2y='" + bl.pos.y + "', pos2z='" + bl.pos.z + "' WHERE player='" + pl.realName + "';'").execute();
            var secondPosMsg = "tellraw " + pl.realName + '{"rawtext":[{"text":"§b§l[SWE]§r§9§o Second position set as ' + bl.pos.x + " " + bl.pos.y + " " + bl.pos.z + '"}]} ';
            mc.runcmd(`${secondPosMsg}`)
        }
        secondPosAntiFlood = secondPosAntiFlood + 1;
    }



});
function copy(pl) {
    clipboardSession = new DBSession("sqlite", { path: "./plugins/SimpleWorldEditor/clipboard.db" });
    clipboardSession.exec(`
      CREATE TABLE IF NOT EXISTS "Clipboard" (
        blockname  CHAR(100) NOT NULL,
        posx   INTEGER   ,
        posy   INTEGER   ,
        posz   INTEGER   
      );`);
    let stmt = session.prepare("SELECT * FROM sweUser WHERE player='" + pl.realName + "'");
    let row = stmt.fetch();
    var x1 = row.pos1x;
    var y1 = row.pos1y;
    var z1 = row.pos1z;
    var x2 = row.pos2x;
    var y2 = row.pos2y;
    var z2 = row.pos2z;
    let s;
    var xHelper;
    var yHelper;
    var zHelper;
    if (x1 < x2) {
        xHelper = 1;
    }
    else {
        xHelper = -1;
    }
    if (y1 < y2) {
        yHelper = 1;
    }
    else {
        yHelper = -1;
    }
    if (z1 < z2) {
        zHelper = 1;
    }
    else {
        zHelper = -1;
    }
    for (x1 = row.pos1x; x1 - xHelper != x2; x1 = x1 + xHelper) {
        for (z1 = row.pos1z; z1 - zHelper != z2; z1 = z1 + zHelper) {
            for (y1 = row.pos1y; y1 - yHelper != y2; y1 = y1 + yHelper) {
                s = mc.getBlock(x1, y1, z1, 0);
                mc.broadcast(`x= ${s.pos.x} y= ${s.pos.y} z= ${s.pos.z} ${s.name}`);
                clipboardSession.prepare("INSERT INTO Clipboard VALUES ( '" + s.name + "', " + s.pos.x + ", " + s.pos.y + ", " + s.pos.z + ");'").execute();
            }
            y1 = row.pos1;
        }
        z1 = row.pos1z;
    }
    clipboardSession.close();

};
function paste(pl) {
    clipboardSession = new DBSession("sqlite", { path: "./plugins/SimpleWorldEditor/clipboard.db" });
    let stmt = clipboardSession.prepare("SELECT * FROM Clipboard");
    var x, y, z;
    var xHelper;
    var yHelper;
    var zHelper;
    var i = 0;
    if (x < x) {
        xHelper = 1;
    }
    else {
        xHelper = -1;
    }
    if (y < y) {
        yHelper = 1;
    }
    else {
        yHelper = -1;
    }
    if (z < z) {
        zHelper = 1;
    }
    else {
        zHelper = -1;
    }
    var px = parseInt(pl.pos.x);
    var py = parseInt(pl.pos.y);
    var pz = parseInt(pl.pos.z);
    let row1 = stmt.fetch();
    x = row1.posx;
    var clipboardArr=[];
    mc.broadcast(`Player Pos= ${px} ${py} ${pz}`);
    var g=0;
    if(x){
        do {
            let row = stmt.fetch();
            blockname = row.blockname;
            x = row.posx;
            y = row.posy;
            z = row.posz;
            clipboardArr.push([g=g+1,blockname, x, y, z])
            
        } while (stmt.step());
    }
    else{
        var spasteClearedMsg = "tellraw " + pl.realName + '{"rawtext":[{"text":"§b§l[SWE]§r§9§o Your clipboard is empty "}]} ';
        mc.runcmd(`${spasteClearedMsg}`)
    }
    /*for(var i=0;i<clipboardArr.length;i++){
        for(var j=0;j<clipboardArr[i].length;j++){
            mc.broadcast(`${clipboardArr[j][0]}`);
            mc.broadcast(`${clipboardArr[j][1]}`);
            mc.broadcast(`${clipboardArr[j][2]}`);
            mc.broadcast(`${clipboardArr[j][3]}`);
        }

    }*/
    var diffx=Math.abs(px-clipboardArr[0][2]);
    var diffy=Math.abs(py-clipboardArr[0][3]);
    var diffz=Math.abs(pz-clipboardArr[0][4]);
    if(clipboardArr[0][2]>px){
        diffx=-diffx;
        mc.broadcast(`Wart diffx ${diffx}`);
    }
    else{
        mc.broadcast(`Wart diffx ${diffx}`);
    }
    if(clipboardArr[0][3]>py){
        diffy=-diffy;
        mc.broadcast(`Wart diffx ${diffy}`);
    }
    else{
        diffy=diffy-2;
        mc.broadcast(`Wart diffx ${diffy}`);
    }
    if(clipboardArr[0][4]>pz){
        diffz=-diffz;
        mc.broadcast(`Wart diffx ${diffz}`);
    }
    else{
        diffz=diffz-1;
        mc.broadcast(`Wart diffx ${diffz}`);
    }
    for(var g=0; g<clipboardArr.length;g++){
        mc.broadcast(`Wart zerowa ${clipboardArr[0][2]}`);
        mc.broadcast(`${clipboardArr[g][1]}`);
        mc.broadcast(`${clipboardArr[g][2]+diffx}`);
        mc.broadcast(`${clipboardArr[g][3]}`);
        mc.broadcast(`${clipboardArr[g][4]}`);
        mc.setBlock(clipboardArr[g][2]+diffx, clipboardArr[g][3]+diffy, clipboardArr[g][4]+diffz, 0, clipboardArr[g][1], 0);
    }
    let stmt2=clipboardSession.prepare("DELETE FROM Clipboard");
    stmt2.execute();
    clipboardSession.close();
};

function up(pl) {
    var posy=pl.pos.y-2;
    mc.broadcast("fill " + pl.pos.x + " " + posy + " " + pl.pos.z + " " + pl.pos.x + " " + posy + " " + pl.pos.z + " " + "glass");
    mc.runcmd("fill " + pl.pos.x + " " + posy + " " + pl.pos.z + " " + pl.pos.x + " " + posy + " " + pl.pos.z + " " + "glass");

}