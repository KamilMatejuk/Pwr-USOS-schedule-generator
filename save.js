window.onload = () => {
    DATA_PER_CLASS = mapDataPerClass()
    DATA.forEach(item => addItem(item));
    console.log(DATA_PER_CLASS)

    let elements = document.querySelectorAll('.cell > div')
    Array.prototype.forEach.call(elements, (el) => el.addEventListener('click', generatePopup))
    Array.prototype.forEach.call(elements, (el) => el.addEventListener('mouseenter', (event) => showOtherGroups(event, true)))
    Array.prototype.forEach.call(elements, (el) => el.addEventListener('mouseleave', (event) => showOtherGroups(event, false)))

    parseUrlArgs()
}

function mapDataPerClass() {
    data = {}
    DATA.forEach(item => {
        if (!(item.name in data)) data[item.name] = {}
        if (!(item.kind in data[item.name])) data[item.name][item.kind] = []
        data[item.name][item.kind].push(item)
    });
    return data
}

function generatePopup(event) {
    let item = event.target
    if (!item.getAttribute('attr-name')) item = item.parentElement
    let div = document.createElement('div')
    div.style.cssText = 'width:100vw; height:100vh; overflow:hidden; position:fixed; top:0; bottom:0; left:0; right:0; z-index: 100; background:#0009; display:flex; align-items:center; justify-content:center;'
    div.innerHTML = `
    <div style='background:#fff; border-radius:30px; padding:30px; display:flex; flex-direction:column; align-items:center;'>
        <p style='font-weight:bold;'>${item.getAttribute('attr-name')}</p>
        <p>${item.getAttribute('attr-kind')} gr. ${item.getAttribute('attr-group')}</p>
        <p>${item.getAttribute('attr-code')}</p>
        <p>${item.getAttribute('attr-time')} ${item.getAttribute('attr-day')} ${item.getAttribute('attr-occurance')}</p>
        <p>${item.getAttribute('attr-prof')}</p>
        <p>${item.getAttribute('attr-place')}</p>
        <a href='${item.getAttribute('attr-link')}' target='_blank'>Strona przedmiotu ></a>
        <button onclick='selectItem("${item.getAttribute('attr-code')}", "${item.getAttribute('attr-group')}")'>Wybierz</a>
    </div>`
    div.onclick = () => document.body.removeChild(div)
    document.body.appendChild(div);
}

function showOtherGroups(event, hovered) {
    let item = event.target
    let elements = document.querySelectorAll('.cell > div')
    Array.prototype.forEach.call(elements, (el) => {
        if (!hovered) {
            el.style.opacity = '1.0'
        }
        if (hovered && el.getAttribute('attr-name') != item.getAttribute('attr-name')) {
            el.style.opacity = '0.5'
        }
    })
}

function addItem(item) {
    let div = document.createElement('div')
    div.setAttribute('attr-code', item.code)
    div.setAttribute('attr-day', item.day)
    div.setAttribute('attr-group', item.group)
    div.setAttribute('attr-kind', item.kind)
    div.setAttribute('attr-link', item.link)
    div.setAttribute('attr-name', item.name)
    div.setAttribute('attr-occurance', item.occurance)
    div.setAttribute('attr-place', item.place)
    div.setAttribute('attr-prof', item.prof)
    div.setAttribute('attr-time', item.time)

    let occ = ''
    if (item.occurance.includes('nieparzyste')) occ = 'TN'
    else if (item.occurance.includes('parzyste')) occ = 'TP'
    let groups = DATA_PER_CLASS[item.name][item.kind].length
    let group = (groups == 1) ? '' : `gr.${item.group}/${groups}`
    div.innerHTML = `
        <p style='position:absolute; top:5px; left:5px;'>${item.kind} ${occ}</p>
        <p style='position:absolute; top:5px; right:5px;'>${group}</p>
        <p>${item.name}</p>
        <p>${item.prof}</p>
        <p>${item.place}</p>`

    let id = 'h' + item.time.split(':')[0] + 'c' + ['', 'Mon', 'Tue', 'Wed', 'Thr', 'Fri'].indexOf(item.day)
    document.getElementById(id).appendChild(div)
}

function addSelected(code, name, group, time, day, prof, place) {
    let div = document.createElement('div')
    div.innerHTML = `
        <p>${code}</p>
        <p>${name}</p>
        <p>${group}</p>
        <p>${time} ${day}</p>
        <p>${prof}</p>
        <p>${place}</p>
        <button onclick='unselectItem(event, "${code}", "${time}", "${day}")'>Usuń</a>`

    document.getElementById('selected').appendChild(div)
}

function selectItem(code, group) {
    let selected
    let elements = document.querySelectorAll('.cell > div')
    Array.prototype.forEach.call(elements, (el) => {
        if (el.getAttribute("attr-code") == code) {
            if (el.getAttribute("attr-group") == group) {
                selected = el
                el.style.border = '3px solid red'
                addSelected(
                    el.getAttribute("attr-code"),
                    el.getAttribute("attr-name"),
                    el.getAttribute("attr-group"),
                    el.getAttribute("attr-time"),
                    el.getAttribute("attr-day"),
                    el.getAttribute("attr-prof"),
                    el.getAttribute("attr-place"),
                )
            } else {
                el.style.display = 'none'
            }
        }
    })
}

function unselectItem(event, code, time, day) {
    let div = event.target.parentElement
    div.parentElement.removeChild(div)
    let elements = document.querySelectorAll('.cell > div')
    Array.prototype.forEach.call(elements, (el) => {
        if (el.getAttribute("attr-code") == code) {
            el.style.removeProperty('border')
            el.style.removeProperty('display')
        }
    })
}

function save(event) {
    let elements = document.getElementById('selected').childNodes
    let url = []
    Array.prototype.forEach.call(elements, (el) => {
        let ps = el.getElementsByTagName('p')
        url.push(ps[0].innerText + '=' + ps[2].innerText)
    })
    url = window.location.href.split('?')[0] + '?' + url.join('&')
    navigator.clipboard.writeText(url);
}

function parseUrlArgs() {
    let urlParams = new URLSearchParams(window.location.search)
    for (const [code, group] of urlParams.entries()) {
        console.log(code, group);
        selectItem(code, group)
    }
}
