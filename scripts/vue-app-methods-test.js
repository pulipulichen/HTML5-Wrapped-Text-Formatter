/* global postMessageAPI, XLSX, GameMaster, appMethodsUI, appMethodsIV, appMethodsInit, appMethodsQuery, appMethodsUtils, appMethodsSearch, domtoimage */

var appMethodsTest = {
  
  testFormatText202210232207Chinese () {
    this.db.localConfig.input = `在國內,語言學 (linguistics) 或 語言科學 (linguistic science) 仍 然是一門相當陌生而新奇的學間。不但一般社會大眾對語言學素昧平 生 , 就是大多數從事語文 (不管是中文、中語或外文、外語) 教學的 人對於語言學研究的目標、方法以及對語言教學的可能貢獻都不甚了 解。其實,人類對語言的關心與興趣有相當久遠的歷史。早在公元前 四世紀,印度的高僧巴尼尼 (Panini) LA} WX (Sanskrit) 經書的讀 音留下了相當精密而明確的描述;而在差不多與此同時,希臘的哲儒 柏拉圖 (Plato, 427-347 B.C.) 與哲學家亞里斯多德 (Aristotle, 384-322 B.C.) 也發表了不少有關語言方面的論述。及至羅馬帝國 (Roman Empire, 27 B.C.) 興起,拉丁文遂成為支配全歐洲政治、經濟、法 律、文化、社會與學術的 共通語 (lingua franca)。各地學者爭相研究 拉丁文法,並試圖在拉丁文法的間架上建立起 地方語 (vernacular) 的文法來。到了十九世紀末葉,大英帝國 (the British Empire) 的國 威與影響力獲得空前的伸展,英語在國際上的地位遂取代了從前的拉 丁文與法語,一時各國研究英語語法的學者 (如 O. Jespersen, G_O. Curme, H. Poutsma, E. Kruisinga 等) 人才輩出。一九三零年代前後 , 凌國 結構學派 (structuralistb 語言學家 (其代表人物為E. Sapir BEL. Bloomfield) 從事北美印地安語言的研究,並以自認為科學的方法逐`
    this.$refs.AppInput.formatText()
  },
  testFormatText202210232208EnglishDash () {
    this.db.localConfig.input = `The  following  general  steps  are  suggested  for  constructing  a  thesaurus: 
1.  Identify  the  subject  field.  The  boundaries  of  the  subject  field  should 
be  clearly  defined  and  the  parameters  set  to  indicate  which areas  will 
be  emphasized  and  which  will  be  given  only  cursory  treatment.
2.  Identify  the  nature  of  the  literature  to  be  indexed.  Is  it  primarily 
journal  literature?  Or  does  it  consist  of  books,  reports,  conference 
papers,  etc.?  Is  it  retrospective  or  current?  If  it  is  retrospective,  then 
it  will  be  more  complex  to  make  changes  in  the  thesaurus.  Will  most 
of  the  material  be  on  the  Web? 
3.  Identify  the  users.  What  are  their  information  needs?  Will  they  be 
doing  their  own  searching  or  will  someone  do  it  for  them?  Will  their 
questions  be  broad  or  specific? 
4.  Identify  the  file  structure.  Will  this  be  a  pre-coordinated  or  post- 
coordinated  system? 
5.  Consult  published  indexes,  glossaries,  dictionaries,  and  other  tools 
in  the  subject  areas  for  the  raw vocabulary.  This  should  not be  done 
necessarily  with  the  idea  of  copying  terms,  but  such  perusal  can  in- 
crease  the  thesaurus  designer’s  understanding  of  the  terminology 
and  semantic  relationships  in  the  field. 
6.  Cluster  the  terms. 
7.  Establish  term  relationships. `
    this.$refs.AppInput.formatText()
  },
  testFormatAuthor202210240012English () {
    this.db.localConfig.input = `Cleveland, D. B., & Cleveland, A. D. (2001). Introduction to indexing and abstracting (2001). Santa Barbara, California: Libraries Unlimited, An Imprint of ABC-CLIO, LLC.
`
    this.$refs.AppInput.formatAuthor()
  },
  testFormatAuthor202210240012Chinese () {
    this.db.localConfig.input = `王梅玲、蔡明月、陳志銘、柯雲娥、蔡佳縈、陳勇汀、林怡甄（2008）。台灣圖書館史數位圖書館建構之研究。圖書館學與資訊科學，34（1），15–38。
`
    this.$refs.AppInput.formatAuthor()
  },
}