const parentContextMenuItem = 'formCompleter';

const actionEnum = Object.freeze({
    "Imię": 8,
    "Nazwisko": 9,
    "PESEL": 1,
    "Nr dowodu": 2,
    "Nr telefonu": "p",
    "NIP": 5,
    "NRB": 6,
    "IBAN": 7,
    "Losowa wartość": 0,
    "Kod pocztowy": "k",
    "Miejscowość": "c",
    "Reset kontrolki": 3,
    "Reset formularza": 4,
});

chrome.contextMenus.removeAll();

chrome.contextMenus.create({
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
    if (actionEnum[key] != 3 && actionEnum[key] != 4 && actionEnum[key] != "c") {
        if (actionEnum[key] == 8 || actionEnum[key] == 9) {
            chrome.contextMenus.create({
                id: actionEnum[key].toString() + 'valid',
                title: 'Żeńskie',
                contexts: ['editable'],
                parentId: actionEnum[key].toString()
            });
            chrome.contextMenus.create({
                id: actionEnum[key].toString() + 'invalid',
                title: 'Męskie',
                contexts: ['editable'],
                parentId: actionEnum[key].toString()
            });
            return;
        }

        if (actionEnum[key] == "p") {
            chrome.contextMenus.create({
                id: actionEnum[key].toString() + 'valid',
                title: 'bez kierunkowego',
                contexts: ['editable'],
                parentId: actionEnum[key].toString()
            });
            chrome.contextMenus.create({
                id: actionEnum[key].toString() + 'invalid',
                title: 'z kierunkowym',
                contexts: ['editable'],
                parentId: actionEnum[key].toString()
            });
            return;
        }

        if (actionEnum[key] == 0) {
            chrome.contextMenus.create({
                id: actionEnum[key].toString() + 'valid',
                title: 'Tekstowa',
                contexts: ['editable'],
                parentId: actionEnum[key].toString()
            });
            chrome.contextMenus.create({
                id: actionEnum[key].toString() + 'invalid',
                title: 'Liczbowa',
                contexts: ['editable'],
                parentId: actionEnum[key].toString()
            });
            return;
        }

        chrome.contextMenus.create({
            id: actionEnum[key].toString() + 'valid',
            title: 'Poprawny',
            contexts: ['editable'],
            parentId: actionEnum[key].toString()
        });
        chrome.contextMenus.create({
            id: actionEnum[key].toString() + 'invalid',
            title: 'Niepoprawny',
            contexts: ['editable'],
            parentId: actionEnum[key].toString()
        });
    }
})

chrome.contextMenus.onClicked.addListener((info, tab) => {
    chrome.tabs.sendMessage(tab.id, info.menuItemId);
});
