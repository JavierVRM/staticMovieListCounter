console.log('hello there')
let newReq = []
let totalRes = []

function getVal () {
    let newList = document.getElementById("newList")

    if (newList.value.length > 1) {
        let newListToArray = newList.value.split("\n")

        newReqSetter(newListToArray)

        totalResSetter()
        
        totalResSorter()
        newReq = [];
        newList.value = "";
        totalRes = totalRes.flat()
        totalListPrinter();
        console.warn('totalRes', totalRes)
    } else {
        return
    }
}

function newReqSetter (newListToArray) {
    newListToArray = newListToArray.filter(n => n)
    for (let i = 0; i < newListToArray.length; i++) {
        let cleanTitle = newReqCleaner(newListToArray[i])
        newReq.push({
            title: cleanTitle,
            value: (newListToArray.length - i)
        })
    }
}

function newReqCleaner (item) {
    item = item.toLowerCase()
    let indexOfTitle = item.search(/[a-zA-Z]/)
    item = item.slice(indexOfTitle)
    let indexOfDate = item.search(/\([0-9]+\)/)
    if(indexOfDate !== -1) {
        item = item.slice(0, indexOfDate)
    }
    return item.charAt(0).toUpperCase() + item.slice(1);
}

function totalResSetter () {
    if (totalRes.length) {
        for (let i = 0; i < newReq.length; i++) {
            totalRes.filter(totalResElement => {
                if (totalResElement.title === newReq[i].title) {
                    totalResElement.value += newReq[i].value
                    newReq[i].status = 'checked'
                } 
            })
            if (!newReq[i].status) {
                totalRes.push(newReq[i])
            }
        } 
    } else {
        totalRes.push(newReq)
    }
    
}

function totalResSorter() {
    totalRes.sort((a, b) => b.value - a.value)
}

function totalListPrinter () {
    let listFather = document.getElementById("responseList")

    while (listFather.firstChild) {
        listFather.firstChild.remove();
    }

    for (res of totalRes) {
        let listItem = document.createElement('li')
        let listText = document.createTextNode(`${res.title} - ${res.value}`)
        listItem.appendChild(listText)
        listFather.appendChild(listItem)
    }
}
