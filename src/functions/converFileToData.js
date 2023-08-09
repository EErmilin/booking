export default async function convertFileToData (file,isAllowFile){
    const reader = new FileReader()
    if(!isAllowFile && !((file.type === "image/jpeg") || (file.type === "image/png")))return

    return new Promise((resolve, reject)=>{
        reader.readAsDataURL(file)

        reader.onload = ()=>{
            resolve(reader.result)
        }
        reader.onerror = ()=>{
            reader.abort()
            reject(new DOMException("Проблемы парсинга файла"))
        }
    })
}