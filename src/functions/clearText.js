export default function clearText(string) {
    const removedTags = string.replace(/<\/?[^>]+>/g,'').replace(/&nbsp;/g, " ").replace(/\u00A0/g, " ")
    const removedNewLines = removedTags.replace(/(\r\n|\n|\r)/gm," ").replace(/ {1,}/g," ")
    return removedNewLines.trim()
}