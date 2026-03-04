export interface Teacher {
    id: string;
    firstname: string;
    lastname: string;
    tel: string;
    is_tutor: boolean;
    email?:string;
    amount_of_hours: number;
    class: number;
    number_of_class?: number;
}

