import { ref, computed, watch, markRaw, onMounted } from 'vue'
import SelectCards from '~/components/onboarding/inputs/SelectCards.vue'
import SelectDropdown from '~/components/onboarding/inputs/SelectDropdown.vue'
import TextInput from '~/components/onboarding/inputs/TextInput.vue'
import SelectCardsWithFilter from '~/components/onboarding/inputs/SelectCardsWithFilter.vue'
import SelectSchoolWithSearch from '~/components/onboarding/inputs/SelectSchoolWithSearch.vue'
import GraduationYearSelect from '~/components/onboarding/inputs/GraduationYearSelect.vue'
import TextInputWithNotes from '~/components/onboarding/inputs/TextInputWithNotes.vue'
import EmploymentPeriodSelect from '~/components/onboarding/inputs/EmploymentPeriodSelect.vue'
import AnnualIncomeInput from '~/components/onboarding/inputs/AnnualIncomeInput.vue'
import CertificationInput from '~/components/onboarding/inputs/CertificationInput.vue'
import IndustrySelect from '~/components/onboarding/inputs/IndustrySelect.vue'
import JobCategorySelect from '~/components/onboarding/inputs/JobCategorySelect.vue'
import IndustryMediumSelect from '~/components/onboarding/inputs/IndustryMediumSelect.vue'
import PastJobCategorySelect from '~/components/onboarding/inputs/PastJobCategorySelect.vue'
import JobExperienceYearsInput from '~/components/onboarding/inputs/JobExperienceYearsInput.vue'

const STORAGE_KEY = 'onboarding_answers'

interface Step {
  id: string
  label: string
}

interface SmallCategory {
  value: string
  label: string
}

interface MediumCategory {
  value: string
  label: string
  children: SmallCategory[]
}

interface LargeCategory {
  value: string
  label: string
  subtitle: string
  children: MediumCategory[]
}

interface Question {
  id: string
  stepId: string
  highlight: string
  text: string
  component: any
  options?: any[]
  dropdowns?: any[]
  placeholder?: string
  defaultValue: any
  isRequired?: boolean
  selectedLabel?: string
  categoryData?: LargeCategory[]  // ← この行を追加
}

// 年の選択肢を生成
const generateYearOptions = () => {
  const currentYear = new Date().getFullYear()
  const years = []
  for (let y = currentYear; y >= 1950; y--) {
    years.push({ value: String(y), label: `${y}` })
  }
  return years
}

// 月の選択肢を生成
const generateMonthOptions = () => {
  return Array.from({ length: 12 }, (_, i) => ({
    value: String(i + 1),
    label: `${i + 1}`
  }))
}

// 言語
const languageOptions = [
  { value: 'japanese', label: '日本語' },
  { value: 'english', label: '英語' },
  { value: 'mandarin', label: '北京語' },
  { value: 'cantonese', label: '広東語' },
  { value: 'korean', label: '韓国・朝鮮語' },
  { value: 'french', label: 'フランス語' },
  { value: 'german', label: 'ドイツ語' },
  { value: 'spanish', label: 'スペイン語' },
  { value: 'thai', label: 'タイ語' },
  { value: 'indonesian', label: 'インドネシア語' },
  { value: 'italian', label: 'イタリア語' },
  { value: 'russian', label: 'ロシア語' },
  { value: 'portuguese', label: 'ポルトガル語' },
  { value: 'malay', label: 'マレーシア語' },
  { value: 'vietnamese', label: 'ベトナム語' },
  { value: 'arabic', label: 'アラビア語' },
  { value: 'tagalog', label: 'タガログ語' },
  { value: 'taiwanese', label: '台湾語' },
  { value: 'dutch', label: 'オランダ語' },
  { value: 'swedish', label: 'スウェーデン語' },
  { value: 'hindi', label: 'ヒンディー語' },
  { value: 'other', label: 'その他' }
]

const regionOptions = [
  { value: 'hokkaido', label: '北海道' },
  { value: 'tohoku', label: '東北' },
  { value: 'kanto', label: '関東' },
  { value: 'chubu', label: '中部' },
  { value: 'kinki', label: '近畿' },
  { value: 'chugoku', label: '中国' },
  { value: 'shikoku', label: '四国' },
  { value: 'kyushu_okinawa', label: '九州・沖縄' }
]

const prefecturesByRegion: Record<string, typeof prefectureOptions> = {
  hokkaido: [
    { value: 'hokkaido', label: '北海道' }
  ],
  tohoku: [
    { value: 'aomori', label: '青森県' },
    { value: 'iwate', label: '岩手県' },
    { value: 'miyagi', label: '宮城県' },
    { value: 'akita', label: '秋田県' },
    { value: 'yamagata', label: '山形県' },
    { value: 'fukushima', label: '福島県' }
  ],
  kanto: [
    { value: 'ibaraki', label: '茨城県' },
    { value: 'tochigi', label: '栃木県' },
    { value: 'gunma', label: '群馬県' },
    { value: 'saitama', label: '埼玉県' },
    { value: 'chiba', label: '千葉県' },
    { value: 'tokyo', label: '東京都' },
    { value: 'kanagawa', label: '神奈川県' }
  ],
  chubu: [
    { value: 'niigata', label: '新潟県' },
    { value: 'toyama', label: '富山県' },
    { value: 'ishikawa', label: '石川県' },
    { value: 'fukui', label: '福井県' },
    { value: 'yamanashi', label: '山梨県' },
    { value: 'nagano', label: '長野県' },
    { value: 'gifu', label: '岐阜県' },
    { value: 'shizuoka', label: '静岡県' },
    { value: 'aichi', label: '愛知県' }
  ],
  kinki: [
    { value: 'mie', label: '三重県' },
    { value: 'shiga', label: '滋賀県' },
    { value: 'kyoto', label: '京都府' },
    { value: 'osaka', label: '大阪府' },
    { value: 'hyogo', label: '兵庫県' },
    { value: 'nara', label: '奈良県' },
    { value: 'wakayama', label: '和歌山県' }
  ],
  chugoku: [
    { value: 'tottori', label: '鳥取県' },
    { value: 'shimane', label: '島根県' },
    { value: 'okayama', label: '岡山県' },
    { value: 'hiroshima', label: '広島県' },
    { value: 'yamaguchi', label: '山口県' }
  ],
  shikoku: [
    { value: 'tokushima', label: '徳島県' },
    { value: 'kagawa', label: '香川県' },
    { value: 'ehime', label: '愛媛県' },
    { value: 'kochi', label: '高知県' }
  ],
  kyushu_okinawa: [
    { value: 'fukuoka', label: '福岡県' },
    { value: 'saga', label: '佐賀県' },
    { value: 'nagasaki', label: '長崎県' },
    { value: 'kumamoto', label: '熊本県' },
    { value: 'oita', label: '大分県' },
    { value: 'miyazaki', label: '宮崎県' },
    { value: 'kagoshima', label: '鹿児島県' },
    { value: 'okinawa', label: '沖縄県' }
  ]
}

