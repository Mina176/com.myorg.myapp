module.exports = function () {
    return function (req, res, next) {
        const origSetHeader = res.setHeader;
        res.setHeader = function (name, value) {
            if (String(name).toLowerCase() === "set-cookie") {
                value = [].concat(value).map((c) =>
                    c.replace(/;\s*SameSite=None/i, "")
                );
            }
            return origSetHeader.call(this, name, value);
        };
        next();
    };
};