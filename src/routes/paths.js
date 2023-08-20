const express = require("express");
const router = express.Router();
const { checkValidToken, isTeacher } = require("../middleware/jwtMiddleware");
const knex = require("knex");
const config = require("../../db/knexfile");
const db = knex(config.development);
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// require('')
/**
 * @swagger
 * tags:
 *  name: Journal-Routes
 *  description: Page Routes Managing Apis
 */
/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user or login
 *     tags: [Journal-Routes]
 *     description: Endpoint to create a new user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *             example:
 *               name: sharan
 *               password: sharan123
 *               role: teacher
 *     responses:
 *       201:
 *         description: User successfully created.
 *         content:
 *           application/json:
 *             example:
 *               message: User created successfully
 *       400:
 *         description: Bad request. Invalid input data.
 */

router.post("/users", async (req, res) => {
  try {
    const { name, role } = req.body;
    var password = req.body.password;
    const existingUser = await db("journalUsers")
      .where({ name: name, role: role })
      .first();
    if (!existingUser) {
      const saltRounds = 10;
      password = await bcrypt.hash(password, saltRounds);
      await db("journalUsers").insert({
        name: name,
        password: password,
        role: role,
      });
    }
    const user = await db("journalUsers")
      .where({ name: name, role: role })
      .first();
    const token = jwt.sign({ name, role }, "mynameisdinesh");
    await db("journaljwtUsers").insert({
      id: user.id,
      jwt: token,
    });
    res.json({ jwt_token: token ,user:user});
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Error creating user" });
  }
});

/**
 * @swagger
 * /createJournal:
 *   post:
 *     summary: Create a new Journal (note:student can't access)(Initially authorize by using jwt token obtained while creating or logging)
 *     tags: [Journal-Routes]
 *     description: Endpoint to create a new Journal.
 *     security:
 *        - jwt: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *               url:
 *                 type: string
 *               publishedDate:
 *                 type: string
 *               students:
 *                 type: array
 *                 items:
 *                  type: integer
 *             example:
 *               description: Creating a new journal by sharan4
 *               url: https://picturesSharan4.com
 *               publishedDate: 19-08-2023
 *               students: [1, 3]
 *     responses:
 *       201:
 *         description: User successfully created.
 *         content:
 *           application/json:
 *             example:
 *               message: User created successfully
 *               journal: ....
 *       400:
 *         description: Bad request. Invalid input data.
 */

router.post("/createJournal", checkValidToken, isTeacher, async (req, res) => {
  try {
    const currentUser = await db("journalUsers")
      .where({ name: req.user.name, role: req.user.role })
      .first();
    const teacherid = currentUser.id;
    const description = req.body.description;
    const url = req.body.url;
    const publishedDate = req.body.publishedDate;
    const [insertedId] = await db("journals2").insert({
      teacherid: teacherid,
      description: description,
      url: url,
      publishedDate: publishedDate,
    });
    const studentTagged = req.body.students.map((studentId) => {
      return {
        journalid: insertedId,
        studentid: studentId,
      };
    });
    await db("tagged2").insert(studentTagged);
    const created=await db("journals2")
    .where({ journalid: insertedId})
    .first();
    // console.log(created);
    res.send({meassage:"created successfully",journal:created});
  } catch (error) {
    res.status(500).send(error);
  }
});

/**
 * @swagger
 * /updateJournal/{id}:
 *   patch:
 *     summary: Update an existing Journal (note:student can't access)(Initially authorize by using jwt token obtained while creating or logging)
 *     tags: [Journal-Routes]
 *     description: Endpoint to create a new Journal.
 *     security:
 *        - jwt: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the journal entry to update
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *               url:
 *                 type: string
 *               publishedDate:
 *                 type: string
 *             example:
 *               url: https://picturesSharan4.com
 *     responses:
 *       201:
 *         description: User successfully updated.
 *         content:
 *           application/json:
 *             example:
 *               message: User updated successfully
 *       400:
 *         description: Bad request. Invalid input data.
 */

router.patch(
  "/updateJournal/:id",
  checkValidToken,
  isTeacher,
  async (req, res) => {
    try {
      console.log(req.user);
      const journalId = req.params.id;
      const updatedData = req.body;
      await db("journals2").where("journalid", journalId).update(updatedData);
      const updated=await db("journals2")
      .where({ journalid: journalId})
      .first();
      res.send({mesaage:"updated successfully",journal:updated});
    } catch (error) {
      res.status(500).send(error);
    }
  }
);

/**
 * @swagger
 * /deleteJournal/{id}:
 *   delete:
 *     summary: deletes the journal based on id (note:student can't access)(Initially authorize by using jwt token obtained while creating or logging)
 *     tags: [Journal-Routes]
 *     description: Endpoint to create a new Journal.
 *     security:
 *        - jwt: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the journal entry to update
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       201:
 *         description: User successfully updated.
 *         content:
 *           application/json:
 *             example:
 *               message: updated successfully
 *               updatedJournal: ...
 *       400:
 *         description: Bad request. Invalid input data.
 */

router.delete(
  "/deleteJournal/:id",
  checkValidToken,
  isTeacher,
  async (req, res) => {
    try {
      // console.log(req.user);
      const journalId = req.params.id;
      const deleted=await db("journals2")
      .where({ journalid: journalId})
      .first();
      await db("journals2").where("journalid", journalId).del();
      await db("tagged2").where("journalid", journalId).del();
      res.send({message:"deleted successfully",deletedJournal:deleted});
    } catch (error) {
      res.status(500).send(error);
    }
  }
);

/**
 * @swagger
 * /showJournal:
 *   get:
 *     summary: shows all journals based on role (shows jounals to the teacher which he/she published and shows journals to students they were tagged) (Initially authorize by using jwt token obtained while creating or logging)
 *     tags: [Journal-Routes]
 *     description: Endpoint to create a new Journal.
 *     security:
 *        - jwt: []
 *     responses:
 *       201:
 *         description: Journals successfully shown.
 *         content:
 *           application/json:
 *             example:
 *               Journals: ....
 *       400:
 *         description: Bad request. Invalid input data.
 */

router.get("/showJournal", checkValidToken, async (req, res) => {
  try {
    const currentUser = await db("journalUsers")
      .where({ name: req.user.name, role: req.user.role })
      .first();
    if (currentUser.role === "teacher") {
      const alljournals = await db("journals2")
        .select()
        .where("teacherid", currentUser.id);
      res.send(alljournals);
    }
    if (currentUser.role === "student") {
      const studentJournals = await db("journals2")
        .join("tagged2", "journals2.journalid", "=", "tagged2.journalid")
        .where("tagged2.studentid", currentUser.id);
      const currentstudentJornals = [];
      studentJournals.map((journel) => {
        const parts = journel.publishedDate.split("-");
        const formattedDateStr = `${parts[1]}/${parts[0]}/${parts[2]}`;
        const date = new Date(formattedDateStr);
        const currentDate = new Date(Date.now());
        if (date <= currentDate) {
          currentstudentJornals.push(journel);
        }
      });
      res.send(currentstudentJornals);
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