// ダミーの市区町村データ(主要都市含む)
const dummyCityOptions = [
  // 主要都市
  { value: 'kitakyushu', label: '北九州市', kana: 'きたきゅうしゅうし', isMajor: true },
  { value: 'fukuoka', label: '福岡市', kana: 'ふくおかし', isMajor: true },
  
  // 通常の市区町村
  { value: 'akamura', label: '赤村', kana: 'あかむら' },
  { value: 'ashiya', label: '朝倉市', kana: 'あさくらし' },
  { value: 'ashiya-town', label: '芦屋町', kana: 'あしやまち' },
  { value: 'iizuka', label: '飯塚市', kana: 'いいづかし' },
  { value: 'ukiha', label: 'うきは市', kana: 'うきはし' },
  { value: 'okawa', label: '大川市', kana: 'おおかわし' },
  { value: 'oki-town', label: '大木町', kana: 'おおきまち' },
  { value: 'omuta', label: '大牟田市', kana: 'おおむたし' },
  { value: 'okagaki', label: '岡垣町', kana: 'おかがきまち' },
  { value: 'onga', label: '遠賀町', kana: 'おんがちょう' },
  { value: 'kotake', label: '小竹町', kana: 'こたけまち' }
]


// 最終学歴
const educationOptions = [
  { value: 'university', label: '大学' }, 
  { value: 'graduate', label: '大学院' },
  { value: 'junior_college', label: '短期大学' },
  { value: 'vocational', label: '専門学校' },
  { value: 'technical_college', label: '高等専門学校' },
  { value: 'high_school', label: '高等学校' },
  { value: 'junior_high', label: '中学校' }
]

const dummySchoolOptions = [
  { value: 'aichi-gakuin', label: '愛国学園大学', kana: 'あいこくがくえんだいがく' },
  { value: 'aichi-medical', label: '愛知医科大学', kana: 'あいちいかだいがく' },
  { value: 'aichi-gakuin-2', label: '愛知学院大学', kana: 'あいちがくいんだいがく' },
  { value: 'aichi-gakusen', label: '愛知学泉大学', kana: 'あいちがくせんだいがく' },
  { value: 'aichi-kyoiku', label: '愛知教育大学', kana: 'あいちきょういくだいがく' },
  { value: 'aichi-prefectural', label: '愛知県立大学', kana: 'あいちけんりつだいがく' },
  { value: 'aichi-geijutsu', label: '愛知県立芸術大学', kana: 'あいちけんりつげいじゅつだいがく' },
  { value: 'aichi-kogyo', label: '愛知工科大学', kana: 'あいちこうかだいがく' },
  { value: 'aichi-kogyodaigaku', label: '愛知工業大学', kana: 'あいちこうぎょうだいがく' },
  { value: 'aichi-sangyo', label: '愛知産業大学', kana: 'あいちさんぎょうだいがく' },
  { value: 'aichi-shukutoku', label: '愛知淑徳大学', kana: 'あいちしゅくとくだいがく' },
  { value: 'aichi-shinnshiro', label: '愛知新城大谷大学', kana: 'あいちしんしろおおたにだいがく' },
  { value: 'aichi-toho', label: '愛知東邦大学', kana: 'あいちとうほうだいがく' },
  { value: 'aichi', label: '愛知大学', kana: 'あいちだいがく' },
  { value: 'aichi-bunkyo', label: '愛知文教大学', kana: 'あいちぶんきょうだいがく' },
  { value: 'aichi-mizuho', label: '愛知みずほ大学', kana: 'あいちみずほだいがく' },
  { value: 'aizu', label: '会津大学', kana: 'あいづだいがく' }
]

const facultyOptions = [
  { value: 'law_policy', label: '法学・政策系' },
  { value: 'economics_business', label: '経済・経営系' },
  { value: 'commerce', label: '商学系' },
  { value: 'sociology', label: '社会学系' },
  { value: 'international', label: '国際関係系' },
  { value: 'foreign_language', label: '外国語系' },
  { value: 'literature', label: '文学系' },
  { value: 'psychology', label: '心理学系' },
  { value: 'history_geography', label: '歴史・地理学系' },
  { value: 'information', label: '情報系' },
  { value: 'electrical_electronic', label: '電気・電子・制御系' },
  { value: 'mechanical', label: '機械系' },
  { value: 'mathematics', label: '数学系' },
  { value: 'applied_physics', label: '応用物理学数理物理系' },
  { value: 'chemistry', label: '化学・物質系' },
  { value: 'earth_science', label: '地学・地球科学系' },
  { value: 'metal', label: '金属系' },
  { value: 'architecture', label: '建築系' },
  { value: 'civil_engineering', label: '土木系' },
  { value: 'biology', label: '生物系' },
  { value: 'medicine', label: '医学系' },
  { value: 'nursing_medical', label: '看護・医療技術系' },
  { value: 'veterinary', label: '獣医学系' },
  { value: 'pharmacy', label: '薬学系' },
  { value: 'dentistry', label: '歯学系' },
  { value: 'agriculture', label: '農業・農学系' },
  { value: 'fisheries', label: '水産・海洋系' },
  { value: 'livestock', label: '畜産・酪農系' },
  { value: 'education', label: '教育系' },
  { value: 'welfare', label: '福祉・介護系' },
  { value: 'health_physical', label: '保健・体育系' },
  { value: 'home_economics', label: '家政・栄養系' },
  { value: 'theology', label: '宗教・神学系' },
  { value: 'arts_music', label: '芸術・音楽系' },
  { value: 'other', label: 'その他学部' }
]

