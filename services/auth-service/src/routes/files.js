const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

router.post("/save", auth, async (req, res) => {
  try {
    const { name, language, content, projectId } = req.body;
    const parsedProjectId = Number(projectId);

    if (!name || !language || typeof content !== "string" || !projectId) {
      return res.status(400).json({
        error: "Name, language, content, and projectId are required",
      });
    }

    if (!Number.isInteger(parsedProjectId)) {
      return res.status(400).json({
        error: "projectId must be a valid project id",
      });
    }

    const project = await prisma.project.findFirst({
      where: {
        id: parsedProjectId,
        userId: req.user.userId,
      },
    });

    if (!project) {
      return res.status(404).json({
        error: "Project not found",
      });
    }

    const existingFile = await prisma.file.findFirst({
      where: {
        name,
        projectId: parsedProjectId,
      },
    });

    const file = existingFile
      ? await prisma.file.update({
          where: {
            id: existingFile.id,
          },
          data: {
            language,
            content,
          },
        })
      : await prisma.file.create({
          data: {
            name,
            language,
            content,
            projectId: parsedProjectId,
          },
        });

    res.json(file);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

router.get("/project/:projectId", auth, async (req, res) => {
  try {
    const projectId = Number(req.params.projectId);

    if (!Number.isInteger(projectId)) {
      return res.status(400).json({
        error: "projectId must be a valid project id",
      });
    }

    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId: req.user.userId,
      },
      include: {
        files: true,
      },
    });

    if (!project) {
      return res.status(404).json({
        error: "Project not found",
      });
    }

    res.json(project.files);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

module.exports = router;
