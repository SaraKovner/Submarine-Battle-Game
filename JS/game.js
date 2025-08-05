// משתנים גלובליים לניהול המשחק
let my_pgiha=0;    // מספר פגיעות של השחקן
let c_pgiha=0;     // מספר פגיעות של המחשב
let img, startG=false, tor, not_tor, pgiha, shnia=true, length;

// טעינת נתוני המשחק מ-sessionStorage
let mat_c=JSON.parse(sessionStorage.getItem("c_mat"));        // מטריצת השחקן
let c_submarine=JSON.parse(sessionStorage.getItem("c_submarine")); // צוללות השחקן

// משתנים לבינה מלאכותית של המחשב
let dir=-1;           // כיוון הפגיעה הנוכחי
let firstPgiha="";   // פגיעה ראשונה בצוללת
let lastPgiha="";    // פגיעה אחרונה בצוללת
// מערך כיוונים: מעלה, ימינה, מטה, שמאלה
let arr_dir=[{i: -1, j: 0}, {i: 0, j: 1}, {i: 1, j: 0}, {i: 0, j: -1}];


/**
 * פונקציה להשהיה במשחק (אסינכרונית)
 * @param {number} ms - מספר מילישניות להמתין
 */
const sleep= ms=>new Promise(resolve => setTimeout(resolve, ms));

/**
 * פונקציה להתחלת המשחק
 * מאתחלת את המשחק ונותנת תור ראשון לשחקן
 */
function startGame()
{
    tor="my";  // קביעת תור ראשון לשחקן
    
    // הסתרת כפתור התחלה
    document.getElementById("btn_start").hidden=true;
    document.getElementById("img_start").hidden=true;
    
    startG=true;  // סימון שהמשחק התחיל
    
    // עיצוב אינדיקטור התור
    document.getElementById("your_tor").style.color="rgb(255, 255, 255)";
    document.getElementById("your_tor").style.backgroundColor="rgb(8, 167, 85)";
}

/**
 * פונקציה הנקראת בעת לחיצה על כפתור בלוח השחקן
 * מטפלת בפגיעה/החטאה ובדיקת ניצחון
 */
function click_my_board()
{
    // בדיקה שהמשחק התחיל וזה תור השחקן
    if(startG && tor==="my" && shnia)
    {
        let element=event.srcElement;
        element.disabled=true;  // נעילת הכפתור
        
        // קבלת מיקום הלחיצה
        let i=element.getAttribute("data-Row");
        let j=element.getAttribute("data-Col");
        
        // בדיקה אם יש צוללת במקום
        if(my_mat[i][j]=='s')
        {
            // פגיעה! הצגת פיצוץ
            document.getElementById("img1_my_board"+i+j).hidden=false;
            my_mat[i][j]='*';  // סימון פגיעה
            
            // בדיקה אם הצוללת הושמדה לחלוטין
            if((length=finish(my_mat, i, j))>0)
            {
                console.log(my_pgiha);
                func(length, i, j, "c_sub", my_submarine);  // צביעת הצוללת בתפריט
                my_pgiha++;  // עדכון מונה פגיעות
                
                if(my_pgiha==11)    // בדיקת ניצחון
                    you_("win");
            }
            pgiha=true;  // סימון שהיתה פגיעה
        }
        else
        {
            // החטאה - הצגת X
            document.getElementById("img2_my_board"+i+j).hidden=false;
            pgiha=false;
        }
        
        shnia=false;  // מניעת לחיצות נוספות
        
        // המתנה שנייה לפני מעבר תור
        (async () =>{
            await sleep(1000);
            turnIs();
        })();
    }
}

function click_c_board()
{

}

let r, c;

/**
 * פונקציה לתור של המחשב - בינה מלאכותית
 * מטפלת בהגרלת מיקום ובאסטרטגיה לאחר פגיעה
 */
