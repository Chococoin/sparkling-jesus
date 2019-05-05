const SparkPost = require('sparkpost');
const fs = require('fs');

const APIKEY = '<YOUR APIKEY HERE!>';
const client = new SparkPost(APIKEY);

// To display all the info inside recipients:
var options = {
  show_recipients: true
};

// Some times "name" values are written with all letters in minuscules
// We want it capitalized. 
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

var data;
const RECIPIENTS_LIST = '<Use the ID of the recipients list that you want to visualize.>';

// Creates a new file (newRecipientList.csv) with all the data well formatted to fit in our template. 
client.recipientLists.get(RECIPIENTS_LIST, options)
  .then((res)=>{
    data = res.results.recipients;
    var fileOnStream = fs.createWriteStream('./newRecipientList.csv');
    fileOnStream.write('email,name,return_path,substitution_data'+'\r')
    data.forEach(element => {
      fileOnStream.write(element.address.email + ',');
      fileOnStream.write(element.address.name + ',');
      fileOnStream.write('events@bounce.bitnibs.com' + ',');
      fileOnStream.write('"{""name"": ' + '""' +  element.address.name.split(' ')[0].capitalize() + '""}"'+'\r');
    });
    fileOnStream.end();
}).catch(err=> console.log(err));
