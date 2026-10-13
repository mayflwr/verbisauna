
// ===== LEGACY REFERENCE: hand-typed reference forms of every verb (used only by the self-test below; keep as regression fixture) =====
// c = colloquial "me" form (passive); f = 6 forms (minä, sinä, hän, me, te, he); en = [base form, 3rd person sg.]; g = consonant gradation
export const LEGACY = [
 {fi:"ampua",c:"ammutaan",en:["shoot","shoots"],g:"p → mm",f:["ammun","ammut","ampuu","ammumme","ammutte","ampuvat"]},
 {fi:"antaa",c:"annetaan",en:["give","gives"],g:"nt → nn",f:["annan","annat","antaa","annamme","annatte","antavat"]},
 {fi:"hiihtää",c:"hiihdetään",en:["ski","skis"],g:"ht → hd",f:["hiihdän","hiihdät","hiihtää","hiihdämme","hiihdätte","hiihtävät"]},
 {fi:"hyppiä",c:"hypitään",en:["jump","jumps"],g:"pp → p",f:["hypin","hypit","hyppii","hypimme","hypitte","hyppivät"]},
 {fi:"jakaa",c:"jaetaan",en:["share","shares"],g:"k → ∅",f:["jaan","jaat","jakaa","jaamme","jaatte","jakavat"]},
 {fi:"kertoa",c:"kerrotaan",en:["tell","tells"],g:"rt → rr",f:["kerron","kerrot","kertoo","kerromme","kerrotte","kertovat"]},
 {fi:"kieltää",c:"kielletään",en:["forbid/deny","forbids/denies"],g:"lt → ll",f:["kiellän","kiellät","kieltää","kiellämme","kiellätte","kieltävät"]},
 {fi:"kirjoittaa",c:"kirjoitetaan",en:["write","writes"],g:"tt → t",f:["kirjoitan","kirjoitat","kirjoittaa","kirjoitamme","kirjoitatte","kirjoittavat"]},
 {fi:"kylpeä",c:"kylvetään",en:["bathe","bathes"],g:"p → v",f:["kylven","kylvet","kylpee","kylvemme","kylvette","kylpevät"]},
 {fi:"leipoa",c:"leivotaan",en:["bake","bakes"],g:"p → v",f:["leivon","leivot","leipoo","leivomme","leivotte","leipovat"]},
 {fi:"lentää",c:"lennetään",en:["fly","flies"],g:"nt → nn",f:["lennän","lennät","lentää","lennämme","lennätte","lentävät"]},
 {fi:"lukea",c:"luetaan",en:["read","reads"],g:"k → ∅",f:["luen","luet","lukee","luemme","luette","lukevat"]},
 {fi:"lähteä",c:"lähdetään",en:["leave","leaves"],g:"ht → hd",f:["lähden","lähdet","lähtee","lähdemme","lähdette","lähtevät"]},
 {fi:"löytää",c:"löydetään",en:["find","finds"],g:"t → d",f:["löydän","löydät","löytää","löydämme","löydätte","löytävät"]},
 {fi:"nukkua",c:"nukutaan",en:["sleep","sleeps"],g:"kk → k",f:["nukun","nukut","nukkuu","nukumme","nukutte","nukkuvat"]},
 {fi:"näyttää",c:"näytetään",en:["show","shows"],g:"tt → t",f:["näytän","näytät","näyttää","näytämme","näytätte","näyttävät"]},
 {fi:"odottaa",c:"odotetaan",en:["wait","waits"],g:"tt → t",f:["odotan","odotat","odottaa","odotamme","odotatte","odottavat"]},
 {fi:"onkia",c:"ongitaan",en:["fish","fishes"],g:"k → g",f:["ongin","ongit","onkii","ongimme","ongitte","onkivat"]},
 {fi:"oppia",c:"opitaan",en:["learn","learns"],g:"pp → p",f:["opin","opit","oppii","opimme","opitte","oppivat"]},
 {fi:"ottaa",c:"otetaan",en:["take","takes"],g:"tt → t",f:["otan","otat","ottaa","otamme","otatte","ottavat"]},
 {fi:"piirtää",c:"piirretään",en:["draw","draws"],g:"rt → rr",f:["piirrän","piirrät","piirtää","piirrämme","piirrätte","piirtävät"]},
 {fi:"pitää",c:"pidetään",en:["like/hold","likes/holds"],g:"t → d",f:["pidän","pidät","pitää","pidämme","pidätte","pitävät"]},
 {fi:"pukea",c:"puetaan",en:["dress sb./suit","dresses sb./suits"],g:"k → ∅",f:["puen","puet","pukee","puemme","puette","pukevat"]},
 {fi:"rakentaa",c:"rakennetaan",en:["build","builds"],g:"nt → nn",f:["rakennan","rakennat","rakentaa","rakennamme","rakennatte","rakentavat"]},
 {fi:"repiä",c:"revitään",en:["tear to pieces","tears to pieces"],g:"p → v",f:["revin","revit","repii","revimme","revitte","repivät"]},
 {fi:"saapua",c:"saavutaan",en:["arrive","arrives"],g:"p → v",f:["saavun","saavut","saapuu","saavumme","saavutte","saapuvat"]},
 {fi:"soittaa",c:"soitetaan",en:["play/call","plays/calls"],g:"tt → t",f:["soitan","soitat","soittaa","soitamme","soitatte","soittavat"]},
 {fi:"täyttää",c:"täytetään",en:["fill","fills"],g:"tt → t",f:["täytän","täytät","täyttää","täytämme","täytätte","täyttävät"]},
 {fi:"ymmärtää",c:"ymmärretään",en:["understand","understands"],g:"rt → rr",f:["ymmärrän","ymmärrät","ymmärtää","ymmärrämme","ymmärrätte","ymmärtävät"]},
 {fi:"yöpyä",c:"yövytään",en:["stay overnight","stays overnight"],g:"p → v",f:["yövyn","yövyt","yöpyy","yövymme","yövytte","yöpyvät"]}
];
// ===== VERB DATA + RULE ENGINE =====
// New verb: add an entry to RAW. Forms, colloquial passive and gradation label are generated.
// type = Finnish verb type 1-6. kpt = consonant gradation: weak = stem in weak grade, label = shown in feedback (omit kpt if none).
// irregular = {f:[6 forms], c:"passive"} overrides the rules for exceptions. So far only type 1 rules exist.
export const RULES = {
 1:{ stem:inf=>inf.slice(0,-1),            // infinitive minus -a/-ä
     han:S=>S+S.slice(-1),                  // 3rd sg: final stem vowel doubled
     pass:W=>W.replace(/[aä]$/,"e") }       // passive stem: -a/-ä becomes -e
};
export function build(v){
  const g=v.kpt?v.kpt.label:"none";
  if(v.irregular) return {f:v.irregular.f,c:v.irregular.c,g};
  const R=RULES[v.type]; if(!R) throw new Error("No rules for verb type "+v.type+" ("+v.fi+")");
  const S=R.stem(v.fi), W=v.kpt?v.kpt.weak:S, a=/[aou]/.test(v.fi)?"a":"ä"; // vowel harmony from the infinitive
  return {f:[W+"n",W+"t",R.han(S),W+"mme",W+"tte",S+"v"+a+"t"], c:R.pass(W)+"t"+a+a+"n", g};
}
export const RAW = [
 {fi:"ampua",type:1,en:["shoot","shoots"],kpt:{weak:"ammu",label:"p → mm"}},
 {fi:"antaa",type:1,en:["give","gives"],kpt:{weak:"anna",label:"nt → nn"}},
 {fi:"hiihtää",type:1,en:["ski","skis"],kpt:{weak:"hiihdä",label:"ht → hd"}},
 {fi:"hyppiä",type:1,en:["jump","jumps"],kpt:{weak:"hypi",label:"pp → p"}},
 {fi:"jakaa",type:1,en:["share","shares"],kpt:{weak:"jaa",label:"k → ∅"}},
 {fi:"kertoa",type:1,en:["tell","tells"],kpt:{weak:"kerro",label:"rt → rr"}},
 {fi:"kieltää",type:1,en:["forbid/deny","forbids/denies"],kpt:{weak:"kiellä",label:"lt → ll"}},
 {fi:"kirjoittaa",type:1,en:["write","writes"],kpt:{weak:"kirjoita",label:"tt → t"}},
 {fi:"kylpeä",type:1,en:["bathe","bathes"],kpt:{weak:"kylve",label:"p → v"}},
 {fi:"leipoa",type:1,en:["bake","bakes"],kpt:{weak:"leivo",label:"p → v"}},
 {fi:"lentää",type:1,en:["fly","flies"],kpt:{weak:"lennä",label:"nt → nn"}},
 {fi:"lukea",type:1,en:["read","reads"],kpt:{weak:"lue",label:"k → ∅"}},
 {fi:"lähteä",type:1,en:["leave","leaves"],kpt:{weak:"lähde",label:"ht → hd"}},
 {fi:"löytää",type:1,en:["find","finds"],kpt:{weak:"löydä",label:"t → d"}},
 {fi:"nukkua",type:1,en:["sleep","sleeps"],kpt:{weak:"nuku",label:"kk → k"}},
 {fi:"näyttää",type:1,en:["show","shows"],kpt:{weak:"näytä",label:"tt → t"}},
 {fi:"odottaa",type:1,en:["wait","waits"],kpt:{weak:"odota",label:"tt → t"}},
 {fi:"onkia",type:1,en:["fish","fishes"],kpt:{weak:"ongi",label:"k → g"}},
 {fi:"oppia",type:1,en:["learn","learns"],kpt:{weak:"opi",label:"pp → p"}},
 {fi:"ottaa",type:1,en:["take","takes"],kpt:{weak:"ota",label:"tt → t"}},
 {fi:"piirtää",type:1,en:["draw","draws"],kpt:{weak:"piirrä",label:"rt → rr"}},
 {fi:"pitää",type:1,en:["like/hold","likes/holds"],kpt:{weak:"pidä",label:"t → d"}},
 {fi:"pukea",type:1,en:["dress sb./suit","dresses sb./suits"],kpt:{weak:"pue",label:"k → ∅"}},
 {fi:"rakentaa",type:1,en:["build","builds"],kpt:{weak:"rakenna",label:"nt → nn"}},
 {fi:"repiä",type:1,en:["tear to pieces","tears to pieces"],kpt:{weak:"revi",label:"p → v"}},
 {fi:"saapua",type:1,en:["arrive","arrives"],kpt:{weak:"saavu",label:"p → v"}},
 {fi:"soittaa",type:1,en:["play/call","plays/calls"],kpt:{weak:"soita",label:"tt → t"}},
 {fi:"täyttää",type:1,en:["fill","fills"],kpt:{weak:"täytä",label:"tt → t"}},
 {fi:"ymmärtää",type:1,en:["understand","understands"],kpt:{weak:"ymmärrä",label:"rt → rr"}},
 {fi:"yöpyä",type:1,en:["stay overnight","stays overnight"],kpt:{weak:"yövy",label:"p → v"}}
];
export const VERBS = RAW.map(v=>Object.assign({},v,build(v)));
// self-test: generated verbs must equal the hand-typed originals (see console)
(function(){
  let bad=0; const err=(...a)=>{bad++;console.error("VerbiSauna self-test:",...a)};
  if(VERBS.length!==LEGACY.length) err("verb count",VERBS.length,"vs",LEGACY.length);
  for(const L of LEGACY){
    const v=VERBS.find(x=>x.fi===L.fi); if(!v){err("missing",L.fi);continue}
    if(v.f.join()!==L.f.join()) err(L.fi,"forms",v.f.join(),"vs",L.f.join());
    for(const k of ["c","g"]) if(v[k]!==L[k]) err(L.fi,k,v[k],"vs",L[k]);
    if(v.en.join()!==L.en.join()) err(L.fi,"en");
  }
  if(!bad) console.log("VerbiSauna self-test OK: "+VERBS.length+" verbs match the hand-typed originals");
})();
export const STANDARD_PRONOUNS=["minä","sinä","hän","me","te","he"];
export const EN_PRONOUNS=["I","you","he/she","we","you (pl.)","they"];
export const COLLOQUIAL_PRONOUNS=["mä","sä","se","me","te","ne"];
export const NEGATIONS=["en","et","ei","emme","ette","eivät"];
export const PERSON_EMOJIS=["🙋","🫵","🧑","🙋🧑","🫵🫵","🧑🧑"];
export const LEVELS=[ // [min points, name, meaning]
 [0,"🚪 Pukuhuone","pukuhuone = changing room"],
 [50,"🪵 Alalauteet","alalauteet = lower benches"],
 [150,"🧖 Ylälauteet","ylälauteet = upper benches"],
 [300,"🌿 Vihta","vihta = birch whisk"],
 [600,"👑 Löylymestari","löylymestari = steam master"]];
export function level(points){let l=LEVELS[0];for(const x of LEVELS)if(points>=x[0])l=x;return l}_
