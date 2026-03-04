import { SubjectOfClasses } from "./subjectsOfClasses";

export class Classes{

    classes:string[]=[];
    subjectsOfClasses:SubjectOfClasses[][]=[];
    // subjectA:any[][]=[['מתמטיקה','תורה','אנגלית','הסטוריה','הנדסה','התעמלות'],[4,5,4,2,1,1]]
    // subjectB:any[][]=[['מתמטיקה','תורה','אנגלית','הסטוריה','הנדסה','התעמלות'],[4,5,4,2,1,1]]
    // subjectC:any[][]=[['מתמטיקה','תורה','אנגלית','הסטוריה','הנדסה','התעמלות'],[4,5,4,2,1,1]]
    // subjectD:any[][]=[['מתמטיקה','תורה','אנגלית','הסטוריה','הנדסה','התעמלות'],[4,5,4,2,1,1]]
    // subjectE:any[][]=[['מתמטיקה','תורה','אנגלית','הסטוריה','הנדסה','התעמלות'],[4,5,4,2,1,1]]
    // subjectF:any[][]=[['מתמטיקה','תורה','אנגלית','הסטוריה','הנדסה','התעמלות'],[4,5,4,2,1,1]]
    // subjectG:any[][]=[['מתמטיקה','תורה','אנגלית','הסטוריה','הנדסה','התעמלות'],[4,5,4,2,1,1]]
    // subjectH:any[][]=[['מתמטיקה','תורה','אנגלית','הסטוריה','הנדסה','התעמלות'],[4,5,4,2,1,1]]


    constructor(){
        this.classes=['כיתה א','כיתה ב','כיתה ג','כיתה ד','כיתה ה','כיתה ו','כיתה ז','כיתה ח'];
        this.subjectsOfClasses=[[{subject:'תורה',count:4},{subject:'תורה',count:4},{subject:'תורה',count:4},{subject:'תורה',count:4},{subject:'תורה',count:4},{subject:'תורה',count:4}],
   [{subject:'חשבון',count:4},{subject:'חשבון',count:4},{subject:'חשבון',count:4},{subject:'חשבון',count:4},{subject:'חשzבון',count:4},{subject:'חשבון',count:4}],
    [{subject:'התעמלות',count:1},{subject:'התעמלות',count:1},{subject:'התעמלות',count:1},{subject:'התעמלות',count:1},{subject:'התעמלות',count:1},{subject:'התעמלות',count:1}],
    [{subject:'נביא',count:2},{subject:'נביא',count:2},{subject:'נביא',count:2},{subject:'נביא',count:2},{subject:'נביא',count:2},{subject:'נביא',count:2}]]
    }
    
}