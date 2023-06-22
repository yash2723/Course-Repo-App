export const sendToken = (res, user, msg, statusCode = 200) => {

    const token = user.getJWTToken();
    const options = {
        expires: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: true,
        sameSite: "none",
    }

    res.status(statusCode).cookie('token', token, options).json({
        success: true,
        msg: msg,
        user
    });

}