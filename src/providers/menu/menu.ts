import { Injectable } from '@angular/core';

// Original Url
// home: 'http://ch2ho.bible25.com/m/main_renewal_android.php'
// 말씀따라: 'http://ch2ho.bible25.com/m/bless/today10.php?bo_id=grace&array_num=5'
// 컬럼: 'http://ch2ho.bible25.com/m/bless/today3.php?bo_id=comm6'
// 십자가: 'http://ch2ho.bible25.com/m/bless/today2.php?bo_id=comm5'
// 메일아침: 'http://ch2ho.bible25.com/m/bless/today1.php?bo_id=comm2'
// 오늘한컷: 'http://ch2ho.bible25.com/m/bless/today7.php?bo_id=calligraphy'
// 축복기도문: 'http://ch2ho.bible25.com/m/bless/today10.php?bo_id=jewel&array_num=5'
// 손편지: 'http://ch2ho.bible25.com/m/bless/today6.php?bo_id=calli'
// 성경연구: 'http://ch2ho.bible25.com/m/contents.php'

@Injectable()
export class MenuProvider {

  public MenuData = new Map()
      .set('home', {
          name: '홈',
          page: 'HomePage',
          menuLevel: 'top_menu',
          selected: false,
          url: 'http://ch2ho.bible25.com/m/main_all.php'
      })
      .set('today_menu1', {
          name: '말씀따라',
          page: 'HomePage',
          menuLevel: 'sub_menu',
          selected: false,
          url: 'http://ch2ho.bible25.com/m/bbs_renew/board.php?bo_table=grace'
      })
      .set('today_menu2', {
          name: '컬럼',
          page: 'HomePage',
          menuLevel: 'sub_menu',
          selected: false,
          url: 'http://ch2ho.bible25.com/m/bbs_renew/board.php?bo_table=comm6'
      })
      .set('today_menu3', {
          name: '십자가',
          page: 'HomePage',
          selected: false,
          menuLevel: 'sub_menu',
          url: 'http://ch2ho.bible25.com/m/bbs_renew/board.php?bo_table=comm5'
      })
      .set('today_menu4', {
          name: '메일아침',
          page: 'HomePage',
          selected: false,
          menuLevel: 'sub_menu',
          url: 'http://ch2ho.bible25.com/m/bbs_renew/board.php?bo_table=comm2'
      })
      .set('today_menu5', {
          name: '오늘한컷',
          page: 'HomePage',
          selected: false,
          menuLevel: 'sub_menu',
          url: 'http://ch2ho.bible25.com/m/bbs_renew/board.php?bo_table=calligraphy'
      })
      .set('today_menu6', {
          name: '축복기도문',
          page: 'HomePage',
          selected: false,
          menuLevel: 'sub_menu',
          url: 'http://ch2ho.bible25.com/m/bbs_renew/board.php?bo_table=jewel'
      })
      .set('today_menu7', {
          name: '말씀',
          page: 'HomePage',
          selected: false,
          menuLevel: 'sub_menu',
          url: 'http://www.naver.com'
      })
      .set('today_menu8', {
          name: '손편지',
          page: 'HomePage',
          selected: false,
          menuLevel: 'sub_menu',
          url: 'http://ch2ho.bible25.com/m/bbs_renew/board.php?bo_table=calli'
      })
      .set('christian_news', {
          name: '기독뉴스',
          page: 'HomePage',
          selected: false,
          menuLevel: 'top_menu',
          url: 'http://ch2ho.bible25.com/m/gyogye_news.php'
      })
      .set('bible_research', {
          name: '성경연구',
          page: 'HomePage',
          selected: false,
          menuLevel: 'top_menu',
          url: 'http://ch2ho.bible25.com/m/contents_renew.php'
      })
      .set('bible_dictionary', {
          name: '성경사전',
          page: 'HomePage',
          selected: false,
          menuLevel: 'top_menu',
        //   url: 'http://ch2ho.bible25.com/m/deluxe_bible_renew/list_lexicom1.php?bo_id=bibled'
          url: 'http://ch2ho.bible25.com/m/deluxe_bible_renew/list_lexicom1_renew.php?bo_id=bibled'
      })
      .set('new_guide', {
          name: '새신자가이드',
          page: 'HomePage',
          selected: false,
          menuLevel: 'top_menu',
        //   url: 'http://ch2ho.bible25.com/m/deluxe_bible/list_depth1.php?bo_id=newbeliever'
          url: 'http://ch2ho.bible25.com/m/deluxe_bible_renew/list_depth1.php?bo_id=newbeliever'
      })
      .set('photo_bible', {
          name: '포토성경사전',
          page: 'HomePage',
          selected: false,
          menuLevel: 'top_menu',
        //   url: 'http://ch2ho.bible25.com/m/bbs/board.php?bo_table=photo_bible_dic&array_num=14'
          url: 'http://ch2ho.bible25.com/m/bbs_renew/board.php?bo_table=photo_bible_dic'
      })
      .set('bible', {
          name: '성경',
          page: 'BiblePage',
          selected: false,
          menuLevel: 'top_menu',
          url: ''
      })
      .set('hymn', {
          name: '찬송',
          page: 'HymnPage',
          selected: false,
          menuLevel: 'top_menu',
          url: ''
      })
      .set('bible_menu', {
          name: '성경',
          page: '',
          selected: false,
          menuLevel: 'sub_menu',
          url: ''
      })
      .set('bible_menu1', {
          name: 'Study',
          page: '',
          selected: false,
          menuLevel: 'sub_menu',
          url: 'tab1'
      })
      .set('bible_menu2', {
          name: '해설',
          page: '',
          selected: false,
          menuLevel: 'sub_menu',
          url: 'tab2'
      })
      .set('bible_menu3', {
          name: '핵심',
          page: '',
          selected: false,
          menuLevel: 'sub_menu',
          url: 'tab5'
      })
      .set('bible_menu4', {
          name: '묵상',
          page: '',
          selected: false,
          menuLevel: 'sub_menu',
          url: 'tab3'
      })
      .set('bible_menu5', {
          name: 'Q&A',
          page: '',
          selected: false,
          menuLevel: 'sub_menu',
          url: 'tab4'
      })
      .set('bible_menu6', {
          name: '포토',
          page: '',
          selected: false,
          menuLevel: 'sub_menu',
          url: 'tab6'
      })
      .set('gyodok', {
          name: '교독문',
          page: 'GyodokPage',
          selected: false,
          menuLevel: 'top_menu',
          url: ''
      })
      .set('bibleLearn', {
          name: '교독문',
          page: 'LearnBiblePage',
          selected: false,
          menuLevel: 'top_menu',
          url: ''
      })
      .set('posmall', {
          name: 'BibleMall',
          page: '',
          selected: false,
          menuLevel: 'top_menu',
          url: 'https://www.pos-mall.co.kr:448/bible/bibleMembership.do'
      })
      .set('showAd', {
          name: 'showAd',
          page: '',
          selected: false,
          menuLevel: 'top_menu',
          url: 'http://bible25ad.bible25.com/bible25ad/ad/mobile_main_popup_ad/index_page.php'
      })
      .set('search', {
          name: '목회자수첩검색',
          page: '',
          selected: false,
          menuLevel: 'top_menu',
          url: 'http://ministrynote.com/bbs/search_bible25.php?sfl=wr_subject&sop=and&stx='
      })
      .set('moindaum', {
          name: '기독교백화점',
          page: '',
          selected: false,
          menuLevel: 'top_menu',
          url: 'http://moindaum.com/ms58951376/store_shop_list05?__blank'
      })
      .set('health', {
          name: '홀리헬스',
          page: '',
          selected: false,
          menuLevel: 'top_menu',
          url: 'm.holy-health.co.kr/?phone_num=&phone_num='
      })

  constructor() {

  }

}
