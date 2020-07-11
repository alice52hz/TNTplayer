<p align="center"><img src="https://raw.githubusercontent.com/alice52hz/TNTplayer/master/tnt.png" alt="TNTplayer" style="zoom:50%;" /></p>

## Intorduction
**TNTplayer** is a html5 video player that can used in PC end or mobile end, and support hls/rtmp stream on PC. The core of player provide a plug-in mechanisms so that it will have a better maintainability and extendibility.

## Features

- Support hls or flv stream on PC end(browser on PC can't support hls/rtmp stream naturally)

## Getting Started

1.Used in modular system(like webpack)

```js
import TNTplayer from 'TNTplayer'
const config = {
    //	options
}
const player = new Player(config)
```

2.Used in html file by script tag

```html
<script src="TNTplayer.js"></script>
<script>
const config = {
    //	options
}
const player = new TNTplayer(config)
</script>
```

## Build system(webpack)

- Different build command for build make sure it is flexable

## Why *TNT*

I hope the player will be small and beatiful in size, and big and powerful in engey. Just like TNT. :-)

## License

MIT

copyright (c) alice52hz 2020~present