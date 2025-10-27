interface ClassUserBaseI {
    class_id: number;
    user_id: number;
}

// select
export interface ClassUserI extends ClassUserBaseI {
    id: number;
}

// create or update
export interface ClassUserReqI extends ClassUserBaseI {}

// response
export interface ClassUserResI extends ClassUserI {}