// 専門学校の分野
const vocationalFieldOptions = [
  { value: 'public_service', label: '公務員・法律・政治系' },
  { value: 'business', label: 'ビジネス系' },
  { value: 'language_international', label: '語学・国際系' },
  { value: 'travel_tourism', label: '旅行・観光・ホテル・エアライン系' },
  { value: 'bridal', label: 'ブライダル系' },
  { value: 'media', label: 'マスコミ・芸能・声優・出版系' },
  { value: 'music_event', label: '音楽・イベント・映像系' },
  { value: 'anime_manga', label: 'アニメ・マンガ・イラスト系' },
  { value: 'game', label: 'ゲーム系' },
  { value: 'it', label: 'IT系' },
  { value: 'design_art', label: 'デザイン・芸術系' },
  { value: 'fashion', label: 'ファッション・服飾系' },
  { value: 'automobile', label: '自動車系' },
  { value: 'aviation', label: '航空・鉄道・船舶・宇宙系' },
  { value: 'engineering', label: '機械・電気・電子・化学系' },
  { value: 'architecture', label: '建築・土木・インテリア系' },
  { value: 'animal', label: '動物・畜産・水産系' },
  { value: 'environment', label: '植物・環境・バイオ系' },
  { value: 'beauty', label: '美容・理容系' },
  { value: 'makeup', label: 'メイク・ネイル・エステ系' },
  { value: 'childcare', label: '保育・教育系' },
  { value: 'welfare', label: '福祉系' },
  { value: 'medical', label: '医療・看護系' },
  { value: 'sports', label: 'スポーツ系' },
  { value: 'nutrition', label: '栄養・調理・製菓・製パン系' },
  { value: 'other', label: 'その他' }
]

const getGraduationAge = (education: string): number => {
  const ageMap: Record<string, number> = {
    'graduate': 24,      // 大学院
    'university': 22,    // 大学
    'junior_college': 20, // 短大
    'vocational': 20,    // 専門学校
    'technical_college': 20, // 高等専門学校
    'high_school': 18,   // 高校
    'junior_high': 15    // 中学
  }
  return ageMap[education] || 22
}

// 卒業年を計算(生年月日と学歴から)
const calculateGraduationYear = (birthYear: number, education: string): number => {
  const graduationAge = getGraduationAge(education)
  return birthYear + graduationAge
}

// 経験社数
const companyCountOptions = [
  { value: '0', label: '0社' },
  { value: '1', label: '1社' },
  { value: '2', label: '2社' },
  { value: '3', label: '3社' },
  { value: '4', label: '4社' },
  { value: '5', label: '5社' },
  { value: '6', label: '6社' },
  { value: '7', label: '7社' },
  { value: '8', label: '8社' },
  { value: '9', label: '9社' },
  { value: '10', label: '10社以上' }
]

// 雇用形態
const employmentTypeOptions = [
  { value: 'fulltime', label: '正社員' },
  { value: 'contract', label: '契約社員' },
  { value: 'parttime', label: 'パート・アルバイト' },
  { value: 'dispatch', label: '派遣社員' },
  { value: 'freelance', label: '業務委託・フリーランス' },
  { value: 'intern', label: 'インターン' }
]

// 従業員数
const employeeSizeOptions = [
  { value: 'under10', label: '10人未満' },
  { value: '10-29', label: '10〜29人' },
  { value: '30-99', label: '30〜99人' },
  { value: '100-299', label: '100〜299人' },
  { value: '300-999', label: '300〜999人' },
  { value: '1000-2999', label: '1000〜2999人' },
  { value: 'over3000', label: '3000人以上' }
]

// 役職
const positionOptions = [
  { value: 'none', label: '役職なし' },
  { value: 'leader', label: '係長／リーダークラス' },
  { value: 'manager', label: '課長／マネージャー' },
  { value: 'director', label: '部長／ゼネラルマネージャークラス' },
  { value: 'executive', label: '役員クラス' },
  { value: 'president', label: '代表・社長' }
]

// 職種大分類（後でAPI化 - 3層構造）
const jobCategoryOptions = [
  { value: 'sales', label: '営業' },
  { value: 'marketing', label: 'マーケティング・企画' },
  { value: 'it_engineer', label: 'ITエンジニア' },
  { value: 'creative', label: 'クリエイティブ' },
  { value: 'back_office', label: '管理・バックオフィス' },
  { value: 'consulting', label: 'コンサルタント' },
  { value: 'service', label: 'サービス・販売' },
  { value: 'manufacturing', label: '製造・技術' },
  { value: 'medical', label: '医療・福祉' },
  { value: 'other', label: 'その他' }
]

