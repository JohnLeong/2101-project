using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class ModuleComponent
{
    public string Name { get; private set; }
    public string Type { get; private set; }
    public int Weightage { get; private set; }
    public float ClassStandingPercentile { get; private set; }
    public int ClassNumStudents { get; private set; }
    public List<SubComponent> SubComponents { get; private set; }
    public List<Comment> FormativeComments { get; private set; }
    public List<Comment> SummativeComments { get; private set; }

    public ModuleComponent(string name, string type, int weightage, float classStandingPercentile, int classNumStudents
        , List<SubComponent> subComponents, List<Comment> formativeComments, List<Comment> summativeComments)
    {
        Name = name;
        Type = type;
        Weightage = weightage;
        ClassStandingPercentile = classStandingPercentile;
        ClassNumStudents = classNumStudents;
        SubComponents = subComponents;
        FormativeComments = formativeComments;
        SummativeComments = summativeComments;
    }

    public Grade CalculateGrade()
    {
        return Grade.A;
    }
}
