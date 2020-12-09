# wechaty-integration
[![Powered by Wechaty](https://img.shields.io/badge/Powered%20By-Wechaty-green.svg)](https://github.com/chatie/wechaty)
[![Wechaty开源激励计划](https://img.shields.io/badge/Wechaty-开源激励计划-green.svg)](https://github.com/juzibot/Welcome/wiki/Everything-about-Wechaty)
Integration wechaty with backend system

It's based on wechaty chatbot in 6 lines of TypeScript.

## Usage

### Install
#### Get the docker image of wechaty
```PULL image
docker pull wechaty/wechaty
```
#### Clone the repository or copy the mybot.js file into working folder
```clone
git clone https://github.com/johnwang71/wechaty-integration.git
```
BTW, please apply donut token from juzibot, and replace in mybot.file.

#### Startup your bot
``` docker run
cd wechaty-integration
docker run -ti --rm -p 1818:1818 --volume="$(pwd)":/bot wechaty/wechaty mybot.js
```
You should scan the QR-Code with your wechat at the first time.
Congratulations, your own bot is running now.

#### Enjoy
Now, u can send text msg to your friends or rooms with other restful client written by any language.
FYI, not strangers
Such as curl,
```TEST
curl -v http://localhost:1818/sendMsg -H 'Content-Type: application/json' -d '{"to":{"id": "CONTACT_ID"}, "msg": "Hi, buddy."}'
```
## Addition
The project was designed to integration with java backend system.
Funny that wechaty published multi-language support within 1 day after I requested the token. So sweet.
Maybe u can reach me @ java support later.


## Copyright & License

- Code & Docs © 2020 John Wang <https://github.com/johnwang71>
- Code released under the Apache-2.0 License
- Docs released under Creative Commons
