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

class BibleLearnStateType {
    isLearn: boolean;
    result:boolean;
    errMsg: any;
    learn_start_dt: string;
    learn_end_dt: string;
    today_dt: string;
    currDayCount: number;
    totalDurationDayCount: number;
    untilCurrDayPercent: string;
    untilCurrDayPercentByCeil: string;
    currDayLearnJangCount: number;
    totalLearnJangCount: number;
    untilCurrLearnJangPercent: string;
    untilCurrLearnJangPercentByCeil: string;
    untilCurrAvgJangCnt: string;
    remainExpectationAvgJangCnt: string;
}

export {
    MenuType, AppInfoType, BibleLearnStateType
}