import expressJwt from "express-jwt";
import Post from "../models/post";
import User from "../models/users";

export const requireSignin = expressJwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"],
});

export const canEditDeletePost = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params._id);
        console.log("canEditDeletePost MIDDLEWARE => ", post);
        if (req.user._id != post.postedBy) {
            return res.status(400).send("Anauthorised");
        } else {
            next();
        }
    } catch (err) {
        console.log(err);
    }
};

export const isAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        if (user.role !== "Admin") {
            return res.status("400").send("Unauthorised!");
        } else {
            next();
        }
    } catch (err) {
        console.log(err);
    }
};
