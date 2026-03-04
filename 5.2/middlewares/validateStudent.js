module.exports = (req, res, next) => {
    const { rollNo, name, email, course } = req.body;
    if (!rollNo || !name || !email || !course) {
        return res.status(400).send('All fields are required');
    }
    next();
};