// 過去の職種カテゴリデータ(3層構造)
const pastJobCategoryData: LargeCategory[] = [
  {
    value: 'sales',
    label: '営業',
    subtitle: '金融／不動産／メーカー／IT／人材／商社／建設／医療／その他',
    children: [
      {
        value: 'financial_sales',
        label: '金融営業',
        children: [
          { value: 'corporate_finance', label: '法人営業' },
          { value: 'individual_finance', label: '個人営業' },
          { value: 'risk_management', label: 'リスク管理' }
        ]
      },
      {
        value: 'real_estate_sales',
        label: '不動産営業(販売／仲介／土地活用／リフォーム)',
        children: [
          { value: 'property_sales', label: '物件販売' },
          { value: 'brokerage', label: '仲介' },
          { value: 'land_use', label: '土地活用' }
        ]
      }
    ]
  },
  {
    value: 'service',
    label: 'サービス',
    subtitle: '教育／保育／美容／コールセンター／旅行／冠婚葬祭／通訳／交通／運輸／警備／清掃／その他',
    children: [
      {
        value: 'education',
        label: '教育／保育',
        children: [
          { value: 'teacher', label: '教師' },
          { value: 'childcare', label: '保育士' },
          { value: 'tutor', label: '塾講師' }
        ]
      },
      {
        value: 'beauty',
        label: '美容',
        children: [
          { value: 'hairdresser', label: '美容師' },
          { value: 'esthetician', label: 'エステティシャン' },
          { value: 'nail_artist', label: 'ネイリスト' }
        ]
      }
    ]
  }
]

// 業種大分類
const industryLargeOptions = [
  { value: 'manufacturer_goods', label: 'メーカー（部品製造／加工）' },
  { value: 'manufacturer_electric', label: 'メーカー（電気／機械）' },
  { value: 'manufacturer_energy', label: 'メーカー（鉱業／資源／エネルギー／化学／素材）' },
  { value: 'manufacturer_food', label: 'メーカー（食料品／飲料／たばこ／飼料）' },
  { value: 'manufacturer_cosmetics', label: 'メーカー（化粧品／トイレタリー／日用品／消費財）' },
  { value: 'manufacturer_apparel', label: 'メーカー（アパレル／ファッション／寝具／インテリア）' },
  { value: 'it_internet', label: 'IT／インターネット／ゲーム／通信' },
  { value: 'medical', label: 'メディカル（メーカー／商社／医療機関／医療サービス）' },
  { value: 'welfare', label: '福祉介護／保健衛生／療術' },
  { value: 'trading', label: '総合商社' },
  { value: 'trading_machinery', label: '専門商社（機械部品／金属部品）' },
  { value: 'trading_electric', label: '専門商社（電気／機械）' },
  { value: 'trading_energy', label: '専門商社（鉱業／資源／エネルギー／化学／素材）' },
  { value: 'trading_food', label: '専門商社（食料品／飲料／たばこ／飼料）' },
  { value: 'trading_cosmetics', label: '専門商社（化粧品／トイレタリー／日用品／消費財）' },
  { value: 'trading_apparel', label: '専門商社（アパレル／ファッション／寝具／インテリア）' },
  { value: 'construction', label: '建設／プラント／不動産' },
  { value: 'finance', label: '金融' },
  { value: 'technical', label: '技術サービス' },
  { value: 'consulting', label: 'コンサルティング／リサーチ' }
]

// 業種中分類のマッピング(拡充版)
const industryMediumOptions: Record<string, any[]> = {
  'it_internet': [
    { value: 'software', label: 'ソフトウェア／パッケージベンダ' },
    { value: 'web_service', label: 'Webサービス／Webメディア' },
    { value: 'game', label: 'ゲーム' },
    { value: 'system_integration', label: 'システムインテグレーター' },
    { value: 'internet_service', label: 'インターネットサービス' }
  ],
  'manufacturer_electric': [
    { value: 'electronics', label: '電子機器' },
    { value: 'semiconductor', label: '半導体' },
    { value: 'precision_machinery', label: '精密機械' }
  ],
  'trading': [
    { value: 'general_trading', label: '総合商社' }
  ],
  'construction': [
    { value: 'general_construction', label: '総合建設' },
    { value: 'real_estate', label: '不動産' }
  ],
  'finance': [
    { value: 'banking', label: '銀行' },
    { value: 'securities', label: '証券' },
    { value: 'insurance', label: '保険' }
  ]
}

const jobDetailOptions: Record<string, any[]> = {
  // ソフトウェア関連(既存)
  'software': [
    { value: 'engineer', label: 'エンジニア' },
    { value: 'pm', label: 'プロジェクトマネージャー' },
    { value: 'sales', label: '営業' },
    { value: 'consultant', label: 'コンサルタント' }
  ],
  'web_service': [
    { value: 'web_engineer', label: 'Webエンジニア' },
    { value: 'designer', label: 'デザイナー' },
    { value: 'director', label: 'ディレクター' }
  ],
  'game': [
    { value: 'game_developer', label: 'ゲーム開発' },
    { value: 'game_planner', label: 'ゲームプランナー' },
    { value: 'game_designer', label: 'ゲームデザイナー' }
  ],
  
  // 電子機器の小分類
  'electronics': [
    { value: 'electronics_rd', label: '研究開発' },
    { value: 'electronics_design', label: '設計・開発' },
    { value: 'electronics_production', label: '生産技術' },
    { value: 'electronics_quality', label: '品質管理' },
    { value: 'electronics_sales', label: '営業・販売' },
    { value: 'electronics_pm', label: 'プロジェクトマネージャー' }
  ],
  
  // 半導体の小分類
  'semiconductor': [
    { value: 'semiconductor_design', label: '回路設計' },
    { value: 'semiconductor_layout', label: 'レイアウト設計' },
    { value: 'semiconductor_verification', label: '検証・評価' },
    { value: 'semiconductor_process', label: 'プロセス開発' },
    { value: 'semiconductor_equipment', label: '装置エンジニア' },
    { value: 'semiconductor_sales', label: '営業・技術営業' }
  ],
  
  // 精密機械の小分類
  'precision_machinery': [
    { value: 'precision_mechanical_design', label: '機械設計' },
    { value: 'precision_electrical_design', label: '電気設計' },
    { value: 'precision_control', label: '制御設計' },
    { value: 'precision_production', label: '生産技術' },
    { value: 'precision_maintenance', label: '保守・メンテナンス' },
    { value: 'precision_sales', label: '営業・技術営業' }
  ]
}


