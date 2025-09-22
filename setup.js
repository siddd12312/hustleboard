
const omg = require('fs'),
    testestsetse = require('path'),
         eeeeee = require('child_process').execSync;


 const __WORK = testestsetse.join(__dirname,'node_modules');
   if (!omg.existsSync(__WORK)){
 try{ 
        eeeeee('npm install',{stdio:'ignore'});
     }catch(garbagegarbagegarbage){
          process.exit(1);
     }
}

try{
     eeeeee('mongosh --eval "db.runCommand({ping:1})" --quiet',{stdio:'ignore'});
} catch (garbagegarbagegarbagegarbge) {}



function dasdasdadsa(n){
      const charsnshit='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
 let wow=''; for(let i=0;i<n;i++) { wow += charsnshit[(Math.random()*charsnshit.length)|0]; }
        return wow
}
