
export interface Buttonprops {
    variant:  "primary" | "secondary";
    size :"sm" | "md" | "lg";
    text:string;
    startIcon:any;
    endIcon: any ;
    onClick: () => void;
}
export const Button = (props:Buttonprops) =>{
    return <button>
    </button>
}

<Button variant= " primary " size="md" onClick ={} text ={} startIcon ={}/>