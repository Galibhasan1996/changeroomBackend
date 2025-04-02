import { check, body } from "express-validator"




export const validateRegister = [
    check("name", "name is required").not().isEmpty().trim(),
    check("email", "email is required and must be valid").isEmail().trim().normalizeEmail({ gmail_remove_dots: true }),
    check("mobile", "mobile is required").not().isEmpty().trim(),
    check("password", "password is required").not().isEmpty().trim(),
    check("dateOfBirth", "date of birth is required and must be in DD-MM-YYYY format").not().isEmpty().trim().isDate({ format: "DD-MM-YYYY" }),
    // check("dateOfBirth")
    //     .custom((value) => {
    //         const currentYear = new Date().getFullYear();
    //         const birthYear = new Date(value).getFullYear();

    //         if (birthYear >= currentYear) {
    //             throw new Error("Date of birth must be less than the current year.");
    //         }
    //         return true;
    //     })
    //     .withMessage("Date of birth must be before the current year.")
    check("dateOfBirth")
        .matches(/^\d{2}-\d{2}-\d{4}$/).withMessage("Date of birth must be in the format DD-MM-YYYY.")
        .bail() // stop further validation if the format is incorrect
        .custom((value) => {
            const currentYear = new Date().getFullYear();
            const currentMonth = new Date().getMonth() + 1; // Months are 0-based
            const currentDate = new Date().getDate();
            const [day, month, year] = value.split('-').map(num => parseInt(num));

            // Check if year of birth is before current year
            if (year >= currentYear) {
                throw new Error("Date of birth must be before the current year.");
            }

            // Calculate age
            const age = currentYear - year;
            const isBeforeBirthdayThisYear = month > currentMonth || (month === currentMonth && day > currentDate);
            const ageInYears = isBeforeBirthdayThisYear ? age - 1 : age;

            // Check if the user is at least 18 years old
            if (ageInYears < 18) {
                throw new Error("You must be at least 18 years old.");
            }

            return true;
        })
]




export const validateLogin = [
    check("email", "email is required and must be valid").isEmail().trim().normalizeEmail({ gmail_remove_dots: true }),
    check("password", "password is required").not().isEmpty().trim(),
]


// export const validateLocker = [
//     // check("sr_no", "sr_no is required").not().isEmpty().trim(), 
//     // check("location", "location is required").not().isEmpty().trim(),
//     // check("locker_no", "locker_no is required").not().isEmpty().trim(),
//     // check("unit", "unit is required").not().isEmpty().trim(),
//     body("code", "code is required").not().isEmpty().trim(),
//     body("name", "name is required").not().isEmpty().trim(),
//     body('role', 'role is required').not().isEmpty().trim(),
//     body("status", "status is required").not().isEmpty().trim(),
//     body("department", "department is required").not().isEmpty().trim(),
//     // check("combine","combine is required").not().isEmpty().trim(),
//     body("shoe_size", "shoe_size is required").not().isEmpty().trim(),
//     // check("image", "image is required").not().isEmpty().trim(),
//     body('aadhar', 'aadhar is required').not().isEmpty().trim(),
//     body("address", "address is required").not().isEmpty().trim(),

// ]


export const validateLocker = [
    body("name", "Name is required").notEmpty().trim().escape(),
    body("code", "Code is required").notEmpty().trim().escape(),
    body("mobile", "Mobile is required and must be a 10-digit number").notEmpty().trim().escape(),
    body("role", "Role is required").notEmpty().trim().escape(),
    body("status", "Status is required and must be boolean").notEmpty().trim().escape(),
    body("department", "Department is required").notEmpty().trim().escape(),
    body("shoe_size", "Shoe size is required and must be a number").notEmpty().trim().escape(),
    body("aadhar", "Aadhar is required and must be a 12-digit number").notEmpty().trim().escape(),
    body("address", "Address is required").notEmpty().trim().escape(),
];


// export const adminLockerValidate = [
//     body("code", "Code is required").notEmpty().trim().escape(),
//     body("before", "before is required").notEmpty().trim().escape(),
//     body("locker_no", "locker_no is required").notEmpty().trim().escape(),
//     body("employee_name", "employee_name is required").notEmpty().trim().escape(),
//     body("department", "Department is required").notEmpty().trim().escape(),
//     body("status", "status size is required").notEmpty().trim().escape(),
//     body("mobile_no", "mobile_no is required").notEmpty().trim().escape(),
// ];


export const adminLockerValidate = [
    body("code").notEmpty().trim().withMessage("Code is required"),
    body("locker_no").notEmpty().trim().withMessage("Locker number is required"),
    body("name").notEmpty().trim().withMessage("Employee name is required"),
    body("department").notEmpty().trim().withMessage("Department is required"),
    body("status").notEmpty().trim().withMessage("Status is required"),
    body("shoe_size").notEmpty().trim().withMessage("shoe_size is required"),
];




export const validateGoggle = [
    check("name", "name is required").not().isEmpty().trim(),
    check("emp_code", "emp_code is required").not().isEmpty().trim(),
    check('employer', 'employer is required').not().isEmpty().trim(),
    check("department", "department is required").not().isEmpty().trim(),
    check("issue_quantity", "issue_quantity is required").not().isEmpty().trim(),
    // check("date", "date is required").not().isEmpty().trim(),
]

export const validateShoe = [
    check("name", "name is required").not().isEmpty().trim(),
    check("emp_code", "emp_code is required").not().isEmpty().trim(),
    check('employer', 'employer is required').not().isEmpty().trim(),
    check("department", "department is required").not().isEmpty().trim(),
    check("issue_quantity", "issue_quantity is required").not().isEmpty().trim(),
    check("mobile", "mobile is required").not().isEmpty().trim(),
    check("shoe_size", "shoe_size is required").not().isEmpty().trim(),
]