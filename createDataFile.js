const fs = require("fs");
const fetch = require('node-fetch');
global.Headers = fetch.Headers;

exports.init = function(){
        console.log('start fetching datas');
        let headers = new Headers({
            "Content-Type": "application/json"
        });
        var promesses = [];
        //for (var i = 0; i < 19000; i += 1000) {
          promesses.push(
            fetch(
              //`http://api.betaseries.com/shows/list?limit=1000&start=${i}&key=${process.env.API_KEY}`,
              `http://api.betaseries.com/shows/list?key=${process.env.API_KEY}&limit=1000&order=followers`,
              { headers: headers }
            )
            .then(function(response) {
              return response.json();
            })
            .catch(e => {
              console.log("ERROR : ", e);
            })
          );        
        // }
    
        Promise.all(promesses).then(v => {
          let myShows = [];
          for(var i in v){
            myShows = [...myShows,...v[i].shows]
          }
          var fileContent = myShows
          fs.writeFile("./write.json", JSON.stringify(fileContent), err => {
            if (err) {
                console.error(err);
                return;
            }else{
                console.log("File has been created");
                return;
            }
          });
        }).catch((err)=>console.log(err));
}


