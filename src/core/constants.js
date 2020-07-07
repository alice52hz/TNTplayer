
//  Hook function names of plugin lifecycle
export const hooks = [
    'beforeCreate',
    'created',
    'beforeMount',
    'mounted',
    'beforeDestroy',
    'destroyed'
]

//  Keys to be proxied get method from video to player instance
export const KEYS_TO_PROXY_GET = [
    'autoplay',
    'buffered',
    'currentSrc',
    'currentTime',
    'defaultMuted',
    'defaultPlaybackRate',
    'duration',
    'ended',
    'error',
    'loop',
    'mediaGroup',
    'muted',
    'networkState',
    'paused',
    'playbackRate',
    'played',
    'preload',
    'readyState',
    'seekable',
    'seeking',
    'src',
    'startDate',
    'textTracks',
    'videoTracks',
    'volume'
]

//  Keys to be proxied set method from video to player instance
export const KEYS_TO_PROXY_SET = [
    'currentTime',
    'defaultMuted',
    'defaultPlaybackRate',
    'loop',
    'mediaGroup',
    'muted',
    'paused',
    'preload',
    'playbackRate',
    'src',
    'volume'
]