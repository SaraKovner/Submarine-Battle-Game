/**
 * קונסטרקטור למשתמש
 * @param {string} name - שם המשתמש
 * @param {string} pass - סיסמת המשתמש
 */
function user(name, pass)
{
    this.name=name;  // שם המשתמש
    this.pass=pass;  // סיסמת המשתמש
    this.point=0;    // נקודות המשתמש (התחלה ב-0)
}


// משתנים גלובליים
let myp, storage;  // אלמנטים לתצוגת הודעות

// מערך משתמשים קיימים במערכת
let arr=[new user("Sara", "S12K"),
         new user("תהילה", "5689"),
         new user("tehila", "1234"),
         new user("רבקה", "0987"),
         new user("איילה", "4567"),
         new user("יוכי", "1357"), 
         new user("חוי", "6789")];

// שמירת מערך המשתמשים ב-sessionStorage
sessionStorage.setItem("users", JSON.stringify(arr)); 


/**
 * פונקציה לבדיקת כניסה של משתמש קיים
 * בודקת אם שם המשתמש והסיסמה תואמים למשתמש במערכת
 */
function check()
{
    // קבלת הנתונים מהטופס
    let n=document.getElementById("name").value;  // שם המשתמש
    let p=document.getElementById("pass").value;   // סיסמה
    
    // חיפוש המשתמש במערך
    for(let i=0; i<arr.length; i++)
    {
        // אם נמצא משתמש תואם
        if(arr[i].name==n && arr[i].pass==p)
        {
            sessionStorage.setItem("userName", n);  // שמירת שם המשתמש
            window.location="../HTML/before_game.html";  // מעבר למסך הבא
            return;
        }
    }
   
    // הצגת הודעת שגיאה אם המשתמש לא נמצא
    myp=document.getElementById("p");
    myp.innerHTML="הפרטים שהזנת אינם נמצאים במערכת, בדוק את תקינותם או הירשם";
}

/**
 * פונקציה להרשמת משתמש חדש
 * בודקת תקינות הנתונים ומוסיפה משתמש חדש למערכת
 */
function sing()
{
    // קבלת הנתונים מהטופס
    let n=document.getElementById("name").value;      // שם המשתמש
    let p=document.getElementById("pass").value;       // סיסמה
    let cPass=document.getElementById("cPass").value;  // אימות סיסמה
    let my;  // משתנה לאלמנט הודעות

    // בדיקה שהסיסמאות תואמות
    if(cPass!=p)
    {
        my=document.getElementById("con");
        my.innerHTML="הפרטים אינם תואמים";
        return;
    }
    
    // בדיקה שהמשתמש והסיסמה לא קיימים כבר במערכת
    for(let i=0; i<arr.length; i++)
    {
        // בדיקת שם משתמש קיים
        if(arr[i].name==n) 
        {
            my=document.getElementById("p");
            my.innerHTML="שם משתמש תפוס";
            return;
        }
        // בדיקת סיסמה קיימת
        if(arr[i].pass==p)
        {
            my=document.getElementById("p");
            my.innerHTML="הסיסמה תפוסה";
            return;
        }
    }    
    
    // הוספת המשתמש החדש למערכת
    arr = JSON.parse(sessionStorage.getItem("users"));  // טעינת המערך המעודכן
    arr.push(new user(n, p));  // הוספת המשתמש החדש
    sessionStorage.setItem("users", JSON.stringify(arr));  // שמירה חזרה
    sessionStorage.setItem("userName", n);  // שמירת שם המשתמש הנוכחי

    // מעבר למסך הבא
    window.location="../HTML/before_game.html";  
}