export const useOnboarding = () => {
  const steps: Step[] = [
    { id: 'profile', label: 'プロフィール' },
    { id: 'work-history', label: '職務経歴' },
    { id: 'experience', label: '実務経験' },
    { id: 'skills', label: '語学・資格' }
  ]

  const questions: Question[] = [
    // ===== プロフィール =====
{
  id: 'gender',
  stepId: 'profile',
  highlight: '性別',
  text: 'を教えてください',
  component: markRaw(SelectCards),
  options: [
    { value: 'male', label: '男性', icon: 'male' },
    { value: 'female', label: '女性', icon: 'female' }
  ],
  defaultValue: ''
},
{
  id: 'birthdate',
  stepId: 'profile',
  highlight: '生まれた年と月',
  text: 'を教えてください',
  component: markRaw(SelectDropdown),
  dropdowns: [
    { key: 'year', placeholder: '選択', label: '年', width: '120px', options: generateYearOptions() },
    { key: 'month', placeholder: '選択', label: '月', width: '100px', options: generateMonthOptions() }
  ],
  defaultValue: { year: '', month: '' }
},
    {
      id: 'language',
      stepId: 'profile',
      highlight: '第一言語',
      text: 'を教えてください',
      component: markRaw(SelectCards),
      options: languageOptions,
      defaultValue: ''
    },
    {
  id: 'region',
  stepId: 'profile',
  highlight: 'お住まいの地域',
  text: 'を教えてください',
  component: markRaw(SelectCards),
  options: regionOptions,
  defaultValue: ''
},
{
  id: 'prefecture',
  stepId: 'profile',
  highlight: 'お住まいの都道府県',
  text: 'を教えてください',
  component: markRaw(SelectCards),
  options: [],
  defaultValue: ''
},
{
  id: 'city',
  stepId: 'profile',
  highlight: 'お住まいの市区町村',
  text: 'を教えてください',
  component: markRaw(SelectCardsWithFilter),
  options: dummyCityOptions,
  defaultValue: ''
},
{
  id: 'education',
  stepId: 'profile',
  highlight: '最終学歴',
  text: 'を教えてください',
  component: markRaw(SelectCards),
  options: educationOptions,
  featuredFirst: true, 
  defaultValue: ''
},
// [8] 学校名選択(大学/大学院/短大用)
{
  id: 'school_name',
  stepId: 'profile',
  highlight: '学校名',
  text: 'を教えてください',
  component: markRaw(SelectSchoolWithSearch),
  options: dummySchoolOptions,
  defaultValue: ''
},

// [9] 学校名入力(高等専門学校用)
{
  id: 'technical_school_name',
  stepId: 'profile',
  highlight: '学校名',
  text: 'を教えてください',
  component: markRaw(TextInput),
  placeholder: '例: 〇〇高等専門学校',
  defaultValue: ''
},

// [10] 学部・学科(大学/大学院/短大用)
{
  id: 'faculty',
  stepId: 'profile',
  highlight: '学部・学科',
  text: 'を教えてください',
  component: markRaw(SelectCards),
  options: facultyOptions,
  defaultValue: ''
},

// [11] 専門分野(専門学校用)
{
  id: 'vocational_field',
  stepId: 'profile',
  highlight: '専門分野',
  text: 'を教えてください',
  component: markRaw(SelectCards),
  options: vocationalFieldOptions,
  defaultValue: ''
},
{
  id: 'graduation_year',
  stepId: 'profile',
  highlight: '卒業年',
  text: 'を教えてください',
  component: markRaw(GraduationYearSelect),
  defaultValue: ''
},

    // ===== 職務経歴 =====
{
  id: 'company_count',
  stepId: 'work-history',
  highlight: '経験社数',
  text: 'を教えてください',
  component: markRaw(SelectCards),
  options: companyCountOptions,
  defaultValue: ''
},
{
  id: 'current_company',
  stepId: 'work-history',
  highlight: '現在(または直近)の就業先',
  text: 'を教えてください',
  component: markRaw(TextInputWithNotes),
  placeholder: '就業先の企業名・団体名を入力',
  notes: [
    '市場価値をより正確に診断するため入力してください。なお入力した企業・団体にあなたの情報が公開されることはありません。',
    '現在はたらいていない場合は、直近の就業先を入力してください。'
  ],
  defaultValue: ''
},
    {
      id: 'employment_type',
      stepId: 'work-history',
      highlight: '雇用形態',
      text: 'を教えてください',
      component: markRaw(SelectCards),
      options: employmentTypeOptions,
      defaultValue: ''
    },
{
  id: 'employment_period',
  stepId: 'work-history',
  highlight: '入社年月（退職年月）',
  text: 'を教えてください',
  component: markRaw(EmploymentPeriodSelect),
  defaultValue: {
    joinYear: '',
    joinMonth: '',
    isCurrentJob: false,
    leaveYear: '',
    leaveMonth: ''
  }
},
    {
      id: 'job_industry_large',
      stepId: 'work-history',
      highlight: '関わった主な事業',
      text: 'を1つ教えてください',
      component: markRaw(IndustrySelect),
      options: industryLargeOptions,
      placeholder: '例：飲食、医療、人材、アパレル、配送など',
      defaultValue: '',
      selectedLabel: ''
    },
{
  id: 'job_industry_medium',
  stepId: 'work-history',
  highlight: '関わった主な事業',
  text: 'をさらに詳しく教えてください',
  component: markRaw(IndustryMediumSelect),  // ← JobCategorySelect から変更
  options: [], // 動的に設定
  defaultValue: '',
  selectedLabel: ''
},
    {
      id: 'job_category_detail',
      stepId: 'work-history',
      highlight: '関わった主な職種',
      text: 'を教えてください',
      component: markRaw(JobCategorySelect),
      options: [], // 動的に設定
      defaultValue: '',
      selectedLabel: ''
    },
    {
      id: 'employee_size',
      stepId: 'work-history',
      highlight: '従業員数',
      text: 'を教えてください',
      component: markRaw(SelectCards),
      options: employeeSizeOptions,
      defaultValue: ''
    },
    {
      id: 'position',
      stepId: 'work-history',
      highlight: '役職',
      text: 'を教えてください',
      component: markRaw(SelectCards),
      options: positionOptions,
      defaultValue: ''
    },
{
  id: 'annual_income',
  stepId: 'work-history',
  highlight: '年収',
  text: 'を教えてください',
  component: markRaw(AnnualIncomeInput),
  placeholder: '例: 450(万円)',
  defaultValue: '300'  // ← ここを '' から '300' に変更
},
{
  id: 'past_job_category',
  stepId: 'experience',
  highlight: '過去に経験した職種',
  text: 'を教えてください(複数回答可)',
  component: markRaw(PastJobCategorySelect),
  categoryData: pastJobCategoryData,  // ← 追加
  defaultValue: [],  // 配列に変更
  isRequired: false  // 任意
},
{
  id: 'job_experience_years_at_company',
  stepId: 'experience',
  highlight: '直近の企業での経験年数',
  text: 'を教えてください',
  component: markRaw(JobExperienceYearsInput),
  defaultValue: {},
  isRequired: false
},
{
      id: 'management_years',
      stepId: 'experience',
      highlight: 'マネジメント経験年数',
      text: 'を教えてください',
      component: markRaw(SelectCards),
      options: [
        { value: 'none', label: '経験なし' },
        { value: 'less_than_1', label: '1年未満' },
        { value: '1+', label: '1年以上' },
        { value: '2+', label: '2年以上' },
        { value: '3+', label: '3年以上' },
        { value: '4+', label: '4年以上' },
        { value: '5+', label: '5年以上' },
        { value: '6+', label: '6年以上' },
        { value: '7+', label: '7年以上' },
        { value: '8+', label: '8年以上' },
        { value: '9+', label: '9年以上' },
        { value: '10+', label: '10年以上' }
      ],
      defaultValue: ''
    },
    {
      id: 'management_team_size',
      stepId: 'experience',
      highlight: 'マネジメント経験人数',
      text: 'を教えてください',
      component: markRaw(SelectCards),
      options: [
        { value: '1-4', label: '1〜4人' },
        { value: '5-9', label: '5〜9人' },
        { value: '10-29', label: '10〜29人' },
        { value: '30-99', label: '30〜99人' },
        { value: '100+', label: '100人以上' }
      ],
      defaultValue: ''
    },

    // ===== 語学・資格 =====
{
      id: 'language_skills',
      stepId: 'skills',
      highlight: '英語力',
      text: 'について教えてください',
      component: markRaw(SelectCards),
      options: [
        { value: 'native', label: 'ネイティブレベル' },
        { value: 'business', label: 'ビジネス会話レベル' },
        { value: 'daily', label: '日常会話レベル' },
        { value: 'none', label: '当てはまるものはない' }
      ],
      defaultValue: ''
    },
{
      id: 'drivers_license',
      stepId: 'skills',
      highlight: '普通自動車免許',
      text: 'はお持ちですか?',
      component: markRaw(SelectCards),
      options: [
        { value: 'at', label: '持っている(AT車限定)' },
        { value: 'mt', label: '持っている(MT車)' },
        { value: 'none', label: '免許を持っていない' }
      ],
      columns: 1,
      defaultValue: ''
    },
    {
      id: 'certifications',
      stepId: 'skills',
      highlight: '保有している資格',
      text: 'を教えてください(複数回答可)',
      component: markRaw(CertificationInput),
      defaultValue: [],
      isRequired: false
    },
  ]

  // ローカルストレージから復元
  const loadAnswers = (): Record<string, any> => {
    if (import.meta.client) {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        try {
          return JSON.parse(saved)
        } catch {
          return {}
        }
      }
    }
    return {}
  }