function c_board()
{
    (async () =>{
        await sleep(1200);
    
        while(true)
        {
            if(firstPgiha!="")
            {
                //הייתה רק פגיעה אחת ראשונה
                if(lastPgiha=="")
                {
                    dir=Math.floor(Math.random()*4);
                    r=firstPgiha.i+arr_dir[dir].i;
                    c=firstPgiha.j+arr_dir[dir].j;
                    //אם הכיוון לא חוקי
                    if(r>=10 && r<0 && 
                        c>=10 || c<0)
                        {
                            //שישאר על אותו מיקום כדי שיגריל אחרי זה שוב פעם
                            r=firstPgiha.i;
                            c=firstPgiha.j;
                        }
                }
                else
                {
                    //יש את הכיון של הצוללת dirאז ב
                    r=lastPgiha.i+arr_dir[dir].i;
                    c=lastPgiha.j+arr_dir[dir].j;
                    //אם הכיוון לא חוקי
                    //שישאר על אותו מיקום כדי שיגריל אחרי זה שוב פעם
                    if(r>=10 && r<0)
                        r=lastPgiha.i-arr_dir[dir].i;

                    if(c>=10 || c<0)
                        c=lastPgiha.j-arr_dir[dir].j;

                    //מחייב שהצוללת לא נגמרה כי בודקים את זה בכל פגיעה..
                    if(mat_c[r][c]==' ' || mat_c[r][c]=='X')
                    {
                        //אם אני צריכה לחזור לכייון השני של הצוללת אז נחזיר את הפגיעה האחרונה לפגיעה הראשונה
                        //וגם את כיוון הפגיעה לצד השני
                        lastPgiha=firstPgiha;
                        if(dir>1)
                            dir-=2;
                        else
                            dir+=2;
                    }
                }
                //לחשוב איך לעשות את זה..
            }
            else
            {
                r=Math.floor(Math.random()*10);
                c=Math.floor(Math.random()*10);
            }
            //אחרי ההגרלה בדיקה האם יש פגיעה
            if(mat_c[r][c]==' ')
            {
                document.getElementById("img2_c_board"+r+c).hidden=false;
                mat_c[r][c]='X';
                pgiha=false;
                break;
            }
            else
            {
                if(mat_c[r][c]=='s')
                {
                    document.getElementById("img1_c_board"+r+c).hidden=false;
                    mat_c[r][c]='*';
                    pgiha=true;

                    // אם זה הפגיעה הראשונה אז אתחול של המשתנה פגיעה ראשונה אחרת.. 
                    if(firstPgiha=="")
                        firstPgiha={i: r, j: c};
                    else
                        lastPgiha={i: r, j: c};

                    // באלכסונים X הצבה
                    if(r!=0)
                    {
                        if(c>0)
                            mat_c[r-1][c-1]='X';
                        if(c<9) 
                            mat_c[r-1][c+1]='X';
                    }
                    if(r<9)
                    {
                        if(c<9)
                            mat_c[r+1][c+1]='X';
                        if(c>0) 
                            mat_c[r+1][c-1]='X';
                    }   

                    //בדיקה האם יש הפסד לשחקן
                    if((length=finish(mat_c, r, c))>0)
                    {
                        console.log(c_pgiha);
                        if(length>1 && r+arr_dir[dir].i<10 && r+arr_dir[dir].i>=0 && c+arr_dir[dir].j<10 && c+arr_dir[dir].j>=0)
                            mat_c[r+arr_dir[dir].i][c+arr_dir[dir].j]='X';
                        //איפוס פגיעה ראשונה ואחרונה
                        firstPgiha=lastPgiha="";

                        //פונקציה המטפלת בלוח
                        func(length, r, c, "your_sub", c_submarine);
                        c_pgiha++;
                        if(c_pgiha==11)    //כל הצוללות נפגעו
                            you_("lost");
                    }
                    break;
                }
                //אם המיקום כבר נבדק אז הוא מגריל מיקום אחר מחדש
            }
        }
    })();
    (async () =>{
        await sleep(2000);
        turnIs();
    })();
}

