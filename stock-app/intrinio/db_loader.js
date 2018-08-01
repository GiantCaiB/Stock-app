const https = require('https');
// Using intrinio API for QCOM
module.exports = function(db){
    var username = "e937414b3cab8263c188c437a57a5a46";
    var password = "1aa1942467bdb1a461e0c3d1c65401f4";
    var auth = "Basic " + new Buffer(username + ':' + password).toString('base64');
    var collectionName = "qcom";
    var request = https.request({
        method: "GET",
        host: "api.intrinio.com",
        path: "/historical_data?identifier=QCOM&item=close_price&start_date=2017-06-01&end_date=2018-06-01&page_size=3000",
        headers: {
            "Authorization": auth
        }
    }, function(response) {
        var json = "";
        response.on('data', function (chunk) {
            json += chunk;
        });
        response.on('end', function() {
            var company = JSON.parse(json);
            // Clear the mongodb
            db.collection(collectionName).drop((err)=>{
                if (err) { 
                    throw err;
                  } else {
                    console.log('DB has been reset.');
                }
            });
            // Insert into mongodb
            db.collection(collectionName).insert(company,(err,result)=>{
                if (err) { 
                    throw err;
                  } else {
                    console.log('DB is now reloaded.');
                }
            });
        });
    });
    request.end();    
}

