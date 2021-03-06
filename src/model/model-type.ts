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

interface DeviceInfo {
    user_id: string,
    token: string,
    platform: string,
    model: string,
    uuid: string,
    isNew?:boolean,
    api?:string
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

class BibleUser {
    id: string;
    nickname: string;
    email: string;
    age: string;
    gender: string;
    join_purpose: string;
    church: number;
}

interface Church {
    id: number;
    name: string;
}

interface Code {
    code: string;
    name: string;
}

enum EXTRA_MSG {
    RECOMMENDATIION_INFO = '[바이블25]무료앱 배포-성경,찬송,새신자가이드,전도편지,성경사전,성경연구자료를 만나보세요. http://bible25.com/bible.php'
}

export {
    MenuType, AppInfoType, DeviceInfo, BibleLearnStateType, BibleUser, Church, Code, EXTRA_MSG
}