// constants.js
/**
 * This file contains constants used throughout the application.
 * It includes a mapping of UserId to user details (UserName and Role).
 * Bearer tokens are fetched from the backend during the bank-login flow.
 * @exports USER_MAP
 * @exports USER_LIST
 */
export const USER_MAP = {
    "65a546ae4a8f64e8f88fb89e": {
        UserName: "fridaklo",
        Role: "Banked Customer"
    },
    "66fe219d625d93a100528224": {
        UserName: "hellyrig",
        Role: "Unbanked Customer"
    }
};

export const USER_LIST = Object.entries(USER_MAP).map(([id, details]) => ({
    id,
    name: details.UserName,
    role: details.Role,
}));