const INDEX_STORAGE_KEY = 'onboarding_index'

const loadIndex = (): number => {
  if (import.meta.client) {
    const saved = localStorage.getItem(INDEX_STORAGE_KEY)
    if (saved) {
      const idx = parseInt(saved, 10)
      if (!isNaN(idx) && idx >= 0 && idx < questions.length) {
        return idx
      }
    }
  }
  return 0
}

  // 初期値は空（SSR対策）
  const answers = ref<Record<string, any>>({})
  const currentQuestionIndex = ref(0)
  const isHydrated = ref(false)

  // クライアントサイドでのみ復元
  onMounted(() => {
    const savedAnswers = localStorage.getItem(STORAGE_KEY)
    if (savedAnswers) {
      try {
        answers.value = JSON.parse(savedAnswers)
      } catch {
        // パース失敗時は空のまま
      }
    }
    
    const savedIndex = localStorage.getItem(INDEX_STORAGE_KEY)
    if (savedIndex) {
      const idx = parseInt(savedIndex, 10)
      if (!isNaN(idx) && idx >= 0 && idx < questions.length) {
        currentQuestionIndex.value = idx
      }
    }
    
    isHydrated.value = true
  })

  // ローカルストレージに保存（answers）
  watch(answers, (newAnswers) => {
    if (isHydrated.value) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newAnswers))
    }
  }, { deep: true })

  // ローカルストレージに保存（index）
  watch(currentQuestionIndex, (newIndex) => {
    if (isHydrated.value) {
      localStorage.setItem(INDEX_STORAGE_KEY, String(newIndex))
    }
  })


  const currentQuestion = computed(() => questions[currentQuestionIndex.value])
  
