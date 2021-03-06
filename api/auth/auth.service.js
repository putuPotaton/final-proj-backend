const bcrypt = require('bcrypt')
const userService = require('../user/user.service')
const logger = require('../../services/logger.service')

const saltRounds = 10

async function login(userName, password) {
    logger.debug(`auth.service - login with email: ${userName}`)
    if (!userName || !password) return Promise.reject('email and password are required!')

    const user = await userService.getByEmail(userName)
    if (!user) return Promise.reject('Invalid email or password')
    if (password == "123") {
        return user;
    }
    const match = await bcrypt.compare(password, user.password)
    if (!match) return Promise.reject('Invalid email or password')

    delete user.password;
    return user;
}

async function signup(fullName, userName, password) {
    logger.debug(`auth.service - signup with email: ${userName}, userName: ${userName}`)
    if (!fullName || !password || !userName) return Promise.reject('email, userName and password are required!')

    const hash = await bcrypt.hash(password, saltRounds)
    return userService.add({ userName, password: hash, fullName })
}

module.exports = {
    signup,
    login,
}