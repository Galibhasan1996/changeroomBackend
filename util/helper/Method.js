import bcrypt from "bcrypt";



export const comparePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword)
}


export const OTP = async () => {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    return (array[0] % 900000 + 100000).toString();
};




// function generateOTP(length = 6) {
//     let otp = '';
//     for (let i = 0; i < length; i++) {
//         otp += Math.floor(Math.random() * 10); // Generates a digit from 0-9
//     }
//     return otp;
// }

// function createOTPWithExpiry() {
//     const otp = generateOTP();
//     const expiryTime = Date.now() + 10 * 60 * 1000; // 10 minutes from now
//     return { otp, expiryTime };
// }

// function isOTPValid(otpObject, inputOTP) {
//     if (Date.now() > otpObject.expiryTime) {
//         return false; // OTP expired
//     }
//     return otpObject.otp === inputOTP; // Check if OTP matches
// }

// // Example usage:
// const otpObject = createOTPWithExpiry();
// console.log("Generated OTP:", otpObject.otp);
// setTimeout(() => {
//     console.log("Is OTP valid?", isOTPValid(otpObject, otpObject.otp)); // Check OTP validity after some time
// }, 5000);