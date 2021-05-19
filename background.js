const parentContextMenuItem = 'formCompleter';

const actionEnum = Object.freeze({
    "PESEL": 1,
    "Nr dowodu": 2,
    "NIP": 5,
    "NRB": 6,
    "IBAN": 7,
    "Reset kontrolki": 3,
    "Reset formularza": 4,
});

chrome.contextMenus.removeAll();

const id = chrome.contextMenus.create({
    id: parentContextMenuItem,
    title: 'Form Completer',
    contexts: ['editable'],
});

Object.keys(actionEnum).forEach((key) => {
    chrome.contextMenus.create({
        id: actionEnum[key].toString(),
        title: key,
        contexts: ['editable'],
        parentId: parentContextMenuItem
    });

    // SubMenus context for parent Items
    if (actionEnum[key] != 3 && actionEnum[key] != 4) {
        chrome.contextMenus.create({
            id: actionEnum[key].toString() + 'valid',
            title: 'Poprawne',
            contexts: ['editable'],
            parentId: actionEnum[key].toString()
        });
        chrome.contextMenus.create({
            id: actionEnum[key].toString() + 'invalid',
            title: 'Niepoprawne',
            contexts: ['editable'],
            parentId: actionEnum[key].toString()
        });
    }
})

chrome.contextMenus.onClicked.addListener((info, tab) => chrome.tabs.sendMessage(tab.id, info.menuItemId));