const jsdom = require("jsdom");
const { JSDOM } = jsdom;
var Discord = require('discord.io');
var logger = require('winston');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
    colorize: true
});


function httpGet(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

////////////////////////////////////////////////////
/**
 * writeTextFile write data to file on hard drive
 * @param  string  filepath   Path to file on hard drive
 */
function updateTextFile() {
    var fs = require('fs');
    fs.writeFileSync("count", parseInt(readTextFile("count")) + 1);
}

////////////////////////////////////////////////////
/**
 * readTextFile read data from file
 * @param  string   filepath   Path to file on hard drive
 * @return string              String with file data
 */
function readTextFile() {
    var fs = require('fs');
    var contents = fs.readFileSync("count", 'utf8');
    return contents;
}


logger.level = 'debug';
// Initialize Discord Bot
var bot = new Discord.Client({
   token: process.env.BOT_TOKEN,
   autorun: true
});
bot.on('ready', function (evt) {
    bot.setUsername("WodOfDaDayMan");
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
    setInterval(function(){ // Set interval for checking
	    var date = new Date(); // Create a Date object to find out what time it is
	    logger.info("Code ran:" + date.getHours() + ":" + date.getMinutes());
	    if(date.getHours() === 6 && date.getMinutes() === 0){ // Check the time
	        const dom = new JSDOM(httpGet("https://www.merriam-webster.com/word-of-the-day"));
	        var div = dom.window.document.querySelector("div.word-and-pronunciation");  
	        var word = div.querySelector("h1").textContent; 
	        div = dom.window.document.querySelector("div.wod-definition-container");
	        var definition = div.querySelector("p").textContent;
	        div = dom.window.document.querySelector("div.word-attributes");
	        var type = div.querySelector("span.main-attr").textContent
	        var pronunciation = div.querySelector("span.word-syllables").textContent
	        div = dom.window.document.querySelector("div.wotd-examples");
	        var example = div.querySelector("p").textContent;
	        var fullText = "WOTD " + readTextFile() + ": **" + word + "** *" + type + "* | *" + pronunciation + "*\nDefinition" + definition + "\nExample: " + example;
	        logger.info(fullText);
	        bot.sendMessage({
	            to: '409029349501566978',
	            message: fullText
	        });
	        updateTextFile();
	    }
}, 60000);
});
