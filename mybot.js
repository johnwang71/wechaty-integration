import { Wechaty } from 'wechaty'
import { ScanStatus } from 'wechaty-puppet'
import QrcodeTerminal from 'qrcode-terminal'
import express from 'express'
import bodyParser from 'body-parser'

const token = '<PUT YOUR PUPPET TOKEN ~~~HERE~~~>'

const bot = new Wechaty({
  puppet: 'wechaty-puppet-hostie',
  puppetOptions: {
    token,
  }
});

bot
  .on('scan', (qrcode, status) => {
    if (status === ScanStatus.Waiting) {
      QrcodeTerminal.generate(qrcode, {
        small: true
      })
    }
  })
  .on('login', async user => {
    console.log(`user: ${JSON.stringify(user)}`)
    var waiting = [] //insert new friends' weixin ID waiting to add
    for (var i = 0; i < waiting.length; i++)
      await bot.Friendship.add({id: waiting[i]},"HI BUDDY").catch(err => console.error("Add " + waiting[i] + " failed: " + err))
  })
  .on('message', async message => {
    console.log(`message: ${JSON.stringify(message)}`)
    //TODO: SUBMIT or SAVE MSG to your backend system
  })
  .on('room-invite', async roomInvitation => {
    try {
      console.log(`received room-invite event.`)
      //Accept new room invitation automatic
      await roomInvitation.accept()
    } catch (e) {
      console.error(e)
    }
  })
  .on('friendship', async friendship => {
    console.log(`friendship: ${JSON.stringify(friendship)}`)
    const contact = friendship.contact()
    if (friendship.type() === bot.Friendship.Type.Receive) { // receive new friendship request from new contact
      let result = await friendship.accept()
      if (result) {
        console.log(`Request from ${contact.name()} is accept succesfully!`)
      } else {
        console.log(`Request from ${contact.name()} failed to accept!`)
      }
    } else if (friendship.type() === bot.Friendship.Type.Confirm) { // confirm friendship
      console.log(`New friendship confirmed with ${contact.name()}`)
    }
  })
  .start();

var app = express();
app.use(bodyParser.urlencoded({
    extended:true
}));
app.use(bodyParser.json());

//List all contacts of current login user
app.get('/listUsers', async function(req, res) {
  if (bot.logonoff()) {
    const contactList = await bot.Contact.findAll();
    res.end(JSON.stringify(contactList));
  } else {
    res.end('{"error": "Please scan barcode to login."}');
  }
});

//Add new contact with search
app.post('/addUser', async function(req, res) {
  if (bot.logonoff()) {
    var body = req.body;
    try {
      var result = await bot.Friendship.add(body.payload, body.hello || "Hi, Buddy.");
      res.end(JSON.stringify(result));
    } catch (err) {
      result = "Error occured: " + JSON.stringify(body.payload) + " " + err;
      console.log(result);
      res.end(result);
    }
  } else {
    res.end('{"error": "Please scan barcode to login."}');
  }
});

//Send msg to contact or room
app.post('/sendMsg', async function(req, res) {
  if (bot.logonoff()) {
    var result = "";
    try {
      var body = req.body;
      var toObj;
      if (body.to) toObj = body.to.id ? await bot.Contact.find(body.to) : await bot.Contact.findAll(body.to);
      if (body.toRoom) toObj = body.toRoom.id || body.toRoom.topic ? await bot.Room.find(body.toRoom) : await bot.Room.findAll(body.toRoom);
      if (toObj) {
        result = await toObj.say(body.msg);
      }
      res.end(JSON.stringify({result: result}));
    } catch (err) {
      result = "Error occured: " + JSON.stringify(body) + " " + err;
      console.log(result);
      res.end(JSON.stringify({result: result}));
    }
  } else {
    res.end('{"error": "Please scan barcode to login."}');
  }
});

var server = app.listen(1818, function() {
  var host = server.address().address;
  var port = server.address().port;
  console.log("应用实例，访问地址为 http://%s:%s", host, port);
})
