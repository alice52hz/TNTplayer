//  Types of video src
const HLS = 'm3u8'
const MP4 = 'mp4'
const FLV = 'flv'
const OGG = 'ogg'

/**
 * Get extendsion name from src string
 * @param {string} src 
 */
export function getType(src) {
    let srcWithoutSearch = src.split('?')[0]
    const extendsion = srcWithoutSearch
        .match(/\.\w*$/)[0]
        .substr(1)
        .toLowerCase()
    return extendsion
}

export function isMp4(src) {
    let type = getType(src)
    return type === MP4 || type === OGG
}

export function isHls(src) {
    return getType(src) === HLS
}

export function isFlv(src) {
    return getType(src) === FLV
}