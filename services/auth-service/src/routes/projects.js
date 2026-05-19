const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

router.post("/", auth, async (req, res) => {
  try {
    const project = await prisma.project.create({
      data: {
        name: req.body.name,

        userId: req.user.userId,
      },
    });

    res.json(project);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

router.get("/", auth, async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      where: {
        userId: req.user.userId,
      },

      include: {
        files: true,
      },
    });

    res.json(projects);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

module.exports = router;
