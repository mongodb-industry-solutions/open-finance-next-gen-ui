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
        Role: "Banked Customer",
        Employer: "Deloitte Mexico",
        EmploymentType: "FullTime",
        JobTitle: "Accountant",
        IncomeAmount: 5500,
        Currency: "USD",
        IncomeFrequency: "Monthly",
    },
    "66fe219d625d93a100528224": {
        UserName: "hellyrig",
        Role: "Unbanked Customer",
        Employer: null,
        EmploymentType: "Freelance",
        JobTitle: "Freelance Designer",
        IncomeAmount: null,
        Currency: "USD",
        IncomeFrequency: "Irregular",
    }
};

export const USER_LIST = Object.entries(USER_MAP).map(([id, details]) => ({
    id,
    name: details.UserName,
    role: details.Role,
    employer: details.Employer,
    employmentType: details.EmploymentType,
    jobTitle: details.JobTitle,
    incomeAmount: details.IncomeAmount,
    currency: details.Currency,
    incomeFrequency: details.IncomeFrequency,
}));
