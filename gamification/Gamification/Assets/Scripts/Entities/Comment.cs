using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Comment
{
    public string Date { get; private set; }
    public string Body { get; private set; }

    public Comment(string date, string body)
    {
        Date = date;
        Body = body;
    }
}
