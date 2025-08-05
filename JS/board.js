//מערך לשמירת הערכי כתרת
let arr=['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

//משתנים בשביל יצירת הטבלה
let mytable, th, tr, td, btn;
//מטריצה למהלך המשחק, מיצגת את נתוני הצוללות שהוצבו
//' '-מיקום ריק
//'X'-מיקום ריק שנלחץ
//'s'-צוללת
//'*'-צוללת שנפגעה
let my_mat=[[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
            [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
            [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
            [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
            [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
            [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
            [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
            [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
            [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
            [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ']];

let my_submarine=[];

//פונקציה לדף המשחק בעצמו שמאתחלת את הדף
function newGame()
{
    //הוספת שם משתמש לדף
    let user=sessionStorage.getItem("userName");
    if(user==null)
        window.location="../HTML/login.html";
    
    let p=document.getElementById("User1");
    p.innerHTML=user;
    // p.innerHTML="Hello "+user;
    p=document.getElementById("User2");
    p.innerHTML=user;
    //יצירת הלוחות
    newBoard("my_board");
    randSubmarine(my_mat, my_submarine);
    submarineMenu("c_sub");
    submarineMenu("your_sub");
    newBoard("c_board");
    //הוראות המשחק
    ins();
    _popup("win", "Congratulations!", "You won!!!", "../img/win.gif");
    _popup("lost", "...חבל", "...הפעם הפסדת", "../img/lost1.gif");
}

//פונקציה שבונה את הלוח- טבלה
newBoard=(id)=>
{
    //יצירת הטבלה
    mytable=document.createElement("table");
    mytable.setAttribute("id", "mytable_"+id);
    document.getElementById(id).appendChild(mytable);

    //הוספת שורת כותרת
    tr=document.createElement("tr");
    tr.setAttribute("id", "tr0_"+id);
    document.getElementById("mytable_"+id).appendChild(tr);

    
    td=document.createElement("td");
    document.getElementById("tr0_"+id).appendChild(td);

    //הכנסת תוכן לשורת כותרת
    for(let j=1; j<11; j++)
    {
        td=document.createElement("td");
        td.innerHTML=arr[j-1];  //לשאול את המורה אם יש המרה לתו ב-
        document.getElementById("tr0_"+id).appendChild(td);
    }

    //יצירת שאר הלוח- הכפתורים כו
    for(let i=1; i<11; i++)
    {
        tr=document.createElement("tr");
        tr.setAttribute("id", "tr"+i+"_"+id);
        document.getElementById("mytable_"+id).appendChild(tr);

        td=document.createElement("td");
        td.innerHTML=i;  
        document.getElementById("tr"+i+"_"+id).appendChild(td);

        for(let j=1; j<11; j++)
        {
            td=document.createElement("td");

            btn=document.createElement("button");
            btn.setAttribute("id", "btn"+i+j);
            btn.setAttribute("onclick", "click_"+id+"()");
            btn.setAttribute("data-Row", i-1);   
            btn.setAttribute("data-Col", j-1);

            //יצירת התמנות והכנסה לכפתור
            let img1=document.createElement("img");
            img1.setAttribute("src", "../img/explosion.png");
            // img1.setAttribute("class", "img1_");
            img1.setAttribute("id", "img1_"+id+(i-1)+(j-1));
            img1.setAttribute("width", "30px");
            img1.setAttribute("height", "30px");
            let img2=document.createElement("img");
            img2.setAttribute("src", "../img/x.png");
            // img1.setAttribute("class", "img2_");
            img2.setAttribute("id", "img2_"+id+(i-1)+(j-1));
            img2.setAttribute("width", "30px");
            img2.setAttribute("height", "30px");

            btn.appendChild(img1);
            btn.appendChild(img2);
            img1.setAttribute("hidden", "true");
            img2.setAttribute("hidden", "true");
            td.appendChild(btn);  
            document.getElementById("tr"+i+"_"+id).appendChild(td);
        }
    }
}

//פונקציה שמגרילה את מיקומי הצוללות, ושולחת לפונקציה אחרת בשביל לבדוק אם הם תקינים
randSubmarine=(mat, arr)=>
{
    let length=4, i, j, top, d, k;
    let count=0;
    
    while(true)
    {
        i=Math.floor(Math.random()*10);
        j=Math.floor(Math.random()*10);
        d=Math.floor(Math.random()*2);  
        if(isProper(mat, i, j, 5, d)==true)
        {
            submarineIn(mat, i, j, 5, d);
            arr.push(new submarine(5, i, j, d));
            break;
        }
    }

    while(length>0)
    {
        top=Math.abs(length-1-3);   // כמה צוללות יש להגריל כל פעם מאורך מסוים
        for(k=0; k<=top; )
        {
            //הגרלת אינדקס התחלה לצוללת
            i=Math.floor(Math.random()*10);
            j=Math.floor(Math.random()*10);
            d=Math.floor(Math.random()*2);      //הגרלת כיוון
            //console.log(i);
            //console.log(j);
            //console.log(d);
            if(isProper(mat, i, j, length, d)==true)
            {
                submarineIn(mat, i, j, length, d);
                arr.push(new submarine(length, i, j, d));
                k++;
            }
            count++;
            if(count>10000)
                break;
        }
        if(count>10000)
            break;
        length--;
    }
    console.log(length);
}

//פונקציה הבודקת האם ניתן למקם את הצוללת במיקןם שנשלח
//הפונקציה מקבלת את המטריצה עליה היא בודקת, את מיקום התחלת הצוללת, את אורכה והכיוון (לאורך 0 , לרוחב 1)
isProper=(mat, i, j, length, direction)=>
{
    //בדיקה אם יש גלישה מגבולות המטריצה
    if(direction==1)
    {
        if(j+length>10)
            return false;
    }
    else
        if(i+length>10)
            return false;
    
    let lowR, lowC, topR, topC;
    lowR= (i==0 ? 0 : i-1);                 //צריך לבדוק אם יש צוולות מהמיקום של שורה לפני אבל אם השורה היא שורה 0 אז אי אפשר לבדוק את השורה לפני כי היא לא קיימת
    lowC= (j==0 ? 0 : j-1);                 //כנ"ל רק בעמודה
    topR= (direction==1 ? i+1 : i+length);  //תלוי עד איפה לרוצ אם רוצים להציב את הצוללת לאורך או לרוחב
    topR= (topR<10 ? topR+1 : topR);         //אם רוצים להציב את הצוללת כך שיהיה לה גבול אם הלוח אז צריף לרוץ רק עד הגבול, כדי שלא תהיה גלישה
    topC= (direction==0 ? j+1 : j+length);  //כנ"ל
    topC= (topC<10 ? topC+1 : topC);
    
    for(let r=lowR; r<topR; r++)
    {
        for(let c=lowC; c<topC; c++)
        {
            if(mat[r][c]=='s')  //כלומר ממוקמת שם צוולת
                return false;
        }
    }
    return true;
}

//פונקציה המציבה צוללת במיקום מסוים, אחרי הבדיקה
submarineIn=(mat, i, j, length, direction)=>
{
    //הצבה של כמה כל אינדקס צריך להתקדם
    let stepI= Math.abs(direction-1), stepJ= direction;
    for(let k=0; k<length; k++, i+=stepI, j+=stepJ)
        mat[i][j]='s';
}

//פונקציה שיוצרת את התפריט צוללות 
submarineMenu=(id)=>
{
    let i, length=4, table, top, j;
    let div=document.getElementById(id+"_2");
    table=document.createElement("table");
    table.setAttribute("id", "sub5_0_"+id);
    tr=document.createElement("tr");
    table.appendChild(tr);
    for(i=0; i<5; i++)
    {
        td=document.createElement("td");
        td.setAttribute("id", "td5_"+i+"_number_0_"+id);
        tr.appendChild(td);
    }
    div.appendChild(table);

    while(length>0)
    {
        // br=document.createElement("br");
        // div.appendChild(br);
        top=Math.abs(length-1-3);
        div=document.getElementById(id+"_"+(Math.ceil(length/2)));
        if(length==1)
            div=document.getElementById(id+"_0");
        for(i=0; i<=top; i++)
        {
            table=document.createElement("table");
            table.setAttribute("id", "sub"+length+"_"+i+"_"+id);
            tr=document.createElement("tr");
            table.appendChild(tr);
            for(j=0; j<length; j++)
            {
                td=document.createElement("td");
                td.setAttribute("id", "td"+length+"_"+j+"_number_"+i+"_"+id);
                tr.appendChild(td);  
            }
            
            div.appendChild(table);
        }

        length--;
    }
}

//פונקציה בלחיצה על שם המשתמש כדי להראות את האפשרות של התנתקות ומשחק חדש
function createDiv()
{
    let d=document.getElementById("div_to_logOff");
    d.hidden=false;
}

//פונקציה שיוצרת את חלונית הניצחון
_popup=(id, H1, H2, gif)=>
{
    let div1=document.getElementById("popupOverlay_"+id);
    let div2=document.createElement("div");
    div2.setAttribute("id", "popup-box-"+id);
    div1.appendChild(div2);
    let h1=document.createElement("h2");
    h1.innerHTML=H1//"Congratulations!";
    div2.appendChild(h1);
    let h=document.createElement("h2");
    h.innerHTML=H2//"You won!!!";
    div2.appendChild(h);
    let im=document.createElement("img");
    im.setAttribute("src", gif);//"../img/win.gif"
    im.setAttribute("width", "200px");
    im.setAttribute("height", "200px");
    div2.appendChild(im);
    div2.appendChild(document.createElement("br"));
    let btn=document.createElement("button");
    btn.setAttribute("class", "btn-close-popup-"+id);
    btn.innerHTML="close";
    btn.setAttribute("onclick", `togglePopup_("${id}")`)
    div2.appendChild(btn);
    btn=document.createElement("button");
    btn.setAttribute("class", "btn-close-popup-"+id);
    btn.innerHTML="Play Again";
    btn.setAttribute("onclick", "gameNew()");
    div2.appendChild(btn);
    div2.style.display="none";
}
//פונקציה שמסתירה את חלונית הניצחון
togglePopup_=(id)=>
{    
    let div=document.getElementById("popup-box-"+id);
    div.style.display="none";
    const overlay = document.getElementById('popupOverlay_'+id);
    overlay.classList.toggle('show');

}
//פונקציה שמראה את החלונית של הניצחון 
you_=(id)=>
{
    let div=document.getElementById("popup-box-"+id);
    div.style.display="block";
    const overlay = document.getElementById('popupOverlay_'+id);
    overlay.classList.toggle('show');
}

//פונקצית התנתקות
function LogOff()
{
    sessionStorage.setItem("userName", ""); 
    window.location="../HTML/login.html";  
}

//פונקציה למשחק חדש
function gameNew()
{
    window.location="../HTML/before_game.html";  
}

//פונקציה שמראה את האפשריות של התנתקות ומשחק חדש
function funcList()
{
    const buttonsList = document.getElementById("list");
    if (buttonsList.style.display == "none")
    {
        buttonsList.style.display = "block";
    }
    else 
    {
        buttonsList.style.display = "none";
    }
}