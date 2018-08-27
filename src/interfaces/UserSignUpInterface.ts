export interface UserSignUpInterface {
    uuid?: string;
    displayName: string;
    email: string;
    username: string;
    password: string;
    passwordHashed?: string;
    salt?: string;
    activationCode?: string;
    roles?: string[];
    isActive?: number;
}
