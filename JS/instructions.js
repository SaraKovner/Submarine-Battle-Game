let arrI=["?איך לשחק צוללות", 
    ".לכל אחד מהשחקנים יש שני לוחות מחולקים למשבצות: אחד מיועד למיקום הספינות שלהם, והשני לניחוש של מיקומי הספינות של היריב", 
    ".לפני תחילת הקרב, השחקנים בוחרים באופן אסטרטגי את מיקומי הספינות שלהם על הלוח", 
    ".לאחר מכן, כל שחקן בוחר בתורו אילו משבצות לתקוף בלוח של היריב",
    ".כאשר כל המשבצות שמכילות חלק מספינה מסויימת נפגעו, הספינה טובעת",
    ".המטרה הסופית של כל שחקן היא להיות הראשון שמוצא ומטביע את כל הספינות של היריב",
    ":הצבת הצוללות", 
    ".יש להציב את הצוללות במאונך או במאוזן, ולא באלכסון",
    ".אין לחפוף את הצוללות (כלומר, שאחת תהיה מוצבת על השנייה, או צמודה לה)", 
    ".אין להציב צוללות אחת בסמוך לשנייה, כולל באלכסון",
    ".לאחר שתלחצו למעבר למשחק, יוצג לכם לוח הספינות שלכם, כאשר הן כבר ממוקמות באופן אקראי",
    ":ניתן לשנות את מיקומי הספינות בקלות כך",
    "לחלופין, תוכלו ללחוץ על הכפתור \"עירבוב מחדש של הלוח\" .כדי לתת לספינות מיקומים אקראיים חדשים",
    "הכינו את צי הספינות שלכם בחוכמה והתכוננו להשתתף בקרב הימי האולטימטיבי. כשאתם מרוצים מסידור הספינות שלכם לחצו על \"שחקו\" .כדי להתחיל את המשחק",
    ":טיפים אסטרטגיים",
    ".פיזור התקיפות הראשונות: כוונו לאזורים שטרם יריתם לכיוונם. פזרו יריות לאזורים שונים כדי למצוא ביעילות את ספינות היריב",
    ".אל תבזבזו תורים: שימו לב לספינות שנותרו ליריב על הלוח. אם אף אחת מהספינות הנותרות לא יכולה להכנס במקבץ משבצות מסויים, אין סיבה לירות לכיוונו"
];
function ins()
{
    let h;
    let div1=document.getElementById("popupOverlay");
    let div2=document.createElement("div");
    div2.setAttribute("id", "popup-box");
    div1.appendChild(div2);
    h=document.createElement("h2");
    h.setAttribute("class", "h2-3_");
    h.innerHTML=":הוראות למשחק";
    div2.appendChild(h);
    h=document.createElement("h3");
    h.setAttribute("class", "h2-3_");
    h.innerHTML=arrI[0];
    div2.appendChild(h);
    Ch4(1, 6, div2);
    h=document.createElement("h3");
    h.setAttribute("class", "h2-3_");
    h.innerHTML=arrI[6];
    div2.appendChild(h);
    Ch4(7, 12, div2);
    let v=document.createElement("video");
    v.setAttribute("src", "../img/ins.mp4");
    v.setAttribute("width", "540px");
    v.setAttribute("height", "300px");
    v.setAttribute("controls","");
    v.setAttribute("loop","");
    v.setAttribute("autoplay","");
    v.setAttribute("muted","");
    div2.appendChild(v);
    Ch4(12, 14, div2);
    h=document.createElement("h3");
    h.setAttribute("class", "h2-3_");
    h.innerHTML=arrI[14];
    div2.appendChild(h);
    Ch4(15, arrI.length, div2);
    let btn=document.createElement("button");
    btn.setAttribute("class", "btn-close-popup");
    btn.innerHTML="close";
    btn.setAttribute("onclick", "togglePopup()")
    div2.appendChild(btn);
    div2.style.display="none";
}
function togglePopup()
{
    let div=document.getElementById("popup-box");
    div.style.display="none";
    const overlay = document.getElementById('popupOverlay');
    overlay.classList.toggle('show');
}
function instructions()
{
    let div=document.getElementById("popup-box");
    div.style.display="block";
    const overlay = document.getElementById('popupOverlay');
    overlay.classList.toggle('show');
}
// function toGame()
// {
//     window.location="k.html";
// }
function Ch4(low, top, div)
{
    let h;
    for(let i=low; i<top; i++)
    {
        h=document.createElement("h4");
        h.innerHTML=arrI[i];
        div.appendChild(h);
    }
}