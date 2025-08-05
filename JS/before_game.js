// מטריצת המשחק - מייצגת את לוח השחקן
// ' ' = מקום ריק, 's' = צוללת
let c_mat=[ [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
            [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
            [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
            [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
            [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
            [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
            [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
            [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
            [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
            [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ']];

/**
 * קונסטרקטור לגודל (לא בשימוש כרגע)
 * @param {string} w - רוחב
 * @param {string} h - גובה
 */
function size(w, h)
{
    this.width=w;
    this.height=h;
}

// משתנים גלובליים לניהול המשחק
let length=0;      // אורך הצוללת הנבחרת
let dir=-1;        // כיוון הצוללת (-1=לא נבחר, 0=אנכי, 1=אופקי)
let element, e, i, j, count=0, b;  // משתני עזר
let Submarine=[];  // מערך הצוללות של השחקן

/**
 * פונקציה ראשית לאתחול דף סידור הלוח לפני המשחק
 * יוצרת לוח אוטומטי עם צוללות מוגרלות
 */
function start()
{
    // בדיקת משתמש מחובר
    let user=sessionStorage.getItem("userName");
    if(user==null)
        window.location="../HTML/login.html";

    // הצגת שם המשתמש
    let p=document.getElementById("User");
    p.innerHTML=user;
    
    // יצירת הלוח והגרלת צוללות
    newBoard("board");
    randSubmarine(c_mat, Submarine);
    
    // הצגת הצוללות על הלוח
    for(let i=0; i<10; i++)
    {
        for(let j=0; j<10; j++)
        {
            element=document.getElementById("btn"+(i+1)+(j+1));
            element.disabled=true;  // נעילת הכפתורים
            if(c_mat[i][j]=='s')    // אם יש צוללת במקום
            {
                element.style.backgroundColor="rgb(21, 49, 66, 0.8)";
            }
        }
    }

    // אתחול הוראות ותפריטים
    ins();
    instructions();
    
    // יצירת כפתור מעבר למשחק
    let b=document.createElement("button");
    b.innerHTML="למעבר למשחק";
    b.style.width="150px";
    b.style.height="40px";
    b.setAttribute("onclick", "toGame()");
    b.setAttribute("id", "toGame");
    
    // הסתרת אלמנטים לא רלוונטיים
    document.getElementById("0").hidden=true;
    document.getElementById("1").hidden=true;
    document.getElementById("imgS").hidden=true;
    document.getElementById("submarineMenu").appendChild(b);
}

/**
 * פונקציה הנקראת בעת לחיצה על צוללת בתפריט
 * שומרת את אורך הצוללת הנבחרת
 */
function lengthSub()
{
    e=event.srcElement;
    length=parseInt(e.getAttribute("data-S"));  // שמירת אורך הצוללת
}

/**
 * פונקציה הנקראת בעת לחיצה על כפתור כיוון
 * שומרת את הכיוון הנבחר (0=אנכי, 1=אופקי)
 */
function direction()
{
    b=event.srcElement;
    dir=parseInt(b.getAttribute("id"));  // שמירת הכיוון
}

//בעת לחיצה על מיקום בלוח
function click_board()
{
    let element=event.srcElement;
    i=parseInt(element.getAttribute("data-Row"));
    j=parseInt(element.getAttribute("data-Col"));

    if((length==1 || length<6 && length>1 && dir!=-1) && isProper(c_mat, i, j, length, dir)==true)
    {   
        e.hidden=true;
        submarineInAndBoard(c_mat, i, j, length, dir);
        length=0;
        dir=-1;
        count++;
        if(count==11)
        {
            document.getElementById("toGame").hidden=false;
            document.getElementById("0").hidden=true;
            document.getElementById("1").hidden=true;
        }
    }
    else
    {
        alert("אין אפשרות להציב את הצוללת במקום הרצוי, בחר מחדש מיקום אחר ");
    }
}

//בדיקה האם אפשר להציב את הצוללת
submarineInAndBoard=(mat, i, j, length, direction)=>
{
    Submarine.push(new submarine(length, i, j, direction));
    //let mytable=document.getElementById("mytable");
    //הצבה של כמה כל אינדקס צריך להתקדם
    let stepI= Math.abs(direction-1), stepJ= direction;
    for(let k=0; k<length; k++, i+=stepI, j+=stepJ)
    {
        mat[i][j]='s';
        element=document.getElementById("btn"+(i+1)+(j+1));
        element.disabled=true;
        element.style.backgroundColor="rgb(21, 49, 66, 0.8)";
    }
}

/**
 * פונקציה לאיפוס הלוח והתחלה מחדש
 * מנקה את כל הצוללות ומאפשרת סידור מחדש
 */
function restart()
{
    Submarine=[];  // איפוס מערך הצוללות
    
    // איפוס כל המשבצות בלוח
    for(let i=0; i<10; i++)
    {
        for(let j=0; j<10; j++)
        {
            element=document.getElementById("btn"+(i+1)+(j+1));
            element.disabled=false;  // שחרור הכפתורים
            element.style.backgroundColor="rgba(91, 95, 106, 0)";  // איפוס צבע
            c_mat[i][j]=' ';  // איפוס המטריצה
        }    
    }
    
    // החזרת התפריטים למצב התחלתי
    document.getElementById("toGame").hidden=true;
    document.getElementById("0").hidden=false;
    document.getElementById("1").hidden=false;
    document.getElementById("imgS").hidden=false;
    
    // החזרת כל הצוללות לתפריט
    document.getElementById("S51").hidden=false;
    for(let i=4; i>0; i--)
        for(let j=1; j<=Math.abs(i-5); j++)
            document.getElementById("S"+i+j).hidden=false;
}

/**
 * פונקציה למעבר לדף המשחק
 * שומרת את נתוני הלוח ועוברת לדף המשחק
 */
function toGame()
{
    countSort();  // מיון מערך הצוללות
    // שמירת נתוני המשחק ב-sessionStorage
    sessionStorage.setItem("c_submarine", JSON.stringify(Submarine));
    sessionStorage.setItem("c_mat", JSON.stringify(c_mat));
    window.location="../HTML/game.html";  // מעבר לדף המשחק
}

//מיון מערך הצוללת
function countSort()
{
    let i;
    let pos=[0, 1, 2, 4, 7];
    let arr=[null, null, null, null, null, null, null, null, null, null, null];
    for(i=0; i<Submarine.length; i++)   //i<11
        arr[pos[Math.abs(Submarine[i].length-5)]++]=Submarine[i];
    
    for(i=0; i<Submarine.length; i++)
        Submarine[i]=arr[i];
}

//פונקציה לבנית תפריט הצוללות
// function submarineMenu()
// {
//     let divImg=document.getElementById("imgS");
//     let btn, img;
   
//     for(let i=5; i>0; i--)
//     {
//         console.log("outFor");
//         for(let j=0; j<=Math.abs(4-i) || i==5 && j==0; j++)
//         {
//             btn=document.createElement("button");
//             im=document.createElement("img");
//             im.setAttribute("src", `../img/submarine.png`)
//             // img.setAttribute("width", arrSize[i-1][width]);
//             // img.setAttribute("height", arrSize[i-1][height]);
//             im.setAttribute("data-S", i);
//             btn.setAttribute("onclick", "lengthSub()");
//             btn.innerHTML=im;
//             divImg.appendChild(btn);
//             if(j%2==0)
//                 divImg.appendChild(document.createElement("br"));
//             console.log("inFor");
//         }
//         divImg.appendChild(document.createElement("br"));
//     }
    
// }