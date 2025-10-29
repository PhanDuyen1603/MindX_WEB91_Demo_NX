import bcrypt from 'bcrypt';
import Customer from '../models/Customer.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const API_PREFIX = 'web-';

export const register = asyncHandler(async (req, res) => {
    const {name, email, age, password} = req.body;

    if(!name || !name || !age || !password) {
        return res.status(400).json({message: "All fields are required"});
    }

    //email là duy nhất
    const existed = await Customer.findOne({email});
    if(existed) {
        return res.status(400).json({message: "Email already exists"});
    }

    //hash password
   const passwordHash = await bcrypt.hash(password, 10);

   //tạo customer mới
   const created = await Customer.create({
    name,
    email,
    age,
    passwordHash
   });

   res.status(201).json({
    id: created.id,
    name: created.name,
    email: created.email,
    age: created.age
   });
});

export const login = asyncHandler(async (req, res) => {
    const {email, password} = req.body;

    if(!email ||!password) {
        return res.status(400).json({message: "Email and password are required"});
    }

    const user = await Customer.findOne({email});
    if(!user || !user.passwordHash) {
        return res.status(401).json({message: "Invalid email or password"});
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if(!ok) {
        return res.status(401).json({message: "Invalid email or password"});
    }

    if(!user.apiKeyRand) {
        const { randomBytes } = await import('crypto');
        user.apiKeyRand = randomBytes(6).toString('hex');
        await user.save();
    }

    const apiKey = `${API_PREFIX}$${user.id}$-$${user.email}$-$${user.apiKeyRand}$`; //web-${userId}$-${email}-${randomString}$
    res.json({ apiKey });
});
