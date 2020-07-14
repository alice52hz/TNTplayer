<p align="center"><img src="https://raw.githubusercontent.com/alice52hz/TNTplayer/master/tnt.png" alt="TNTplayer" style="zoom:50%;" /></p>

## Intorduction
**TNTplayer** is a html5 video player that can used in PC end or mobile end, and support hls/rtmp stream on PC. The core of player provide a plug-in mechanisms so that it will have a better maintainability and extendibility.

## Features

- Multiple video stream like hls or rtmp can be support by TNTplayer (extension: m3u8/mp4/flv etc.)
- Component video player, the core of player supply basic ability of video player, and business is achieve by plugins
- It supply a plug-in mechanisms to keep the extensibility of player
- Interaction between components was Implement by event system witch base on Observer Pattern
- Player support lifecycle function, it make plugin can control video exactly at different moment
- It will judge is necessary to pack hls.js/flv.js via the command, this can ensure player have a small size
- Multiple versions can be generate by different commands in order to increase flexibility of player

## Usage

1.Used in modular system(like webpack)

```js
import TNTplayer from 'TNTplayer'
const config = {
    wrapper: '#video_box',
    //	...other options
}
const player = new Player(config)
```

2.Used in html file by script tag

```html
<script src="TNTplayer.js"></script>
<script>
const config = {
    wrapper: '#video_box',
    //	...other options
}
const player = new TNTplayer(config)
</script>
```

## Build

Different build command is supplied to keep flexibility of player

```js
"scripts": {
    "build:all": "npm run build && npm run build:uncop",
    "build": "npm run build:pc && npm run build:mobile",
    "build:pc": "cross-env PLATFORM=pc node build/build.js",
    "build:mobile": "cross-env PLATFORM=mobile node build/build.js",
    "build:uncop": "npm run build:pc:uncop && npm run build:mobile:uncop",
    "build:pc:uncop": "cross-env PLATFORM=pc node build/build.uncompressed.js",
    "build:mobile:uncop": "cross-env PLATFORM=mobile node build/build.uncompressed.js",
    "dev:core": "cross-env PLATFORM=pc node build/dev.core.js",
    "dev:player": "cross-env PLATFORM=pc node build/dev.player.js",
    "dev": "npm run dev:core"
}
```

Some common commands

| commands             | description                                        |
| -------------------- | -------------------------------------------------- |
| npm run build:all    | build all versions of player                       |
| npm run build        | build version that compressed                      |
| npm run build:pc     | build version with hls.js/flv.js                   |
| npm run build:mobile | build version without hls.js/flv.js                |
| npm run build:uncop  | build version that uncompressed                    |
| npm run dev:core     | start a dev-server and used for core development   |
| npm run dev:player   | start a dev-server and used for player development |

## Why *TNT*

I hope the player will be small and beautiful in size,  dazzling and powerful in performance.  Just like TNT. :-)

## License

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) 2020~present alice52hz 