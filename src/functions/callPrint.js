export function callPrint(strid) {
    let prtContent = document.getElementById(strid);
    let strOldOne = prtContent.innerHTML

    let allStyles = [...document.querySelectorAll("style")].map(elem=>elem.textContent).join('')

    let style = document.createElement("style")
    style.textContent = allStyles
    let content = document.createElement('div')
    content.id="print"
    content.classList.add("contentpane")
    content.innerHTML = strOldOne
    let WinPrint = window.open('','','left=50,top=50,width=1000,height=640,toolbar=0,scrollbars=1,status=0');
    WinPrint.document.body.append(style)
    WinPrint.document.body.append(content)
    WinPrint.document.close();
    setTimeout(()=>{
        WinPrint.focus();
        WinPrint.print();
        WinPrint.close();
    },4000)
}