//פונקציה שבודקת האם הפגיעה גרמה לחשיפת כל צוללת
finish=(mat, i, j)=>
{
    let length_vertical_1=fun(mat, i, j, -1, 0);
    if(length_vertical_1==-1 || (length_vertical_2=fun(mat, i, j, 1, 0))==-1)
        return 0;
    
    let length_horizontal_1=fun(mat, i, j, 0, -1);
    if(length_horizontal_1==-1 || (length_horizontal_2=fun(mat, i, j, 0, 1))==-1)
        return 0;
    
    // כלומר אם מאחד הכיוונים חזר שלא נגמרה הצוללת אז יש להחזיר 0 כדי לסמן שהצוללת לא הסתיימה,
    // אחרת זה אומר שצריך להחזיר את המקסימום מבין הכיוונים, כי באחד מהם יש 0 ובאחד את האורך האמיתי 

    return parseInt(Math.max(length_vertical_1+length_vertical_2, length_horizontal_1+length_horizontal_2))+1;
}    

//פונקציה שמונה כמה פגיעות יש בכיוון מסוים
fun=(mat, i, j, stepI, stepJ)=>
{
    let counter=0;
    let newI= parseInt(i)+stepI;
    let newJ= parseInt(j)+stepJ;

    //console.log("newI="+newI+", newJ="+newJ);
    while(newI>=0 && newI<10 && newJ>=0 && newJ<10 && mat[newI][newJ]==='*')
    {
        newI+=stepI;
        newJ+=stepJ;
        counter++;
        //console.log("counter="+counter+`, and mat[${newI}][${newJ}]=${mat[newI][newJ]}`);
    }


    if(newI<0 || newI>=10 || newJ<0 || newJ>=10 || mat[newI][newJ]!=='s')
        return counter;
    
    return -1;   //הצוללת עדיין לא הסתימה
}

//למי עובר התור
function turnIs()
{
    shnia=true;
    not_tor=(tor==="my" ? "c" : "my");
    if(pgiha==false)     //כלומר השחקן שהיה תורו עכשיו לא הצליח לנחש אז הוא לא מקבל תור נוסף, והתור עובר לשחקן השני
    {
        document.getElementById(tor+"_board").hidden=true;
        document.getElementById(not_tor+"_board").hidden=false;
        tor=not_tor;
        //pgiha=false;
    }
    if(startG && tor==="c")
    {
        c_board();
    }
}

//פונקציה שמקבלת את גודל הצוללת ואינדקס כלשהו שבו הצוללת ממומקמת ומוצאת את הצוללת במערך, וצובעת את הצוללת בתפריט הצוללות
//הפונקציה פועלת על הצוללות שהשחקן מגלה 
func=(length, i, j, id, arr_submarine)=>
{
    let top=(length==5 ? 0 : Math.abs(length-4));
    let low;
    switch(length)
    {
        case 1: low=7; break;
        case 2: low=4; break;
        default: low=5-length;
    }
    
    //ריצה רק על הצוללות שבגודל הזה
    for(let k=0; k<=top; k++)
    {
        //המערך נמצא בדף הלוח
        if(arr_submarine[k+low].direction==1 && arr_submarine[k+low].i==i && arr_submarine[k+low].j+length>j && arr_submarine[k+low].j-length<j)
        {
            //כלומר הצוללת הזו היא במאוזן
            paint(length, k, id);
            console.log(" נצבע לרוחב" );
            //לצבוע את...
        }
        if(arr_submarine[k+low].direction==0 && arr_submarine[k+low].j==j && arr_submarine[k+low].i+length>i && arr_submarine[k+low].i-length<i)
        {
            //כלומר הצוללת הזו היא במאונך
            paint(length, k, id);
            console.log(" נצבע לאורך" );
            //לצבוע את...
        }
    }
} 

//פונקציה לצביעה...
paint=(length, k, id)=>
{
    let elm;
    for(let i=0; i<length; i++)
    {
        elm=document.getElementById("td"+length+"_"+i+"_number_"+k+"_"+id);
        elm.style.backgroundColor="rgb(216, 76, 92)";
    }
}