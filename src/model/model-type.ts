interface MenuType {
    name: string,
    page: string,
    menuLevel: string,
    selected: boolean,
    url: string
}

interface AppInfoType {
    view_bible_book: number,
    book_name: string,
    view_bible_jang: number,
    view_hymn_pnum: string,
    selected_first_name: string,
    selected_eng_names: string
}

export {
    MenuType, AppInfoType
}