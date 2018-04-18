import { Injectable } from '@angular/core';

@Injectable()
export class MenuProvider {

  public MenuData = new Map()
      .set('home', {
          name: '홈',
          page: 'HomePage',
          menuLevel: 'top_menu',
          selected: false,
          url: 'http://ch2ho.bible25.com/m/main_renewal_android.php'
      })
      .set('today_menu1', {
          name: '말씀따라',
          page: 'HomePage',
          menuLevel: 'sub_menu',
          selected: false,
          url: 'http://ch2ho.bible25.com/m/bless/today10.php?bo_id=grace&array_num=5'
      })
      .set('today_menu2', {
          name: '컬럼',
          page: 'HomePage',
          menuLevel: 'sub_menu',
          selected: false,
          url: 'http://ch2ho.bible25.com/m/bless/today3.php?bo_id=comm6'
      })
      .set('today_menu3', {
          name: '십자가',
          page: 'HomePage',
          selected: false,
          menuLevel: 'sub_menu',
          url: 'http://ch2ho.bible25.com/m/bless/today2.php?bo_id=comm5'
      })
      .set('today_menu4', {
          name: '메일아침',
          page: 'HomePage',
          selected: false,
          menuLevel: 'sub_menu',
          url: 'http://ch2ho.bible25.com/m/bless/today1.php?bo_id=comm2'
      })
      .set('today_menu5', {
          name: '오늘한컷',
          page: 'HomePage',
          selected: false,
          menuLevel: 'sub_menu',
          url: 'http://ch2ho.bible25.com/m/bless/today7.php?bo_id=calligraphy'
      })
      .set('today_menu6', {
          name: '축복기도문',
          page: 'HomePage',
          selected: false,
          menuLevel: 'sub_menu',
          url: 'http://ch2ho.bible25.com/m/bless/today10.php?bo_id=jewel&array_num=5'
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
          url: 'http://ch2ho.bible25.com/m/bless/today6.php?bo_id=calli'
      })
      .set('christian_news', {
          name: '기독뉴스',
          page: 'HomePage',
          selected: false,
          menuLevel: 'top_menu',
          url: 'http://www.naver.com'
      })
      .set('bible_research', {
          name: '성경연구',
          page: 'HomePage',
          selected: false,
          menuLevel: 'top_menu',
          url: 'http://ch2ho.bible25.com/m/contents.php'
      })
      .set('bible_dictionary', {
          name: '성경사전',
          page: 'HomePage',
          selected: false,
          menuLevel: 'top_menu',
          url: 'http://ch2ho.bible25.com/m/deluxe_bible/list_lexicom1.php?bo_id=bibled'
      })
      .set('new_guide', {
          name: '새신자가이드',
          page: 'HomePage',
          selected: false,
          menuLevel: 'top_menu',
          url: 'http://www.naver.com'
      })
      .set('photo_bible', {
          name: '포토성경사전',
          page: 'HomePage',
          selected: false,
          menuLevel: 'top_menu',
          url: 'http://ch2ho.bible25.com/m/bbs/board.php?bo_table=photo_bible_dic&array_num=14'
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
          page: 'LearnBibleDetailPage',
          selected: false,
          menuLevel: 'top_menu',
          url: ''
      })

  constructor() {

  }

}