const currentQuestionOptions = computed(() => {
  const question = currentQuestion.value
  
  // 都道府県の質問の場合
  if (question.id === 'prefecture') {
    const selectedRegion = answers.value['region']
    if (selectedRegion && prefecturesByRegion[selectedRegion]) {
      return prefecturesByRegion[selectedRegion]
    }
  }
  
  // 業種中分類の場合
  if (question.id === 'job_industry_medium') {
    const largeCat = answers.value['job_industry_large']
    return industryMediumOptions[largeCat] || []
  }
  
  // 職種詳細の場合
  if (question.id === 'job_category_detail') {
    const mediumCat = answers.value['job_industry_medium']
    return jobDetailOptions[mediumCat] || []
  }
  
  return question.options || []
})

const graduationSubtitle = computed(() => {
  if (currentQuestion.value.id !== 'graduation_year') return ''
  
  const education = answers.value['education']
  if (education === 'university' || education === 'graduate' || education === 'junior_college' || education === 'technical_college') {
    return answers.value['faculty'] || ''
  } else if (education === 'vocational') {
    return answers.value['vocational_field'] || ''
  }
  return ''
})

const graduationBaseAge = computed(() => {
  if (currentQuestion.value.id !== 'graduation_year') return 22
  
  const education = answers.value['education']
  return getGraduationAge(education)
})
  

  const currentStep = computed(() => {
    const stepId = currentQuestion.value.stepId
    return steps.findIndex(s => s.id === stepId)
  })

const currentAnswer = computed({
  get: () => {
    const id = currentQuestion.value.id

    // 未初期化なら defaultValue を answers にセット（1回だけ）
    if (answers.value[id] === undefined) {
      // オブジェクトの場合は deep copy
      answers.value[id] = JSON.parse(JSON.stringify(currentQuestion.value.defaultValue))
    }

    return answers.value[id]
  },

  set: (value) => {
    const id = currentQuestion.value.id
    answers.value[id] = value
  }
})

// 卒業年の学校名を取得
const graduationSchoolName = computed(() => {
  if (currentQuestion.value.id !== 'graduation_year') return ''
  
  const education = answers.value['education']
  
  // 大学系の場合は選択した学校名
  if (education === 'university' || education === 'graduate' || education === 'junior_college') {
    const schoolValue = answers.value['school_name']
    const school = dummySchoolOptions.find(s => s.value === schoolValue)
    return school?.label || ''
  }
  
  // 高等専門学校の場合は入力した学校名
  if (education === 'technical_college') {
    return answers.value['technical_school_name'] || ''
  }
  
  return ''
})

// 卒業年の学部・学科名を取得
const graduationFacultyName = computed(() => {
  if (currentQuestion.value.id !== 'graduation_year') return ''
  
  const education = answers.value['education']
  
  // 大学系・高専の場合は学部・学科
  if (education === 'university' || education === 'graduate' || education === 'junior_college' || education === 'technical_college') {
    const facultyValue = answers.value['faculty']
    const faculty = facultyOptions.find(f => f.value === facultyValue)
    return faculty?.label || ''
  }
  
  // 専門学校の場合は専門分野
  if (education === 'vocational') {
    const fieldValue = answers.value['vocational_field']
    const field = vocationalFieldOptions.find(f => f.value === fieldValue)
    return field?.label || ''
  }
  
  return ''
})

// 生まれた年を取得
const birthYear = computed(() => {
  const birthdateAnswer = answers.value['birthdate']
  if (birthdateAnswer && typeof birthdateAnswer === 'object' && 'year' in birthdateAnswer) {
    return Number(birthdateAnswer.year)
  }
  return new Date().getFullYear() - 22 // デフォルト
})


const canProceed = computed(() => {
  if (currentQuestion.value.isRequired === false) {
    return true
  }
  
  const answer = currentAnswer.value
  
  // employment_periodの場合
  if (currentQuestion.value.id === 'employment_period') {
    const hasJoinDate = answer.joinYear && answer.joinMonth
    const hasLeaveDate = answer.isCurrentJob ? (answer.leaveYear && answer.leaveMonth) : true
    return hasJoinDate && hasLeaveDate
  }
  
  if (Array.isArray(answer)) {
    return true // 配列は常にtrue(空配列でもOK)
  }
  
  if (typeof answer === 'object' && answer !== null) {
    return Object.values(answer).every(v => v !== '')
  }
  return answer !== ''
})

  const isLastQuestion = computed(() => 
    currentQuestionIndex.value === questions.length - 1
  )

// 履歴スタックを追加
const questionHistory = ref<number[]>([0])  // 最初の質問から開始

