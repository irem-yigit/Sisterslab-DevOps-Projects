"use strict";
const express = require("express");
const dbConnection = require("./helper/mysql");

const app = express();

//check db connection
dbConnection.getConnection((err, connection) => {
  if (err) {
    console.log("Database connection error: ", err);
  } else {
    console.log("Database connected");
  }
});

/* dbConnection.query(
  "INSERT INTO students (id, name, midterm_grade, final_grade) VALUES (6, 'Fatma', 20, 60)",
  (err, results, fields) => {
    if (err) {
      console.log("Database query error: ", err);
    } else {
      console.log("Data inserted successfully");
    }
  }
); */

// Öğrenci ekleme endpoint'i
app.post("/students/add/id/:name/:midterm_grade/:final_grade ", (req, res) => {
  const { id, name, midterm_grade, final_grade } = req.body;

  if (!id || !name || !midterm_grade || !final_grade) {
    return res.status(400).json({ message: "All fields must be filled." });
  }

  //Yeni öğrenci oluşturma
  const newStudent = {
    id: id,
    name: name,
    midterm_grade: parseInt(midterm_grade),
    final_grade: parseInt(final_grade)
  };

  //Öğrenci listemele
  students.push(newStudent);

    res.status(200).json({ message: "Student added successfully." });
});

//öğrenci getirme endpointi
app.get("/students", (req, res) => {
  dbConnection.query("SELECT * FROM students", (err, results, fields) => {
    if (err) {
      console.log("Database query error: ", err);
    } else {
      res.status(200).json({
        status: "success",
        data: results,
      });
    }
  });
});

//öğrenci id vererek getirme endpointi
app.get("/students/:id", (req, res) => {
  dbConnection.query(
    "SELECT * FROM students WHERE id = ?",
    [req.params.id],
    (err, results, fields) => {
      if (err) {
        console.log("Database query error: ", err);
      } else {
        res.status(200).json({
          status: "success",
          data: results,
        });
      }
    }
  );
});

// Not ortalaması hesaplama endpoint'i
app.get("/students/average", (req, res) => {
  if(students.length === 0){
    return res.status(404).json({ message: "No students added." });
  }

  let totalMidtermGrade = 0;
  let totalFinalGrade = 0;

  students.forEach(student => {
    totalMidtermGrade += student.midterm_grade;
    totalFinalGrade += student.final_grade;
  });

  // Ortalamaları hesaplayalım
  const averageMidtermGrade = totalMidtermGrade / students.length;
  const averageFinalGrade = totalFinalGrade / students.length;

  res.json({ averageMidtermGrade: averageMidtermGrade, averageFinalGrade: averageFinalGrade });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});