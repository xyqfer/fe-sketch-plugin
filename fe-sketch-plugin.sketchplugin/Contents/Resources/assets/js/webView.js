// Disable the context menu
document.addEventListener("contextmenu", function (e) {
    e.preventDefault();
});

let codeBlock = document.querySelector("#code");
let textContent = document.querySelector("#text-content");
let unitInput = document.querySelector('#scss-unit');
let miniPixelInput = document.querySelector('#mini-pixel');
let previewItem = document.querySelector(".preview__item");

unitInput.addEventListener('input', update);
miniPixelInput.addEventListener('input', update);

let codeBeforeFilter = '';
let originStyle = '';

function removeBlackListAttributes(codeString) {
    let blackList = [
        'font-family',
        'letter-spacing',
        'line-height',
        'text-align',
        '\\/\\*'
    ];

    let codeStringList = codeString.split(/\n/g);
    let filterString = codeStringList.filter((item) => {
        if (item == "") {
            return false;
        }

        for (let i = 0; i < blackList.length; i++) {
            let reg = new RegExp(`^${blackList[i]}`, 'ig', '');

            if (reg.test(item)) {
                return false;
            }
        }

        return true;
    }).join('\n');

    return filterString
}

function filterCode(codeString) {
    let unitsFunc = (match, val) => {
        let unit = unitInput.value;
        let miniPixel = miniPixelInput.value;

        if (val <= parseInt(miniPixel)) {
            return `${val}px`;
        }
        return `${val / unit}rem`;
    };

    let result = codeString.replace(/([0-9]+)px/ig, unitsFunc);
    result = removeBlackListAttributes(result);

    return result
}

function updatePreview(params) {
    let style = params.attributes;

    previewItem.innerHTML = params.content || '';
    textContent.innerHTML = params.content || '';

    let displayCode = `${style.replace(/(;)/g, '$1\n')}`;

    displayCode = `${displayCode.replace(/(\*\/)/g, '$1\n')}`;
    displayCode = displayCode.split('\n').map((item) => {
        return item.trim();
    }).join('\n');
    originStyle = style;
    codeBeforeFilter = displayCode;

    update();
}

function update() {
    codeBlock.innerHTML = filterCode(codeBeforeFilter);
    hljs.highlightBlock(codeBlock);
    hljs.highlightBlock(textContent);
    previewItem.style.cssText = originStyle;
}

update();