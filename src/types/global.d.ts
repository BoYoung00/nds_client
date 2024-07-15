interface UserToken {
    userToken: string;
    userEmail: string;
}

// SCSS 적용
declare module '*.module.scss' {
    const classes: { [key: string]: string };
    export default classes;
}
