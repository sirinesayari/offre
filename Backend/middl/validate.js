

const yup = require("yup");
const validate = async (req, res, next) => {
    try {
        const Schema = yup.object().shape({
            title: yup.string().required(),
            description: yup.string().required()
        });
        await Schema.validate(req.body);
        next();  // Middleware suivant
    } catch (error) {  
        res.status(400).json({ error: error.errors });

    }
};



module.exports =validate ;