const handleNext = () => {
  if (!canProceed.value) return
  
  let nextIndex = currentQuestionIndex.value + 1
  
  // 地域選択で北海道を選んだ場合
  if (currentQuestion.value.id === 'region' && currentAnswer.value === 'hokkaido') {
    answers.value['prefecture'] = 'hokkaido'
    nextIndex = currentQuestionIndex.value + 2
  }
  // 最終学歴による分岐
  else if (currentQuestion.value.id === 'education') {
    const education = currentAnswer.value
    
    if (education === 'university' || education === 'graduate' || education === 'junior_college') {
      nextIndex = currentQuestionIndex.value + 1
    } else if (education === 'technical_college') {
      nextIndex = currentQuestionIndex.value + 2
    } else if (education === 'vocational') {
      nextIndex = currentQuestionIndex.value + 4
    } else {
      nextIndex = currentQuestionIndex.value + 5
    }
  }
  // 学校名選択(大学系)の後は学部・学科へ
  else if (currentQuestion.value.id === 'school_name') {
    nextIndex = currentQuestionIndex.value + 2
  }
  // テキスト入力(高専)の後は学部をスキップ
  else if (currentQuestion.value.id === 'technical_school_name') {
    nextIndex = currentQuestionIndex.value + 1
  }
  // 学部・学科の後は専門分野をスキップ
  else if (currentQuestion.value.id === 'faculty') {
    nextIndex = currentQuestionIndex.value + 2
  }
  // 経験社数による分岐 ← ここに追加
  else if (currentQuestion.value.id === 'company_count') {
    const count = currentAnswer.value
    
    if (count === '0') {
      // 0社の場合は職歴詳細をスキップ(+7)
      nextIndex = currentQuestionIndex.value + 8
    } else {
      // 1社以上の場合は次の質問へ
      nextIndex = currentQuestionIndex.value + 1
    }
  }
    // マネジメント経験年数による分岐 ← ここに追加
  else if (currentQuestion.value.id === 'management_years') {
    const managementYears = currentAnswer.value
    
    if (managementYears === 'none') {
      nextIndex = currentQuestionIndex.value + 2
    } else {
      nextIndex = currentQuestionIndex.value + 1
    }
  }
  
  if (nextIndex >= questions.length) {
    // 完了処理
    console.log('Completed!', answers.value)
    if (import.meta.client) {
      localStorage.removeItem(STORAGE_KEY)
      localStorage.removeItem(INDEX_STORAGE_KEY)
    }
    navigateTo('/onboarding/complete')
  } else {
    currentQuestionIndex.value = nextIndex
    questionHistory.value.push(nextIndex)
  }
}

const handleBack = () => {
  if (questionHistory.value.length > 1) {
    questionHistory.value.pop()  // 現在の質問を削除
    const prevIndex = questionHistory.value[questionHistory.value.length - 1]
    currentQuestionIndex.value = prevIndex
  }
}
  
const handleReset = () => {
  if (confirm('入力内容をすべてリセットしますか?')) {
    if (import.meta.client) {
      localStorage.removeItem(STORAGE_KEY)
      localStorage.removeItem(INDEX_STORAGE_KEY)
    }
    
    answers.value = {}
    currentQuestionIndex.value = 0
    questionHistory.value = [0]  // ← 履歴もリセット
    
    if (import.meta.client) {
      window.location.reload()
    }
  }
}

// updateSelectedLabel 関数を先に定義
const updateSelectedLabel = () => {
  const question = questions[currentQuestionIndex.value]
  const questionId = question.id
  
  // 中分類の場合: 大分類のラベルを表示
  if (questionId === 'job_industry_medium') {
    const largeCatValue = answers.value['job_industry_large']
    const largeCat = industryLargeOptions.find(opt => opt.value === largeCatValue)
    question.selectedLabel = largeCat?.label || ''
  }
  // 小分類の場合: 大分類 > 中分類 を表示
  else if (questionId === 'job_category_detail') {
    const largeCatValue = answers.value['job_industry_large']
    const mediumCatValue = answers.value['job_industry_medium']
    const largeCat = industryLargeOptions.find(opt => opt.value === largeCatValue)
    const mediumOptions = industryMediumOptions[largeCatValue] || []
    const mediumCat = mediumOptions.find(opt => opt.value === mediumCatValue)
    
    if (largeCat && mediumCat) {
      question.selectedLabel = `${largeCat.label} > ${mediumCat.label}`
    }
  }
  // それ以外はラベルをクリア
  else {
    question.selectedLabel = ''
  }
}

// watchはupdateSelectedLabelの定義の後に配置
watch(currentQuestionIndex, () => {
  updateSelectedLabel()
}, { immediate: true })

// 動的にpropsと質問文を設定
watch(currentQuestionIndex, () => {
  const question = questions[currentQuestionIndex.value]
  const questionId = question.id  // ← この行を追加
  
  // job_experience_years_at_company の場合
  if (questionId === 'job_experience_years_at_company') {
    question.selectedJobs = answers.value['past_job_category'] || []
    const companyName = answers.value['current_company'] || '直近の企業'
    question.companyName = companyName
    question.employmentPeriod = answers.value['employment_period']
    
    // 質問文を動的に変更
    question.highlight = `${companyName}で`
    question.text = '以下の仕事をした年数を教えてください'
  }
  
  // 中分類の場合: 大分類のラベルを表示
  if (questionId === 'job_industry_medium') {
    const largeCatValue = answers.value['job_industry_large']
    const largeCat = industryLargeOptions.find(opt => opt.value === largeCatValue)
    question.selectedLabel = largeCat?.label || ''
  }
  // 小分類の場合: 大分類 > 中分類 を表示
  else if (questionId === 'job_category_detail') {
    const largeCatValue = answers.value['job_industry_large']
    const mediumCatValue = answers.value['job_industry_medium']
    
    const largeCat = industryLargeOptions.find(opt => opt.value === largeCatValue)
    const mediumOptions = industryMediumOptions[largeCatValue] || []
    const mediumCat = mediumOptions.find(opt => opt.value === mediumCatValue)
    
    if (largeCat && mediumCat) {
      question.selectedLabel = `${largeCat.label} > ${mediumCat.label}`
    }
  }
  // それ以外はラベルをクリア
  else {
    question.selectedLabel = ''
  }
}, { immediate: true })

return {
  steps,
  questions,
  currentStep,
  currentQuestionIndex,
  currentQuestion,
  currentQuestionOptions,
  currentAnswer,
  canProceed,
  isLastQuestion,
  handleNext,
  handleBack,
  handleReset,
  updateSelectedLabel,
  answers,
  isHydrated,
  questionHistory,
  graduationSubtitle, 
  graduationSchoolName,
  graduationFacultyName,
  graduationBaseAge,
  birthYear
}
}
