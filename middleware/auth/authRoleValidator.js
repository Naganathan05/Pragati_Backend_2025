// the roles is a array of role IDS to be allowed
const authorizeRoles = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.body.roleID)) {
            return res
                .status(403)
                .json({ message: "Forbidden: Insufficient privileges" });
        }
        next();
    };
};

export default authorizeRoles;
