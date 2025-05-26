export interface AcceptanceToken {
    acceptance_token: string;
    accept_personal_auth: string;
}

export interface ResponseAcceptanceToken {
    data: {
        presigned_acceptance: {
            acceptance_token: string;
        };
        presigned_personal_data_auth: {
            acceptance_token: string;
        };
    };
}