import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const normalizedName = name?.trim();
        const normalizedEmail = email?.trim().toLowerCase();

        // 1. Validate required fields
        if (!normalizedName || !normalizedEmail || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email and password are required"
            });
        }

        // 2. Validate password length
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters"
            });
        }

        // 3. Check whether user already exists
        const existingUser = await User.findOne({
            email: normalizedEmail
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User already exists"
            });
        }

        // 4. Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 5. Create user
        const user = await User.create({
            name: normalizedName,
            email: normalizedEmail,
            password: hashedPassword
        });

        // 6. Send response
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error("Registration error:", error.message);

        // MongoDB duplicate-key error
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "An account with this email already exists"
            });
        }

        return res.status(500).json({
            success: false,
            message: "Server error during registration"
        });
    }
};


export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const normalizedEmail = email?.trim().toLowerCase();

        // 1. Validate required fields
        if (!normalizedEmail || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        // 2. Find user by email
        const user = await User.findOne({
            email: normalizedEmail
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // 3. Compare password
        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // 4. Generate JWT
        const token = jwt.sign(
            {
                userId: user._id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        // 5. Send response
        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error("Login error:", error.message);

        res.status(500).json({
            success: false,
            message: "Server error during login"
        });
    }
};


export const getCurrentUser = async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            user: req.user
        });
    } catch (error) {
        console.error("Get current user error:", error.message);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// Update the logged-in user's profile
export const updateCurrentUser = async (req, res) => {
    try {
        const { name, email } = req.body;

        const normalizedName = name?.trim();
        const normalizedEmail = email?.trim().toLowerCase();

        if (!normalizedName || !normalizedEmail) {
            return res.status(400).json({
                success: false,
                message: "Name and email are required"
            });
        }

        const existingUser = await User.findOne({
            email: normalizedEmail,
            _id: { $ne: req.user._id }
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "This email is already in use"
            });
        }

        const user = await User.findByIdAndUpdate(
            req.user._id,
            {
                $set: {
                    name: normalizedName,
                    email: normalizedEmail
                }
            },
            {
                returnDocument: "after",
                runValidators: true
            }
        ).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user
        });
    } catch (error) {
        console.error("Update profile error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Server error while updating profile"
        });
    }
};

export const adminTest = async (req, res) => {
    res.status(200).json({
        success: true,
        message: "Welcome Admin! You have access to this resource."
    });
};