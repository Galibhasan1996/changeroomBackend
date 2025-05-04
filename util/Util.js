import chalk from "chalk";
import os from "node:os";
import { config } from "./EnvVariabe.js";
import JWT from "jsonwebtoken";

export const currentIPAddress = () => {
    // Get network interfaces
    const networkInterfaces = os.networkInterfaces();

    // Filter for IPv4 addresses
    const addresses = [];
    Object.values(networkInterfaces).forEach((interfaces) => {
        interfaces.forEach((iface) => {
            if (iface.family === 'IPv4' && !iface.internal) {
                addresses.push(iface.address);
            }
        });
    });

    // Extract the last number from each IPv4 address
    // const lastNumbers = addresses.map((address) => {
    //     const parts = address.split('.');
    //     return parts[parts.length - 1];
    // });

    return addresses[0]
};

export const customConsole = (message, data) => {
    const now = new Date().toLocaleTimeString();

    const formattedData = typeof data === 'object'
        ? JSON.stringify(data, null, 2)
        : data;

    // console.log(`\x1b[31m ${message} ${now} \x1b[0m`, data);
    console.log(`  <----  ${chalk.bold.red(message)}   Time ${chalk.red(now)} ---->  `, formattedData);

}

export const currentTime = new Date().toLocaleTimeString()

export const ganerateToken = (id) => {
    const token = JWT.sign({ id }, config.get("JWT_SECRET"), { expiresIn: "5d" });
    const refreshToken = JWT.sign({ id }, config.get("JWT_SECRET"), { expiresIn: "10d" });
    return { token, refreshToken };
}





export function parseBoolean(value) {
    const trimmed = value;
    if (trimmed === "true" || trimmed === "True") return true;
    if (trimmed === "false" || trimmed === "False") return false;
    return trimmed;
}

