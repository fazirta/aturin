import { PrismaClient } from "@prisma/client"
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export const register = async (req, res) => {
    const { nama, alamat, no_tlp, pekerjaan, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
      const user = await prisma.user.create({
        data: {
          nama,
          alamat,
          no_tlp,
          pekerjaan,
          email,
          password: hashedPassword,
        },
      });
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  
export const login = async (req, res) => {
    const { emailOrPhone, password } = req.body;
    try {
      const user = await prisma.user.findFirst({
        where: {
          OR: [
            { email: emailOrPhone },
            { no_tlp: emailOrPhone },
          ],
        },
      });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return res.status(401).json({ error: 'Invalid password' });
      }
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };


export const updateUser = async (req, res) => {
    const { nama, alamat, no_tlp, pekerjaan, email, password } = req.body;
    try {
        const user = await prisma.user.update({
            where: {
                id: Number(req.params.id)
            },
            data: {
                nama,
                alamat,
                no_tlp,
                pekerjaan,
                email,
                password
            }
        });
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const profile = async (req, res) => {
    try {
        const response = await prisma.user.findUnique({
            where: {
                id: Number(req.params.id)
            }
        })
        res.status(200).json(response)
    } catch (error) {
        res.status(404).json({ msg: error.message })
    }
}

export const editProfile = async (req, res) => {
    const { id, nama, email, no_tlp, alamat } = req.body;
    try {
        const updatedUser = await prisma.user.update({
            where: {
                id: Number(id)
            },
            data: {
                nama,
                email,
                no_tlp,
                alamat
            }
        })
        res.status(200).json(updatedUser)
    } catch (error) {
        res.status(400).json({ msg: error.message })
    }
}