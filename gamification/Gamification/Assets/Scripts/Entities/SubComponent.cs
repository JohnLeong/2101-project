using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class SubComponent
{
    public string Name { get; private set; }
    public int Weightage { get; private set; }
    public int ClassStanding { get; private set; }
    public int TotalMarks { get; private set; }
    public int Marks { get; private set; }

    public SubComponent(string name, int weightage, int classStanding, int totalMarks, int marks)
    {
        Name = name;
        Weightage = weightage;
        ClassStanding = classStanding;
        TotalMarks = totalMarks;
        Marks = marks;
    }

    public Grade CalculateGrade()
    {
        return Grade.A;
    }
}
